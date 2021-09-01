import ytdl from 'ytdl-core';
import { AudioResource, createAudioResource } from '@discordjs/voice';

export interface StreamDetails {
  title: string;
  resource: AudioResource;
}

export const fetchStream = async (url: string): Promise<StreamDetails> => {
  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const resource = createAudioResource(ytdl.downloadFromInfo(info));

    return {
      title,
      resource
    };
  } catch (err) {
    throw err;
  }
};
