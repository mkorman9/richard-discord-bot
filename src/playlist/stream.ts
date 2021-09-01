import ytdl from 'ytdl-core';
import { AudioResource, createAudioResource } from '@discordjs/voice';

import log from '../log';

export interface StreamDetails {
  url: string;
  title: string;
  resource: AudioResource;
}

const AllowedDomains = new Set<string>([
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'www.youtu.be'
]);

export const fetchStream = async (url: string): Promise<StreamDetails> => {
  try {
    const parsedUrl = new URL(url);
    if (!AllowedDomains.has(parsedUrl.hostname.toLowerCase())) {
      throw new Error(`invalid domain name ${parsedUrl.hostname}`);
    }

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const format = ytdl.chooseFormat(info.formats, {
      filter: 'audioonly'
    });
    const size = parseInt(format.contentLength) / (1024 * 1024);
    const resource = createAudioResource(ytdl.downloadFromInfo(info, {
      format
    }));

    log.info(`fetched stream from url "${url}": title="${title}" format=[${format.audioCodec}, ${format.quality}, ${size.toFixed(2)} MiB]`);

    return {
      url,
      title,
      resource
    };
  } catch (err) {
    log.error(`failed to fetch stream from url "${url}": ${err}`);
    throw err;
  }
};
