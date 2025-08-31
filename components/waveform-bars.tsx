"use client"
import { motion } from "framer-motion";
import { useRef } from "react";

function randomBarAnim(i: number) {
    const base = 0.9 + Math.random() * 0.6;
    const delay = (i * 0.03) % 1.2;
    const peak = 0.4 + Math.random() * 1.2;
    const mid = (peak + 0.2) / 2;
    const low = 0.2 + Math.random() * 0.25;
    return {
        duration: base,
        delay,
        keyframes: [low, peak, mid, peak * 0.85, low * 1.1],
    };
}

export default function WaveformBars({
    recording,
    barAnims,
    prefersReducedMotion
}: {
    recording: boolean;
    barAnims: ReturnType<typeof randomBarAnim>[];
    prefersReducedMotion: boolean;
}) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    return (
        <div
            ref={containerRef}
            className="relative h-40 w-full overflow-hidden rounded-xl 

            "
        >
            {/* Bars */}
            <div className="absolute inset-0 grid grid-cols-[repeat(40,minmax(0,1fr))] items-end gap-[3px] p-4">
                {barAnims.map((cfg, i) => (
                    <motion.div
                        key={`bar-${i}`}
                        className="origin-bottom rounded-full bg-black"
                        style={{ minHeight: "4px", width: "100%" }}
                        animate={
                            recording && !prefersReducedMotion
                                ? { scaleY: cfg.keyframes, opacity: [0.7, 1, 0.8] }
                                : { scaleY: 0.4, opacity: 0.6 }
                        }
                        transition={
                            recording && !prefersReducedMotion
                                ? {
                                    duration: cfg.duration,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: cfg.delay,
                                }
                                : { duration: 0.3 }
                        }
                    />
                ))}
            </div>

            {/* Sweep highlight */}
            {!prefersReducedMotion && (
                <motion.div
                    className="pointer-events-none absolute inset-y-0 -inset-x-20 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ["-30%", "130%"] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
                />
            )}
        </div>
    );
}
