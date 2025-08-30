import { useState, useRef } from 'react';

interface RecorderControls {
    isRecording: boolean;
    recordingBlob: Blob | null;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    clearRecording: () => void;
    downloadRecording: () => void;
}

const useRecorder = (): RecorderControls => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
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

            mediaRecorder.onstop = () => {
                const recordedBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setRecordingBlob(recordedBlob);
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
            a.download = `voice-note-${Date.now()}.webm`;
            a.click();
            window.URL.revokeObjectURL(url);
        }
    };

    return { isRecording, recordingBlob, startRecording, stopRecording, clearRecording, downloadRecording };
};

export default useRecorder;