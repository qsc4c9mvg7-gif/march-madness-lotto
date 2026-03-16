"use client";

interface Matchup {
  gameId: string;
  round: string;
  region: string;
  team1: { seed: string; name: string; owner: string };
  team2: { seed: string; name: string; owner: string };
  winner: string;
}

interface DesktopBracketProps {
  matchups: any[];
  filter: "all" | "mine";
  userName?: string;
}

function getMatchups(
  all: Matchup[],
  region: string,
  round: string,
  userName: string,
  filter: "all" | "mine"
): (Matchup | null)[] {
  const found = all.filter((m) => m.region === region && m.round === round);
  if (filter === "mine" && userName) {
    return found.map((m) => {
      const owns =
        m.team1.owner.toUpperCase().includes(userName.toUpperCase()) ||
        m.team2.owner.toUpperCase().includes(userName.toUpperCase());
      return owns ? m : null;
    });
  }
  return found;
}

function padTo(arr: (Matchup | null)[], count: number): (Matchup | null)[] {
  const result = [...arr];
  while (result.length < count) result.push(null);
  return result.slice(0, count);
}

function MiniCard({ matchup }: { matchup: Matchup | null | undefined }) {
  if (!matchup) {
    return (
      <div className="w-full h-[62px] border border-dashed border-white/20 rounded-lg" />
    );
  }

  const t1wins = matchup.winner !== "" && matchup.winner === matchup.team1.name;
  const t2wins = matchup.winner !== "" && matchup.winner === matchup.team2.name;

  return (
    <div className="w-full bg-[#F4F4F0] paper-texture border-[2px] border-black rounded-lg p-3 relative overflow-hidden cmyk-dropshadow">
      <div className="absolute inset-0 pointer-events-none halftone-circle opacity-50 z-0" />
      <div className="absolute inset-0 pointer-events-none halftone-ink-eraser mix-blend-lighten opacity-15 z-10" />
      <div className="relative z-20 flex flex-col gap-2">
        <div className={`flex items-center gap-2 rounded px-1 ${t1wins ? "bg-yellow-100" : ""}`}>
          <span className={`font-black text-xs w-5 text-right shrink-0 cmyk-text ${t2wins ? "opacity-40 line-through" : ""}`}>
            {matchup.team1.seed}
          </span>
          <span className={`font-medium text-xs uppercase min-w-0 flex-1 truncate cmyk-text-subtle ${t2wins ? "opacity-40 line-through" : ""}`}>
            {matchup.team1.name}
          </span>
          {matchup.team1.owner && (
            <span className={`text-[9px] text-gray-400 font-bold uppercase tracking-wide shrink-0 ${t2wins ? "opacity-40" : ""}`}>
              {matchup.team1.owner}
            </span>
          )}
        </div>
        <div className="border-t border-dashed border-black/20 ml-7" />
        <div className={`flex items-center gap-2 rounded px-1 ${t2wins ? "bg-yellow-100" : ""}`}>
          <span className={`font-black text-xs w-5 text-right shrink-0 cmyk-text ${t1wins ? "opacity-40 line-through" : ""}`}>
            {matchup.team2.seed}
          </span>
          <span className={`font-medium text-xs uppercase min-w-0 flex-1 truncate cmyk-text-subtle ${t1wins ? "opacity-40 line-through" : ""}`}>
            {matchup.team2.name}
          </span>
          {matchup.team2.owner && (
            <span className={`text-[9px] text-gray-400 font-bold uppercase tracking-wide shrink-0 ${t1wins ? "opacity-40" : ""}`}>
              {matchup.team2.owner}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function BracketCol({
  matchups,
  className = "",
  align = "items-start",
  cardClass = "w-3/4",
}: {
  matchups: (Matchup | null)[];
  className?: string;
  align?: string;
  cardClass?: string;
}) {
  return (
    <div className={`flex flex-col h-full py-1 ${align} ${className}`}>
      {matchups.map((m, i) => (
        <div key={m?.gameId || i} className={cardClass}>
          <MiniCard matchup={m} />
        </div>
      ))}
    </div>
  );
}

export default function DesktopBracket({
  matchups,
  filter,
  userName = "",
}: DesktopBracketProps) {
  const g = (region: string, round: string, count: number) =>
    padTo(
      getMatchups(matchups as Matchup[], region, round, userName, filter),
      count
    );

  const eastR64  = g("East",    "Round of 64", 8);
  const eastR32  = g("East",    "Round of 32", 4);
  const eastS16  = g("East",    "Sweet 16",    2);
  const eastE8   = g("East",    "Elite 8",     1);

  const southR64 = g("South",   "Round of 64", 8);
  const southR32 = g("South",   "Round of 32", 4);
  const southS16 = g("South",   "Sweet 16",    2);
  const southE8  = g("South",   "Elite 8",     1);

  const westR64  = g("West",    "Round of 64", 8);
  const westR32  = g("West",    "Round of 32", 4);
  const westS16  = g("West",    "Sweet 16",    2);
  const westE8   = g("West",    "Elite 8",     1);

  const midwestR64 = g("Midwest", "Round of 64", 8);
  const midwestR32 = g("Midwest", "Round of 32", 4);
  const midwestS16 = g("Midwest", "Sweet 16",    2);
  const midwestE8  = g("Midwest", "Elite 8",     1);

  const ff = padTo(
    (matchups as Matchup[]).filter((m) => m.round === "Final 4"),
    2
  );
  const champ = (matchups as Matchup[]).find((m) => m.round === "Championship") ?? null;

  return (
    <div className="hidden lg:flex fixed inset-0 top-20 bg-slate-900 font-compact z-50 flex-col overflow-y-auto p-6">
      <div className="flex-1 min-h-[1400px] flex flex-col gap-1">

        {/* Region labels — pinned to the outer edges */}
        <div className="flex justify-between px-1 shrink-0 pb-1">
          <span className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">East · South</span>
          <span className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">West · Midwest</span>
        </div>

        {/*
          9-column flexbox bracket — tapered widths + graduated overlap.

          Widths:   R64=22%  R32=19%  S16=16%  E8=13%  CTR=9%
          Overlap:  R64→R32 -4%  R32→S16 -6%  S16→E8 -8%  E8→CTR -8%
          (mirrors on right side)

          Total: 22+(19-4)+(16-6)+(13-8)+(9-8)+(13-8)+(16-6)+(19-4)+(22-4) = 101% ✓

          Card widths grow inward (more card visible as rounds advance):
            R64 w-3/4  ·  R32 w-4/5  ·  S16 w-5/6  ·  E8 w-11/12

          Cards align inward: items-end on left cols, items-start on right cols.
        */}
        <div className="flex-1 flex items-stretch">

          {/* Col 1 — R64 left (East top · South bottom) */}
          <div className="relative z-[1] shrink-0 h-full" style={{ width: "22%" }}>
            <BracketCol matchups={[...eastR64, ...southR64]} align="items-end" cardClass="w-3/4" className="gap-[26px]" />
          </div>

          {/* Col 2 — R32 left · -4% overlap */}
          <div className="relative z-[2] shrink-0 h-full" style={{ width: "19%", marginLeft: "-4%" }}>
            <BracketCol matchups={[...eastR32, ...southR32]} align="items-end" cardClass="w-4/5" className="gap-[114px] pt-[44px]" />
          </div>

          {/* Col 3 — S16 left · -6% overlap */}
          <div className="relative z-[3] shrink-0 h-full" style={{ width: "16%", marginLeft: "-6%" }}>
            <BracketCol matchups={[...eastS16, ...southS16]} align="items-end" cardClass="w-5/6" className="gap-[290px] pt-[132px]" />
          </div>

          {/* Col 4 — E8 left · -8% overlap */}
          <div className="relative z-[4] shrink-0 h-full" style={{ width: "13%", marginLeft: "-8%" }}>
            <BracketCol matchups={[...eastE8, ...southE8]} align="items-end" cardClass="w-11/12" className="gap-[642px] pt-[308px]" />
          </div>

          {/* Col 5 — CENTER · -8% overlap: FF (top) · Championship (mid) · FF (bottom) */}
          <div className="relative z-[5] shrink-0 h-full flex flex-col" style={{ width: "9%", marginLeft: "-8%" }}>
            <div className="flex-1 flex items-center justify-center px-1">
              <div className="w-full"><MiniCard matchup={ff[0] ?? null} /></div>
            </div>
            <div className="flex items-center justify-center px-1 py-2">
              <div className="w-full"><MiniCard matchup={champ} /></div>
            </div>
            <div className="flex-1 flex items-center justify-center px-1">
              <div className="w-full"><MiniCard matchup={ff[1] ?? null} /></div>
            </div>
          </div>

          {/* Col 6 — E8 right · -8% overlap */}
          <div className="relative z-[4] shrink-0 h-full" style={{ width: "13%", marginLeft: "-8%" }}>
            <BracketCol matchups={[...westE8, ...midwestE8]} align="items-start" cardClass="w-11/12" className="gap-[642px] pt-[308px]" />
          </div>

          {/* Col 7 — S16 right · -6% overlap */}
          <div className="relative z-[3] shrink-0 h-full" style={{ width: "16%", marginLeft: "-6%" }}>
            <BracketCol matchups={[...westS16, ...midwestS16]} align="items-start" cardClass="w-5/6" className="gap-[290px] pt-[132px]" />
          </div>

          {/* Col 8 — R32 right · -4% overlap */}
          <div className="relative z-[2] shrink-0 h-full" style={{ width: "19%", marginLeft: "-4%" }}>
            <BracketCol matchups={[...westR32, ...midwestR32]} align="items-start" cardClass="w-4/5" className="gap-[114px] pt-[44px]" />
          </div>

          {/* Col 9 — R64 right (West top · Midwest bottom) · -4% overlap */}
          <div className="relative z-[1] shrink-0 h-full" style={{ width: "22%", marginLeft: "-4%" }}>
            <BracketCol matchups={[...westR64, ...midwestR64]} align="items-start" cardClass="w-3/4" className="gap-[26px]" />
          </div>

        </div>
      </div>
    </div>
  );
}
