"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Ticket from "./Ticket";
import BracketView from "./BracketView";

interface PrinterRevealProps {
  name?: string;
  teams?: Array<{ seed: string; name: string }>;
}

export default function PrinterReveal({ name = "PLAYER", teams = [] }: PrinterRevealProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [hasSeenAnimation, setHasSeenAnimation] = useState(false);
  const [showBracket, setShowBracket] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("ticketPrinted")) {
      setHasSeenAnimation(true);
      setIsFinished(true);
    }
  }, []);

  function handlePrint() {
    setIsPrinting(true);
  }

  function handleAnimationComplete() {
    setIsFinished(true);
    localStorage.setItem("ticketPrinted", "true");
  }

  return (
    <div className="fixed inset-0 bg-slate-900 overflow-hidden flex flex-col items-center justify-center">

      {showBracket && (
        <BracketView
          userName={name}
          userTeamCount={teams.length}
        />
      )}

      {/* Top-right: View Bracket button — fades in after print */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isFinished ? 1 : 0 }}
        transition={{ duration: 0.5, delay: hasSeenAnimation ? 0 : 1.1 }}
        className={`fixed top-0 right-0 pt-12 pr-4 z-[60] ${!isFinished ? 'pointer-events-none' : ''}`}
      >
        <button
          onClick={() => setShowBracket(!showBracket)}
          className="text-white/60 text-xs font-bold tracking-widest uppercase hover:text-white transition-colors"
        >
          {showBracket ? "← Ticket" : "Bracket →"}
        </button>
      </motion.div>

      {/* Pre-print button */}
      {!isPrinting && !isFinished && (
        <button
          onClick={handlePrint}
          className="bg-transparent text-white border-[2px] border-white px-8 py-4 rounded-full font-bold tracking-widest uppercase hover:scale-105 transition-transform shadow-lg animate-pulse"
        >
          Print Ticket
        </button>
      )}

      {/* The Main Ticket Wrapper: Starts exactly at the bottom edge of the screen (top-[100%]) */}
      {(isPrinting || isFinished) && (
        <motion.div
          className="absolute top-[100%] w-full flex flex-col items-center z-40"
          initial={{ y: hasSeenAnimation ? "calc(-100vh + 9rem)" : "0%" }}
          animate={{ y: isFinished ? "calc(-100vh + 9rem)" : (isPrinting ? "-55%" : "0%") }}
          transition={
            isFinished
              ? { duration: 0.6, ease: "easeOut" }
              : { duration: 3.5, ease: (t) => Math.floor(t * 14) / 14 }
          }
          onAnimationComplete={() => { if (isPrinting && !isFinished) handleAnimationComplete(); }}
        >
          {/* The Jitter & Scale Wrapper */}
          <motion.div
            animate={{ x: isPrinting && !isFinished ? [-1, 2, -2, 1, 0] : 0 }}
            transition={{ duration: 0.1, repeat: isPrinting && !isFinished ? Infinity : 0, ease: 'linear' }}
            className="w-full max-w-sm px-4"
          >
            <Ticket name={name} teams={teams} />
          </motion.div>
        </motion.div>
      )}

    </div>
  );
}
