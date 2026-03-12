"use client";

import React from "react";
import { Dribbble } from "lucide-react";

const teams = [
  { seed: "09", name: "CREIGHTON" },
  { seed: "10", name: "VANDERBILT" },
  { seed: "16", name: "MOUNT ST. MARY'S" },
  { seed: "16", name: "ALABAMA STATE" },
];

const barcodePattern = [3,1,1,2,4,1,1,3,2,1,1,2,3,1,4,1,1,2,1,3,2,1,1,4,1,2,3,1,1,2,4,1,1,3,1,2,1,1,4,2,1,3,1,1,2,4,1,1,3,2,1,1,4,1,2,3,1,1,2,1,4,1,1,3,2,1];

export default function Ticket() {
  return (
    <div className="relative max-w-sm w-full mx-auto bg-[#F4F4F0] paper-texture rounded-xl shadow-2xl overflow-hidden font-compact text-black cmyk-text">

      {/* Ink eraser halftone — texturizes dark pixels only */}
      <div className="absolute inset-0 pointer-events-none halftone-ink-eraser mix-blend-lighten opacity-15 z-20 pr-10"></div>

      {/* Right Banner */}
      <div className="absolute inset-y-0 right-0 w-10 bg-[#d9253a] border-l-[3px] border-[#FCEE21] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none halftone-banner opacity-40 mix-blend-multiply z-0"></div>
        <div
          className="relative z-10 whitespace-nowrap flex items-center gap-3 text-white text-sm font-bold tracking-widest"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          <span>2026 MARCH MADNESS LOTTERY</span>
          <Dribbble className="w-4 h-4 fill-white text-[#E31837] shrink-0" />
          <span>2026 MARCH MADNESS LOTTERY</span>
          <Dribbble className="w-4 h-4 fill-white text-[#E31837] shrink-0" />
          <span>2026 MARCH MADNESS LOTTERY</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 pr-14 flex flex-col">

        {/* Tournament label */}
        <p className="text-xs text-gray-600 tracking-wider uppercase mb-1">
          2026 Tournament
        </p>

        {/* LOTTO circles */}
        <div className="flex justify-between w-full max-w-[240px]">
          {["L", "O", "T", "T", "O"].map((letter, i) => (
            <div
              key={i}
              className="w-12 h-12 flex items-center justify-center rounded-full border-[3px] border-black text-3xl font-black cmyk-boxbleed"
            >
              {letter}
            </div>
          ))}
        </div>

        {/* March Madness badge */}
        <div className="flex items-stretch justify-end max-w-[240px] mt-1">
          <div className="bg-black text-white px-2 py-0.5 flex items-center font-bold uppercase text-sm cmyk-boxbleed">
            March
          </div>
          <div className="bg-[#F4F4F0] text-black border-[2px] border-black border-l-0 px-2 py-0.5 flex items-center font-bold uppercase text-sm cmyk-boxbleed">
            Madness
          </div>
        </div>

        {/* Teams */}
        <div className="mt-12 space-y-3">
          {teams.map((team, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="font-black text-xl text-black w-10 text-right shrink-0">
                {team.seed}
              </span>
              <span className="font-medium text-xl tracking-tight text-gray-800 uppercase truncate">
                {team.name}
              </span>
            </div>
          ))}
        </div>

        {/* Payouts */}
        <div className="grid grid-cols-[max-content_max-content] gap-x-3 gap-y-0.5 justify-center mx-auto mt-12">
            {[
              { amount: "$5.00",  round: "ROUND OF 32" },
              { amount: "$10.00", round: "SWEET 16" },
              { amount: "$20.00", round: "ELITE 8" },
              { amount: "$30.00", round: "FINAL 4" },
              { amount: "$80.00", round: "CHAMPION" },
            ].map((item, i) => (
              <React.Fragment key={i}>
                <div className="text-left font-black text-sm text-black">{item.amount}</div>
                <div className="text-left font-medium text-sm text-gray-800 flex items-center">{item.round}</div>
              </React.Fragment>
            ))}
        </div>

        {/* Barcode */}
        <div className="flex justify-center mt-8">
          <div className="relative flex h-10 scale-x-[1.8] origin-center">
            {/* Cyan offset layer */}
            <div className="absolute inset-0 flex translate-x-[0.6px] translate-y-[0.6px]" style={{ opacity: 0.4 }}>
              {barcodePattern.map((width, i) => (
                <div key={i} className={`h-full ${i % 2 === 0 ? "" : "bg-transparent"}`}
                  style={{ width: `${width}px`, backgroundColor: i % 2 === 0 ? "rgba(0,255,255,1)" : "transparent" }} />
              ))}
            </div>
            {/* Magenta offset layer */}
            <div className="absolute inset-0 flex -translate-x-[0.6px] -translate-y-[0.6px]" style={{ opacity: 0.4 }}>
              {barcodePattern.map((width, i) => (
                <div key={i}
                  style={{ width: `${width}px`, height: "100%", backgroundColor: i % 2 === 0 ? "rgba(255,0,255,1)" : "transparent" }} />
              ))}
            </div>
            {/* Real black bars on top */}
            {barcodePattern.map((width, i) => (
              <div
                key={i}
                className={`h-full relative ${i % 2 === 0 ? "bg-black" : "bg-transparent"}`}
                style={{ width: `${width}px` }}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
