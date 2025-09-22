import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

type AuthData = {
    user: {
        name: string;
        email: string;
        image: string;
    };
    expires: string;
};
export interface UseRecorderArgs {
    setTranscribedData: React.Dispatch<React.SetStateAction<string | null>>;
    transcribedData: string | null;
    router: AppRouterInstance;
    authData: AuthData;
    selectedLanguage: string;
    apiKey: string
}

export interface UseRecorderReturn {
    isRecording: boolean;
    recordingBlob: Blob | null;
    startRecording: () => void;
    stopRecording: () => void;
    clearRecording: () => void;
    downloadRecording: () => void;
    isProcessingVoice: boolean;
}
