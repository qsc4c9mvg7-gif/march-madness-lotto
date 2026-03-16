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

export function MiniCard({
  matchup,
  plain = false,
}: {
  matchup: Matchup | null | undefined;
  plain?: boolean;
}) {
  if (!matchup) {
    return (
      <div className="w-full h-[62px] border border-dashed border-white/20 rounded-lg" />
    );
  }

  const t1wins = matchup.winner !== "" && matchup.winner === matchup.team1.name;
  const t2wins = matchup.winner !== "" && matchup.winner === matchup.team2.name;

  const seedCls   = plain ? "text-black"   : "cmyk-text";
  const nameCls   = plain ? "text-gray-800" : "cmyk-text-subtle";
  const textSize  = plain ? "text-[21px]"   : "text-xs";
  const ownerSize = plain ? "text-[14px]"   : "text-[9px]";
  const shadowCls = plain ? ""              : "cmyk-dropshadow";

  return (
    <div className={`w-full bg-[#F4F4F0] paper-texture border-[2px] border-black rounded-lg p-3 relative overflow-hidden ${shadowCls}`}>
      <div className="absolute inset-0 pointer-events-none halftone-circle opacity-50 z-0" />
      <div className="absolute inset-0 pointer-events-none halftone-ink-eraser mix-blend-lighten opacity-15 z-10" />
      <div className="relative z-20 flex flex-col gap-2">
        <div className={`flex items-center gap-2 rounded ${t1wins ? "bg-yellow-100/65" : ""}`}>
          <span className={`font-black ${textSize} w-5 text-right shrink-0 ${seedCls} ${t2wins ? "opacity-40 line-through" : ""}`}>
            {matchup.team1.seed}
          </span>
          <span className={`font-medium ${textSize} uppercase min-w-0 flex-1 truncate ${nameCls} ${t2wins ? "opacity-40 line-through" : ""}`}>
            {matchup.team1.name}
          </span>
          {matchup.team1.owner && (
            <span className={`${ownerSize} text-gray-400 font-bold uppercase tracking-wide shrink-0 ${t2wins ? "opacity-40" : ""}`}>
              {matchup.team1.owner}
            </span>
          )}
        </div>
        <div className="border-t border-dashed border-black/20" />
        <div className={`flex items-center gap-2 rounded ${t2wins ? "bg-yellow-100/65" : ""}`}>
          <span className={`font-black ${textSize} w-5 text-right shrink-0 ${seedCls} ${t1wins ? "opacity-40 line-through" : ""}`}>
            {matchup.team2.seed}
          </span>
          <span className={`font-medium ${textSize} uppercase min-w-0 flex-1 truncate ${nameCls} ${t1wins ? "opacity-40 line-through" : ""}`}>
            {matchup.team2.name}
          </span>
          {matchup.team2.owner && (
            <span className={`${ownerSize} text-gray-400 font-bold uppercase tracking-wide shrink-0 ${t1wins ? "opacity-40" : ""}`}>
              {matchup.team2.owner}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function BracketCol({ matchups }: { matchups: (Matchup | null)[] }) {
  return (
    <div className="flex flex-col justify-around h-full py-1 gap-1">
      {matchups.map((m, i) => (
        <MiniCard key={m?.gameId || i} matchup={m} />
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
    <div className="hidden lg:flex fixed inset-0 top-20 bg-slate-900 font-compact z-50 flex-col overflow-auto p-6">
      <div className="min-w-[1200px] h-full flex flex-col">

        {/* East / West region labels */}
        <div className="flex justify-between px-1 pb-1 shrink-0">
          <span className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">East</span>
          <span className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">West</span>
        </div>

        {/* TOP HALF — East (left) + West (right) */}
        <div className="flex-1 grid grid-cols-7 gap-3 items-stretch">
          <BracketCol matchups={eastR64} />
          <BracketCol matchups={eastR32} />
          <BracketCol matchups={[...eastS16, ...eastE8]} />
          <div className="flex items-center w-full">
            <MiniCard matchup={ff[0] ?? null} />
          </div>
          <BracketCol matchups={[...westE8, ...westS16]} />
          <BracketCol matchups={westR32} />
          <BracketCol matchups={westR64} />
        </div>

        {/* Championship row */}
        <div className="shrink-0 flex items-center justify-center gap-3 py-2">
          <div className="h-px flex-1 bg-white/10" />
          <div className="w-[13%]">
            <MiniCard matchup={champ} />
          </div>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* South / Midwest region labels */}
        <div className="flex justify-between px-1 pb-1 shrink-0">
          <span className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">South</span>
          <span className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">Midwest</span>
        </div>

        {/* BOTTOM HALF — South (left) + Midwest (right) */}
        <div className="flex-1 grid grid-cols-7 gap-3 items-stretch">
          <BracketCol matchups={southR64} />
          <BracketCol matchups={southR32} />
          <BracketCol matchups={[...southS16, ...southE8]} />
          <div className="flex items-center w-full">
            <MiniCard matchup={ff[1] ?? null} />
          </div>
          <BracketCol matchups={[...midwestE8, ...midwestS16]} />
          <BracketCol matchups={midwestR32} />
          <BracketCol matchups={midwestR64} />
        </div>

      </div>
    </div>
  );
}
