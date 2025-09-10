"use client"
import React, { useEffect, useState } from 'react'
import { Mic, StopCircle, Download, Trash2, Loader } from 'lucide-react';
import useRecorder from '@/app/hooks/useRecorder';
import WaveformBars from './waveform-bars';
import { authAtom, selectedDurationAtom, selectedLanguageAtom, transcribedAtom, useAtom } from '@/app/store';
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react';

const VoiceRecorder = () => {
    const { data: session } = useSession();
    const [authData,setAuthData] = useAtom(authAtom)
    const router = useRouter()
    const [selectedLanguage,] = useAtom(selectedLanguageAtom);
    const [selectedDuration,] = useAtom(selectedDurationAtom);

    const [transcribedData, setTranscribedData] = useAtom(transcribedAtom)

    useEffect(()=> {if(session) setAuthData({...authData})},[])

    console.log('auth data', authData)
    
    const {
        isRecording,
        recordingBlob,
        startRecording,
        stopRecording,
        clearRecording,
        downloadRecording,
        isProcessingVoice,
    } = useRecorder({setTranscribedData, transcribedData, router, authData, selectedLanguage, selectedDuration});

    const prefersReducedMotion = usePrefersReducedMotion();

    const handleRecordClick = () => {
        if (selectedDuration && selectedLanguage) {
            isRecording ? stopRecording() : startRecording()
        } else {
            if (!selectedLanguage && !selectedDuration) {
                toast.warning('Please select duration and language')
            } else if (!selectedLanguage) {
                toast.warning('Please select language')
            } else if (!selectedDuration) {
                toast.warning('Please select duration')
            }
        }
    }

    console.log('transcribed data', transcribedData)


    return (
        <div className="flex flex-col items-center justify-center p-3 rounded-sm max-w-sm mx-auto">
            {/* {!isProcessingVoice && <h1 className="text-2xl font-bold mb-4">Voice Recorder</h1>} */}
            {/* Show waveform animation only while recording */}

            {/* Record/Stop button (only when no blob yet) */}
            {!isProcessingVoice && !recordingBlob && (
                <button
                    onClick={handleRecordClick}
                    className={`flex items-center justify-center size-24 rounded-full text-white transition-colors ${isRecording
                            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                            : 'bg-gray-900 hover:bg-gray-700'
                        }`}
                >
                    {isRecording ? <StopCircle size={35} /> : <Mic size={35} />}
                </button>
            )}

            {!isProcessingVoice && isRecording && !recordingBlob && (
                <div className="h-40 mb-6 w-56">
                    <WaveformBars
                        barAnims={Array.from({ length: 40 }, (_, i) => randomBarAnim(i))}
                        recording={isRecording}
                        prefersReducedMotion={prefersReducedMotion}
                    />
                </div>
            )}

            {/* {transcribedData && (<h1 className='font-bold text-3xl'></h1>)} */}

            {/* Playback + download/delete controls after recording finished */}
            {/* {!isProcessingVoice && recordingBlob && (
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
            )} */}

            {isProcessingVoice && <Loader className='animate-spin' />}
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
