import { ChildProcess, SpawnOptions } from 'node:child_process';
import { Readable } from 'node:stream';

export interface RecordingOptions {
    /**
     * Sample rate in Hz
     * @default 16000
     */
    sampleRate?: number;
    
    /**
     * Number of channels to record
     * @default 1
     */
    channels?: number;
    
    /**
     * Whether to compress the audio
     * @default false
     */
    compress?: boolean;
    
    /**
     * Audio threshold
     * @default 0.5
     */
    threshold?: number;
    
    /**
     * Threshold for starting recording
     * @default null
     */
    thresholdStart?: number | null;
    
    /**
     * Threshold for ending recording
     * @default null
     */
    thresholdEnd?: number | null;
    
    /**
     * Silence duration
     * @default "1.0"
     */
    silence?: string;
    
    /**
     * Recording program to use
     * @default "sox"
     */
    recorder?: string;
    
    /**
     * Whether to end recording on silence
     * @default false
     */
    endOnSilence?: boolean;
    
    /**
     * Audio file type
     * @default "wav"
     */
    audioType?: string;
}

export interface RecorderConfig {
    cmd: string;
    args: string[];
    spawnOptions?: SpawnOptions;
}

export interface Recorder {
    (options: RecordingOptions): RecorderConfig;
}

export class Recording {
    constructor(options?: RecordingOptions);
    
    /**
     * The child process running the recorder
     */
    process: ChildProcess;
    
    /**
     * Recording options
     */
    options: Required<RecordingOptions>;
    
    /**
     * Start recording
     */
    start(): Recording;
    
    /**
     * Stop recording
     */
    stop(): void;
    
    /**
     * Pause recording
     */
    pause(): void;
    
    /**
     * Resume recording
     */
    resume(): void;
    
    /**
     * Check if recording is paused
     */
    isPaused(): boolean;
    
    /**
     * Get the recording stream
     */
    stream(): Readable;
}

/**
 * Create a new recording instance
 */
export function record(options?: RecordingOptions): Recording;
