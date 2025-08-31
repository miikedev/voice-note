"use client"
import React, { useEffect, useState } from 'react'
import { Mic, StopCircle, Download, Trash2 } from 'lucide-react';
import useRecorder from '@/app/hooks/useRecorder';
import WaveformBars from './waveform-bars';

const VoiceRecorder = () => {
    const {
        isRecording,
        recordingBlob,
        startRecording,
        stopRecording,
        clearRecording,
        downloadRecording
    } = useRecorder();

    const prefersReducedMotion = usePrefersReducedMotion();

    return (
        <div className="flex flex-col items-center justify-center p-3 rounded-sm max-w-sm mx-auto">
            <h1 className="text-2xl font-bold mb-4">Voice Recorder</h1>

            {/* Show waveform animation only while recording */}
            

            {/* Record/Stop button (only when no blob yet) */}
            {!recordingBlob && (
                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`flex items-center justify-center size-14 rounded-full text-white transition-colors ${
                        isRecording
                            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                            : 'bg-gray-900 hover:bg-gray-700'
                    }`}
                >
                    {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
                </button>
            )}

            {isRecording && !recordingBlob && (
                <div className="h-40 mb-6 absolute bottom-5 w-56">
                    <WaveformBars
                        barAnims={Array.from({ length: 40 }, (_, i) => randomBarAnim(i))}
                        recording={isRecording}
                        prefersReducedMotion={prefersReducedMotion}
                    />
                </div>
            )}

            {/* Playback + download/delete controls after recording finished */}
            {recordingBlob && (
                <div className="flex flex-col items-center gap-4 w-full">
                    <audio
                        controls
                        src={URL.createObjectURL(recordingBlob)}
                        className="w-full rounded-full"
                    />
                    <div className="flex gap-4">
                        <button
                            onClick={downloadRecording}
                            className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                        >
                            <Download size={20} />
                        </button>
                        <button
                            onClick={clearRecording}
                            className="p-3 bg-gray-900 text-white rounded-full hover:bg-gray-500 transition-colors"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default VoiceRecorder

// Simple random animation config (same as before)
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

function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReduced(mq.matches);
        update();
        mq.addEventListener?.("change", update);
        return () => mq.removeEventListener?.("change", update);
    }, []);
    return reduced;
}
