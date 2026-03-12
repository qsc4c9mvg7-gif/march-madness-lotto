"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Download, Trophy, DollarSign } from "lucide-react";
import Ticket from "./Ticket";

export default function PrinterReveal() {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  function handlePrint() {
    setIsPrinting(true);
  }

  function handleAnimationComplete() {
    setIsFinished(true);
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.9 } });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden relative">

      {/* Pre-print button */}
      {!isPrinting && !isFinished && (
        <button
          onClick={handlePrint}
          className="bg-white text-black px-8 py-4 rounded-full font-bold tracking-widest uppercase hover:scale-105 transition-transform shadow-lg animate-pulse"
        >
          Print My 2026 Ticket
        </button>
      )}

      {/* LOTTO-style post-print buttons — top of screen */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isFinished ? 1 : 0, y: isFinished ? 0 : -20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`absolute top-12 w-full flex justify-center gap-8 z-50 ${!isFinished ? 'pointer-events-none' : ''}`}
      >
        {/* Download Button */}
        <button className="flex flex-col items-center gap-3 group">
          <div className="w-14 h-14 rounded-full bg-[#F4F4F0] border-[3px] border-black flex items-center justify-center cmyk-dropshadow group-active:scale-95 transition-transform">
            <Download size={24} className="text-black" />
          </div>
          <span className="text-white text-[10px] font-bold tracking-widest uppercase font-compact">Download</span>
        </button>

        {/* Bracket Button */}
        <button className="flex flex-col items-center gap-3 group">
          <div className="w-14 h-14 rounded-full bg-[#F4F4F0] border-[3px] border-black flex items-center justify-center cmyk-dropshadow group-active:scale-95 transition-transform">
            <Trophy size={24} className="text-black" />
          </div>
          <span className="text-white text-[10px] font-bold tracking-widest uppercase font-compact">Bracket</span>
        </button>

        {/* Pay Button */}
        <a href="sms:6185580140&body=Hey Shawn, here is my March Madness payment!" className="flex flex-col items-center gap-3 group">
          <div className="w-14 h-14 rounded-full bg-[#F4F4F0] border-[3px] border-black flex items-center justify-center cmyk-dropshadow group-active:scale-95 transition-transform">
            <DollarSign size={24} className="text-black" />
          </div>
          <span className="text-white text-[10px] font-bold tracking-widest uppercase font-compact">Pay</span>
        </a>
      </motion.div>

      {/* Printer slot + ticket animation */}
      {(isPrinting || isFinished) && (
        <div className="absolute bottom-0 w-full flex justify-center overflow-hidden pt-20 pb-8">
          {/* Slot shadow gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: isPrinting ? "0%" : "100%" }}
            transition={{ duration: 3.5, ease: (t) => Math.floor(t * 14) / 14 }}
            onAnimationComplete={handleAnimationComplete}
            className="w-full max-w-sm px-4"
          >
            <motion.div
              animate={{ x: isPrinting && !isFinished ? [-1, 2, -2, 1, 0] : 0 }}
              transition={{ duration: 0.1, repeat: isPrinting && !isFinished ? Infinity : 0, ease: "linear", times: [0, 0.25, 0.5, 0.75, 1] }}
            >
              <Ticket />
            </motion.div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
