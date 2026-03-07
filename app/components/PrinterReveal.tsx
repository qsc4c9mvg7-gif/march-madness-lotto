"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
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
          Print My 2025 Ticket
        </button>
      )}

      {/* Printer slot + ticket animation */}
      {(isPrinting || isFinished) && (
        <div className="absolute bottom-0 w-full flex justify-center overflow-hidden pb-4 shadow-[inset_0_-20px_20px_-20px_rgba(0,0,0,0.8)]">
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

            {/* Post-print buttons */}
            {isFinished && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap justify-center gap-3 mt-6"
              >
                <button className="px-6 py-2.5 rounded-full border border-white/40 text-white text-sm font-semibold tracking-wide hover:bg-white/10 transition-colors">
                  Download Ticket
                </button>
                <button className="px-6 py-2.5 rounded-full border border-white/40 text-white text-sm font-semibold tracking-wide hover:bg-white/10 transition-colors">
                  View Full Bracket
                </button>
                <a
                  href="sms:6185580140&body=Hey Shawn, here is my March Madness payment!"
                  className="px-6 py-2.5 rounded-full border border-white/40 text-white text-sm font-semibold tracking-wide hover:bg-white/10 transition-colors"
                >
                  Pay via Apple Cash
                </a>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}

    </div>
  );
}
