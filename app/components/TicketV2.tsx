"use client";

import React from "react";
import { Trophy } from "lucide-react";

const teams = [
  { seed: "09", name: "CREIGHTON" },
  { seed: "10", name: "VANDERBILT" },
  { seed: "16", name: "MOUNT ST. MARY'S" },
  { seed: "16", name: "ALABAMA STATE" },
];

const champion = { seed: "05", name: "MICHIGAN ST" };

const prizes = [
  { round: "ROUND OF 32", amount: "$5.00" },
  { round: "SWEET 16",    amount: "$10.00" },
  { round: "ELITE 8",     amount: "$20.00" },
  { round: "FINAL 4",     amount: "$30.00" },
  { round: "CHAMPION",    amount: "$80.00", highlight: true },
];

const serial = "MM-2026-03-11-A7F9K2";

const barcodePattern = [3,1,1,2,4,1,1,3,2,1,1,2,3,1,4,1,1,2,1,3,2,1,1,4,1,2,3,1,1,2,4,1,1,3,1,2,1,1,4,2,1,3,1,1,2,4,1,1,3,2,1,1,4,1,2,3,1,1,2,1,4,1,1,3,2,1];

const paperTexture = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")";

export default function TicketV2() {
  return (
    <div
      style={{
        width: 375,
        borderRadius: 12,
        overflow: "hidden",
        background: "#FFFFFF",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        fontFamily: "'SF Compact Display','Roboto Condensed','DIN Condensed',sans-serif",
        position: "relative",
      }}
    >
      {/* Global paper texture */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
          backgroundImage: paperTexture,
          backgroundSize: "200px 200px",
          mixBlendMode: "multiply",
        }}
      />

      {/* ── SECTION 1: HEADER ─────────────────────────── */}
      <div
        style={{
          position: "relative",
          height: 120,
          background: "radial-gradient(ellipse at 50% 40%, #FF2D2D 0%, #B01818 65%, #8B0000 100%)",
          overflow: "hidden",
        }}
      >
        {/* Light rays */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.18) 0%, transparent 65%)" }} />
        {/* Gloss */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.08) 100%)" }} />
        {/* Halftone */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(0,0,0,1) 0.75px, transparent 0.75px)", backgroundSize: "4px 4px", opacity: 0.02 }} />

        {/* Date stamp */}
        <div style={{ position: "absolute", top: 14, right: 16, fontSize: 9, color: "rgba(255,255,255,0.7)", letterSpacing: 0.5, fontFamily: "monospace" }}>
          WED MAR 11 2026 | 3:42 PM
        </div>

        {/* Logo */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 6 }}>
          <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: 2, color: "#FFFFFF", textShadow: "0 2px 4px rgba(0,0,0,0.3)", lineHeight: 1 }}>
            BRACKET BALL
          </div>
          <div style={{ fontSize: 11, letterSpacing: 1.5, color: "rgba(255,255,255,0.9)", fontWeight: 500, marginTop: 5 }}>
            NCAA TOURNAMENT EDITION
          </div>
        </div>
      </div>

      {/* ── SECTION 2: YOUR TEAMS ─────────────────────── */}
      <div style={{ background: "#FFFFFF", padding: "24px 24px 20px" }}>
        {/* Section title */}
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: "#666666", paddingBottom: 12, borderBottom: "1px solid #E0E0E0", marginBottom: 20, textTransform: "uppercase" }}>
          Your Teams
        </div>

        {/* Team list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {teams.map((team, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* Seed circle */}
              <div style={{
                width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
                background: "#FFFFFF", border: "3px solid #000000",
                boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ fontSize: 8, color: "#999999", lineHeight: 1 }}>No.</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#000000", lineHeight: 1.1 }}>{team.seed}</div>
              </div>
              {/* Team name */}
              <div style={{ fontSize: 14, fontWeight: 700, color: "#000000", letterSpacing: 0.3 }}>
                {team.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 3: CHAMPIONSHIP PICK ──────────────── */}
      <div style={{
        background: "linear-gradient(to bottom, #FFE8E8, #FFFFFF)",
        padding: "18px 20px 18px",
        borderTop: "2px dashed #CCCCCC",
        borderBottom: "2px dashed #CCCCCC",
      }}>
        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF2D2D", flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#B01818", textTransform: "uppercase" }}>
            Championship Pick
          </span>
        </div>

        {/* Ball + details */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Power ball */}
          <div style={{
            width: 70, height: 70, borderRadius: "50%", flexShrink: 0, position: "relative",
            background: "radial-gradient(circle at 38% 35%, #FF4545, #CC0000)",
            boxShadow: "inset 0 -3px 6px rgba(0,0,0,0.2), 0 4px 12px rgba(255,0,0,0.3)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            {/* Gloss highlight */}
            <div style={{
              position: "absolute", top: 8, left: 12, width: 30, height: 20, borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(255,255,255,0.32), transparent)",
            }} />
            {/* Halftone */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden",
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 0.75px, transparent 0.75px)",
              backgroundSize: "4px 4px", opacity: 0.03,
            }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", lineHeight: 1, position: "relative" }}>#{champion.seed}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2, position: "relative", textAlign: "center", maxWidth: 58 }}>
              {champion.name}
            </span>
          </div>

          {/* Details */}
          <div>
            <div style={{ fontSize: 11, color: "#666666" }}>Seed #{champion.seed} • Champion Pick</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#B01818", marginTop: 6 }}>Wins all → $80.00</div>
          </div>
        </div>
      </div>

      {/* ── SECTION 4: PRIZE STRUCTURE ────────────────── */}
      <div style={{ background: "#F8F8F8", padding: "20px 20px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, color: "#666666", marginBottom: 16, textTransform: "uppercase" }}>
          Prize Structure
        </div>

        {prizes.map((p, i) => (
          <div
            key={i}
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              height: 28,
              borderBottom: i < prizes.length - 1 ? "1px solid #E5E5E5" : "none",
              background: p.highlight ? "linear-gradient(to right, #FFF3F3, transparent)" : "transparent",
              padding: "0 4px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {p.highlight && <Trophy size={13} color="#B01818" />}
              <span style={{ fontSize: p.highlight ? 13 : 11, fontWeight: 700, color: "#000000" }}>{p.round}</span>
            </div>
            <span style={{ fontSize: p.highlight ? 13 : 11, fontWeight: 700, color: "#B01818" }}>{p.amount}</span>
          </div>
        ))}
      </div>

      {/* ── SECTION 5: FOOTER ─────────────────────────── */}
      <div style={{ background: "#000000", padding: "16px 16px 14px", position: "relative", overflow: "hidden" }}>
        {/* Halftone */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,1) 0.75px, transparent 0.75px)",
          backgroundSize: "4px 4px", opacity: 0.02,
        }} />

        {/* Barcode */}
        <div style={{ background: "#FFFFFF", borderRadius: 3, padding: "4px 8px", width: "90%", margin: "0 auto 10px" }}>
          <div style={{ display: "flex", height: 36, width: "100%" }}>
            {barcodePattern.map((w, i) => (
              <div key={i} style={{ height: "100%", width: w, background: i % 2 === 0 ? "#000000" : "transparent", flexShrink: 0 }} />
            ))}
          </div>
        </div>

        {/* Serial */}
        <div style={{ textAlign: "center", fontFamily: "monospace", fontSize: 10, color: "#FFFFFF", letterSpacing: 2, marginBottom: 8 }}>
          {serial}
        </div>

        {/* Fine print */}
        <div style={{ textAlign: "center", fontSize: 7, color: "#999999", lineHeight: 1.4, maxWidth: "90%", margin: "0 auto" }}>
          Valid for 2026 NCAA Tournament only | Void where prohibited
        </div>
      </div>

    </div>
  );
}
