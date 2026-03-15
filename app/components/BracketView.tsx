"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BracketProps {
  userName: string;
  userTeamCount: number;
}

const rounds = ["Round of 64", "Round of 32", "Sweet 16", "Elite 8", "Final 4", "Championship"];

const mockRegions = [
  {
    name: "EAST REGION",
    matchups: [
      { id: 1, team1: { seed: "01", name: "DUKE", owner: "UNCLE BOB'S" }, team2: { seed: "16", name: "STETSON", owner: "SHAWN'S" } },
      { id: 2, team1: { seed: "08", name: "FAU", owner: "SARAH'S" }, team2: { seed: "09", name: "NORTHWESTERN", owner: "MIKE'S" } },
    ],
  },
  {
    name: "WEST REGION",
    matchups: [
      { id: 3, team1: { seed: "02", name: "ARIZONA", owner: "SHAWN'S" }, team2: { seed: "15", name: "LONG BEACH ST", owner: "UNCLE BOB'S" } },
    ],
  },
];

export default function BracketView({ userName, userTeamCount }: BracketProps) {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [filter, setFilter] = useState<"all" | "mine">("all");

  const userLabel = userTeamCount === 1 ? "My Team" : "My Teams";

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col font-compact">

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
        {mockRegions.map((region) => {
          const filteredMatchups = filter === "mine"
            ? region.matchups.filter(
                (m) =>
                  m.team1.owner.includes(userName.toUpperCase()) ||
                  m.team2.owner.includes(userName.toUpperCase())
              )
            : region.matchups;

          if (filteredMatchups.length === 0) return null;

          return (
            <div key={region.name}>
              {/* Sticky Region Header */}
              <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md py-2 border-y border-white/10 mb-4">
                <h2 className="text-center text-white text-xs font-bold tracking-widest uppercase">
                  {region.name}
                </h2>
              </div>

              {/* Matchup Cards */}
              {filteredMatchups.map((matchup) => (
                <div
                  key={matchup.id}
                  className="bg-[#F4F4F0] paper-texture border-[3px] border-black rounded-xl mx-4 mb-4 p-4 relative overflow-hidden font-compact"
                >
                  <div className="absolute inset-0 pointer-events-none halftone-circle opacity-50 z-0" />
                  <div className="absolute inset-0 pointer-events-none halftone-ink-eraser mix-blend-lighten opacity-15 z-1" />
                  <div className="relative z-10">
                  {/* Team 1 */}
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5 ml-14">
                      {matchup.team1.owner}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="font-black text-xl text-black w-10 text-right shrink-0 cmyk-text">
                        {matchup.team1.seed}
                      </span>
                      <span className="font-medium text-xl tracking-tight text-gray-800 uppercase truncate cmyk-text-subtle">
                        {matchup.team1.name}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-dashed border-black/20 my-3 ml-14" />

                  {/* Team 2 */}
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5 ml-14">
                      {matchup.team2.owner}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="font-black text-xl text-black w-10 text-right shrink-0 cmyk-text">
                        {matchup.team2.seed}
                      </span>
                      <span className="font-medium text-xl tracking-tight text-gray-800 uppercase truncate cmyk-text-subtle">
                        {matchup.team2.name}
                      </span>
                    </div>
                  </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
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
        <div style={{ height: 'env(safe-area-inset-bottom)' }} />
      </div>

    </div>
  );
}
