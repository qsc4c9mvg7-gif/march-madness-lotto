"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DesktopBracket, { MiniCard } from "./DesktopBracket";

interface BracketProps {
  userName: string;
  userTeamCount: number;
}

interface Matchup {
  gameId: string;
  round: string;
  region: string;
  team1: { seed: string; name: string; owner: string };
  team2: { seed: string; name: string; owner: string };
  winner: string;
}

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRcgRmpCty27-PICDIpIRJavS3LyF4v5E8fD8P6JEpVi9maKBbQnhH2-HsaeaETYikh9vOX91qIrbnK/pub?output=csv";

const rounds = [
  "First Four",
  "Round of 64",
  "Round of 32",
  "Sweet 16",
  "Elite 8",
  "Final 4",
  "Championship",
];

function parseCSV(text: string): Matchup[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  const matchups: Matchup[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = values[idx] ?? ""; });

    if (!row["Team1_Name"]) continue;

    matchups.push({
      gameId: row["Game_ID"] ?? "",
      round: row["Round"] ?? "",
      region: row["Region"] ?? "",
      team1: {
        seed: row["Team1_Seed"] ?? "",
        name: row["Team1_Name"] ?? "",
        owner: row["Team1_Owner"] ?? "",
      },
      team2: {
        seed: row["Team2_Seed"] ?? "",
        name: row["Team2_Name"] ?? "",
        owner: row["Team2_Owner"] ?? "",
      },
      winner: row["Winner"] ?? "",
    });
  }

  return matchups;
}

