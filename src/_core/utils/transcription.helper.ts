import { Logger } from '@nestjs/common';
import FFMpeg from 'ffmpeg';
const { Duplex } = require('stream');

export interface Segment {
  id: number;
  seek: number;
  start: number;
  end: number;
  text: string;
  tokens: [];
  temperature: number;
}

export interface ITranscriptionResponse {
  text: string;
  url?: string;
  duration?: number;
  textWithTimeStamps?: string;
}

export interface TranscriptionResult {
  language: string;
  duration: number;
  text: string;
  segments: Segment[];
}

export const convertM4aToMp3 = async (
  inputBuffer: Buffer,
): Promise<Buffer | undefined> => {
  try {
    const process = await new FFMpeg(inputBuffer);
    const outputBuffer = await process.fnExtractSoundToMP3();
    return outputBuffer;
  } catch (error) {
    Logger.log('error: ', error);
    return undefined;
  }
};

export function bufferToStream(myBuffer) {
  let tmp = new Duplex();
  tmp.push(myBuffer);
  tmp.push(null);
  return tmp;
}
