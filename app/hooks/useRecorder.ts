import { UseRecorderArgs, UseRecorderReturn } from '@/lib/use-recorder-types';
import { useState, useRef } from 'react';

interface RecorderControls {
    isRecording: boolean;
    recordingBlob: Blob | null;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    clearRecording: () => void;
    downloadRecording: () => void;
    isProcessingVoice: boolean;
}

const useRecorder = ({
    setTranscribedData,
    transcribedData,
    router,
    authData
}: UseRecorderArgs): UseRecorderReturn => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
    const [isProcessingVoice, setIsProcessingVoice] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        console.log('hit start recording')
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (e: BlobEvent) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const recordedBlob = new Blob(chunksRef.current, { type: 'audio/ogg' });
                setRecordingBlob(recordedBlob);
                const formData = new FormData();
                formData.append('email', authData.user.email);
                formData.append('audio', recordedBlob, `voice-note-${Date.now()}.ogg`);

                try {
                    // Send the audio to your backend API
                    setIsProcessingVoice(true)
                    const response = await fetch('/api/transcribe', {
                        method: 'POST',
                        body: formData,
                    });

                    const result = await response.json();

                    if (response.ok) {
                        console.log('result', typeof result)
                        setTranscribedData(result.result)
                        setIsProcessingVoice(false)
                        router.push('/voice/edit')
                    } else {
                        throw new Error(result.error || 'Transcription failed.');
                    }

                } catch (error) {
                    console.error(error);
                    // setTranscription('An error occurred during transcription.');
                }
                chunksRef.current = [];
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Microphone access was denied. Please allow it to use the voice recorder.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
            setIsRecording(false);
        }
    };

    const clearRecording = () => {
        setRecordingBlob(null);
    };

    const downloadRecording = () => {
        if (recordingBlob) {
            const url = URL.createObjectURL(recordingBlob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style.display = 'none';
            a.href = url;
            a.download = `voice-note-${Date.now()}.ogg`;
            a.click();
            window.URL.revokeObjectURL(url);
        }
    };

    return { isRecording, recordingBlob, startRecording, stopRecording, clearRecording, downloadRecording, isProcessingVoice };
};

export default useRecorder;