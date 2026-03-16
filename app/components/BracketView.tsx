"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DesktopBracket from "./DesktopBracket";

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

  const userLabel = userTeamCount === 1 ? "My Team" : "My Teams";

  useEffect(() => {
    fetch(CSV_URL)
      .then((res) => res.text())
      .then((text) => {
        const parsed = parseCSV(text);
        setMatchups(parsed);

        // Auto-advance: find first round with at least one incomplete matchup
        const activeIndex = rounds.findIndex((round) => {
          const roundMatchups = parsed.filter(
            (m) => m.round === round && m.team1.name !== ""
          );
          return roundMatchups.length > 0 && roundMatchups.some((m) => m.winner === "");
        });
        setCurrentRoundIndex(activeIndex === -1 ? rounds.length - 1 : activeIndex);
      })
      .finally(() => setLoading(false));
  }, []);

  const currentRound = rounds[currentRoundIndex];

  // Filter by current round, then group by region
  const roundMatchups = matchups.filter((m) => m.round === currentRound);

  const filteredMatchups =
    filter === "mine"
      ? roundMatchups.filter(
          (m) =>
            m.team1.owner.toUpperCase().includes(userName.toUpperCase()) ||
            m.team2.owner.toUpperCase().includes(userName.toUpperCase())
        )
      : roundMatchups;

  // Group by region, preserving CSV order
  const regions = filteredMatchups.reduce<{ name: string; matchups: Matchup[] }[]>(
    (acc, m) => {
      const existing = acc.find((r) => r.name === m.region);
      if (existing) {
        existing.matchups.push(m);
      } else {
        acc.push({ name: m.region, matchups: [m] });
      }
      return acc;
    },
    []
  );

  return (
    <>
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col font-compact lg:hidden">

      {/* Top Bar */}
      <div className="bg-slate-900 pt-12 pb-4 px-4 z-20">
        <div className="flex items-center justify-start">
          {/* Filter toggle — March Madness badge style */}
          <div className="flex items-stretch font-compact">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 flex items-center font-bold uppercase text-sm tracking-wide transition-colors cmyk-boxbleed ${
                filter === "all"
                  ? "bg-[#F4F4F0] text-black border-[2px] border-black"
                  : "bg-black text-white border-[2px] border-black"
              }`}
            >
              All Teams
            </button>
            <button
              onClick={() => setFilter("mine")}
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
        ) : regions.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <span className="text-white/40 text-xs font-bold tracking-widest uppercase">
              No matchups
            </span>
          </div>
        ) : (
          regions.map((region) => (
            <div key={region.name}>
              {/* Sticky Region Header */}
              <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md py-2 border-y border-white/10 mb-4">
                <h2 className="text-center text-white text-xs font-bold tracking-widest uppercase">
                  {region.name}
                </h2>
              </div>

              {/* Matchup Cards */}
              {region.matchups.map((matchup, idx) => {
                const team1Won = matchup.winner !== "" && matchup.winner === matchup.team1.name;
                const team2Won = matchup.winner !== "" && matchup.winner === matchup.team2.name;

                return (
                  <div
                    key={matchup.gameId || `${region.name}-${idx}`}
                    className="bg-[#F4F4F0] paper-texture border-[3px] border-black rounded-xl mx-4 mb-4 p-4 relative overflow-hidden font-compact"
                  >
                    <div className="absolute inset-0 pointer-events-none halftone-circle opacity-50 z-0" />
                    <div className="absolute inset-0 pointer-events-none halftone-ink-eraser mix-blend-lighten opacity-15 z-1" />
                    <div className="relative z-10">

                      {/* Team 1 */}
                      <div className={`flex flex-col rounded-md ${team1Won ? "bg-yellow-100/50" : ""}`}>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5 ml-14">
                          {matchup.team1.owner}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className={`font-black text-xl text-black w-10 text-right shrink-0 cmyk-text ${team2Won ? "opacity-40 line-through" : ""}`}>
                            {matchup.team1.seed}
                          </span>
                          <span className={`font-medium text-xl tracking-tight text-gray-800 uppercase truncate cmyk-text-subtle ${team2Won ? "opacity-40 line-through" : ""}`}>
                            {matchup.team1.name}
                          </span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-dashed border-black/20 my-3 ml-14" />

                      {/* Team 2 */}
                      <div className={`flex flex-col rounded-md ${team2Won ? "bg-yellow-100/50" : ""}`}>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5 ml-14">
                          {matchup.team2.owner}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className={`font-black text-xl text-black w-10 text-right shrink-0 cmyk-text ${team1Won ? "opacity-40 line-through" : ""}`}>
                            {matchup.team2.seed}
                          </span>
                          <span className={`font-medium text-xl tracking-tight text-gray-800 uppercase truncate cmyk-text-subtle ${team1Won ? "opacity-40 line-through" : ""}`}>
                            {matchup.team2.name}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Bottom Bar — Round Navigation */}
      <div className="absolute bottom-0 w-full bg-[#d9253a] border-t-[3px] border-[#FCEE21] z-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none halftone-banner opacity-40 mix-blend-multiply z-0" />
        <div className="relative z-10 flex items-center justify-between px-6 py-3">
          <button
            onClick={() => setCurrentRoundIndex((i) => Math.max(0, i - 1))}
            className="text-white disabled:text-white/30 transition-colors"
            disabled={currentRoundIndex === 0}
          >
            <ChevronLeft size={24} />
          </button>

          <span className="text-white text-base font-bold tracking-widest uppercase font-compact">
            {rounds[currentRoundIndex]}
          </span>

          <button
            onClick={() => setCurrentRoundIndex((i) => Math.min(rounds.length - 1, i + 1))}
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