export default function BracketView({ userName, userTeamCount }: BracketProps) {
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [filter, setFilter] = useState<"all" | "mine">("all");
  const [hasManualRound, setHasManualRound] = useState(false);

  const userLabel = userTeamCount === 1 ? "My Team" : "My Teams";

  useEffect(() => {
    const savedFilter = localStorage.getItem("bracketFilter");
    if (savedFilter === "all" || savedFilter === "mine") setFilter(savedFilter);
    const savedRound = localStorage.getItem("bracketRoundIndex");
    if (savedRound !== null) {
      setCurrentRoundIndex(Number(savedRound));
      setHasManualRound(true);
    }
  }, []);

  useEffect(() => {
    fetch(CSV_URL)
      .then((res) => res.text())
      .then((text) => {
        const parsed = parseCSV(text);
        setMatchups(parsed);

        if (!hasManualRound) {
          // Auto-advance: find first round with at least one incomplete matchup
          const activeIndex = rounds.findIndex((round) => {
            const roundMatchups = parsed.filter(
              (m) => m.round === round && m.team1.name !== ""
            );
            return roundMatchups.length > 0 && roundMatchups.some((m) => m.winner === "");
          });
          setCurrentRoundIndex(activeIndex === -1 ? rounds.length - 1 : activeIndex);
        }
      })
      .finally(() => setLoading(false));
  }, [hasManualRound]);

  const currentRound = rounds[currentRoundIndex];
  const roundMatchups = matchups.filter((m) => m.round === currentRound);

  const ownerMatch = (m: Matchup) =>
    m.team1.owner.toUpperCase().includes(userName.toUpperCase()) ||
    m.team2.owner.toUpperCase().includes(userName.toUpperCase());

  const toSlot = (m: Matchup): Matchup | null =>
    filter === "all" || ownerMatch(m) ? m : null;

  // Fixed slot counts per round
  const REGION_SLOTS: Record<string, number> = {
    "Round of 64": 8,
    "Round of 32": 4,
    "Sweet 16": 2,
    "Elite 8": 1,
  };
  const REGION_ORDER = ["East", "South", "West", "Midwest"];

  type Section = { label: string | null; slots: (Matchup | null)[] };
  let displaySections: Section[];

  if (REGION_SLOTS[currentRound] !== undefined) {
    // Regional rounds: pad each region to its expected slot count
    const count = REGION_SLOTS[currentRound];
    displaySections = REGION_ORDER.map((region) => {
      const regionMatchups = roundMatchups.filter((m) => m.region === region);
      const slots: (Matchup | null)[] = Array.from(
        { length: count },
        (_, i) => (regionMatchups[i] ? toSlot(regionMatchups[i]) : null)
      );
      return { label: region, slots };
    });
  } else if (currentRound === "Final 4") {
    const slots: (Matchup | null)[] = Array.from(
      { length: 2 },
      (_, i) => (roundMatchups[i] ? toSlot(roundMatchups[i]) : null)
    );
    displaySections = [{ label: null, slots }];
  } else if (currentRound === "Championship") {
    const slots: (Matchup | null)[] = [
      roundMatchups[0] ? toSlot(roundMatchups[0]) : null,
    ];
    displaySections = [{ label: null, slots }];
  } else {
    // First Four — group by region so region headers appear
    if (roundMatchups.length > 0) {
      const regionsSeen: string[] = [];
      roundMatchups.forEach((m) => {
        if (m.region && !regionsSeen.includes(m.region)) regionsSeen.push(m.region);
      });
      displaySections = regionsSeen.map((region) => ({
        label: region,
        slots: roundMatchups.filter((m) => m.region === region).map(toSlot),
      }));
    } else {
      displaySections = [];
    }
  }

  return (
    <>
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col font-compact lg:hidden">

      {/* Top Bar */}
      <div className="bg-slate-900 pt-8 pb-4 px-4 z-20">
        <div className="flex items-center justify-start">
          {/* Filter toggle — March Madness badge style */}
          <div className="flex items-stretch font-compact">
            <button
              onClick={() => { setFilter("all"); localStorage.setItem("bracketFilter", "all"); }}
              className={`px-3 py-1 flex items-center font-bold uppercase text-sm tracking-wide transition-colors cmyk-boxbleed ${
                filter === "all"
                  ? "bg-[#F4F4F0] text-black border-[2px] border-black"
                  : "bg-black text-white border-[2px] border-black"
              }`}
            >
              All Teams
            </button>
            <button
              onClick={() => { setFilter("mine"); localStorage.setItem("bracketFilter", "mine"); }}
              className={`px-3 py-1 flex items-center font-bold uppercase text-sm tracking-wide transition-colors cmyk-boxbleed ${
                filter === "mine"
                  ? "bg-[#F4F4F0] text-black border-[2px] border-black border-l-0"
                  : "bg-black text-white border-[2px] border-black border-l-0"
              }`}
            >
              {userLabel}
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <span className="text-white/40 text-xs font-bold tracking-widest uppercase">
              Loading…
            </span>
          </div>
        ) : (
          displaySections.map((section, sIdx) => (
            <div key={section.label ?? `section-${sIdx}`}>
              {/* Sticky Region Header — only for regional rounds */}
              {section.label && (
                <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md py-2 border-y border-white/10 mb-4">
                  <h2 className="text-center text-white text-xs font-bold tracking-widest uppercase">
                    {section.label}
                  </h2>
                </div>
              )}

              {/* Matchup Cards */}
              {section.slots.map((matchup, idx) => (
                <div key={matchup?.gameId ?? `slot-${sIdx}-${idx}`} className="mx-4 mb-3">
                  <MiniCard matchup={matchup} plain />
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Bottom Bar — Round Navigation */}
      <div className="absolute bottom-0 w-full bg-[#d9253a] border-t-[3px] border-[#FCEE21] z-40 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none halftone-banner opacity-40 mix-blend-multiply z-0" />
        <div className="relative z-10 flex items-center justify-between px-6 py-[11px]">
          <button
            onClick={() => {
              const next = Math.max(0, currentRoundIndex - 1);
              setCurrentRoundIndex(next);
              setHasManualRound(true);
              localStorage.setItem("bracketRoundIndex", String(next));
            }}
            className="text-white disabled:text-white/30 transition-colors"
            disabled={currentRoundIndex === 0}
          >
            <ChevronLeft size={24} />
          </button>

          <span className="text-white text-base font-bold tracking-widest uppercase font-compact">
            {rounds[currentRoundIndex]}
          </span>

          <button
            onClick={() => {
              const next = Math.min(rounds.length - 1, currentRoundIndex + 1);
              setCurrentRoundIndex(next);
              setHasManualRound(true);
              localStorage.setItem("bracketRoundIndex", String(next));
            }}
            className="text-white disabled:text-white/30 transition-colors"
            disabled={currentRoundIndex === rounds.length - 1}
          >
            <ChevronRight size={24} />
          </button>
        </div>
        {/* Safe area spacer */}
        <div style={{ height: "env(safe-area-inset-bottom)" }} />
      </div>

    </div>
      <DesktopBracket matchups={matchups} filter={filter} userName={userName} />
    </>
  );
}
