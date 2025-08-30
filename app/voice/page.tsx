"use client"
import React from 'react';
import useRecorder from '../hooks/useRecorder';
import { Mic, StopCircle, Play, Download, Trash2 } from 'lucide-react';

const VoiceRecorder: React.FC = () => {
  const { isRecording, recordingBlob, startRecording, stopRecording, clearRecording, downloadRecording } = useRecorder();

  return (
    <div className='w-full h-screen flex justify-center items-center'>
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-sm shadow-xs max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">Voice Recorder</h1>
      
      {!recordingBlob && (
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex items-center justify-center size-20 rounded-full text-white transition-colors ${
            isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isRecording ? <StopCircle size={32} /> : <Mic size={32} />}
        </button>
      )}

      {recordingBlob && (
        <div className="flex flex-col items-center gap-4 w-full">
          <audio controls src={URL.createObjectURL(recordingBlob)} className="w-full" />
          <div className="flex gap-4">
            <button
              onClick={downloadRecording}
              className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              <Download size={20} />
            </button>
            <button
              onClick={clearRecording}
              className="p-3 bg-gray-400 text-white rounded-full hover:bg-gray-500 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default VoiceRecorder;