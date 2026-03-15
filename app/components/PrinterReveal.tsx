"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Share, Trophy, DollarSign } from "lucide-react";
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
  const ticketRef = useRef<HTMLDivElement>(null);

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

  async function handleDownload() {
    if (!ticketRef.current) return;
    try {
      const domtoimage = (await import("dom-to-image-more")).default;

      // Temporarily remove SVG-based CSS backgrounds to avoid dom-to-image 404 errors
      const ticket = ticketRef.current.querySelector(".paper-texture") as HTMLElement | null;
      if (ticket) ticket.classList.remove("paper-texture");

      const dataUrl = await domtoimage.toPng(ticketRef.current, { scale: 3 });

      if (ticket) ticket.classList.add("paper-texture");
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "march-madness-ticket.png", { type: "image/png" });

      if (navigator.share) {
        await navigator.share({ files: [file] });
      } else {
        const link = document.createElement("a");
        link.download = "march-madness-ticket.png";
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      alert("Download error: " + String(err));
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900 overflow-hidden flex flex-col items-center justify-center">

      {showBracket && (
        <BracketView
          userName={name}
          userTeamCount={teams.length}
          onClose={() => setShowBracket(false)}
        />
      )}

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
          initial={{ y: hasSeenAnimation ? "calc(-50vh - 50%)" : "0%" }}
          animate={{ y: isFinished ? "calc(-50vh - 50%)" : (isPrinting ? "-95%" : "0%") }}
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
            ref={ticketRef}
          >
            <Ticket name={name} teams={teams} />
          </motion.div>

          {/* Post-print buttons — sit below ticket, travel with it */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isFinished ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className={`flex justify-center gap-6 mt-8 ${!isFinished ? 'pointer-events-none' : ''}`}
          >
            <button onClick={handleDownload} className="w-10 h-10 rounded-full bg-transparent border-[2px] border-white flex items-center justify-center active:scale-95 transition-transform" style={{ borderColor: 'white', color: 'white' }}>
              <Share size={16} style={{ color: 'white' }} />
            </button>
            <button onClick={() => setShowBracket(true)} className="w-10 h-10 rounded-full bg-transparent border-[2px] border-white flex items-center justify-center active:scale-95 transition-transform" style={{ borderColor: 'white', color: 'white' }}>
              <Trophy size={16} style={{ color: 'white' }} />
            </button>
            <a href="sms:6185580140&body=Hey Shawn, here is my March Madness payment!" className="w-10 h-10 rounded-full bg-transparent border-[2px] border-white flex items-center justify-center active:scale-95 transition-transform" style={{ borderColor: 'white', color: 'white' }}>
              <DollarSign size={16} style={{ color: 'white' }} />
            </a>
          </motion.div>
        </motion.div>
      )}

    </div>
  );
}
