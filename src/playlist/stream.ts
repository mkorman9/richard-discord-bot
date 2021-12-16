import ytdl from 'ytdl-core';
import { exec as ytdlExec } from 'youtube-dl-exec';
import { AudioResource, createAudioResource, demuxProbe } from '@discordjs/voice';
import log from '../log';

export interface StreamDetails {
  url: string;
  title: string;
  resourceAccessor: () => Promise<AudioResource>;
}

export interface ResourceMetadata {
  title: string;
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

    log.info(`fetched stream info from url "${url}": title="${title}" format=[${format.container}/${format.audioCodec}, ${format.audioSampleRate} Hz, ${size.toFixed(2)} MiB]`);

    const resourceAccessor = (): Promise<AudioResource> => {
      return new Promise((resolve, reject) => {
        log.info(`started streaming "${title}"`);

        const process = ytdlExec(
          url,
          {
            output: '-',
            quiet: true,
            limitRate: '100K',
            // format: `bestaudio[ext=${format.container}+acodec=${format.audioCodec}+asr=${format.audioSampleRate}]`,
            format: `bestaudio[asr=${format.audioSampleRate}]`,
            callHome: false
          },
          {
            stdio: ['ignore', 'pipe', 'ignore']
          }
        );

        const handleError = (err: Error) => {
          if (!process.killed) {
            process.kill();
          }

          if (err['code'] && err['code'] === 'ERR_STREAM_PREMATURE_CLOSE') {
            return;
          }

          process.stdout.resume();
          log.error(`failed to obtain audio stream: ${err.name} ${err.message}`);
          reject(err);
        };

        process
          .once('spawn', () => {
            demuxProbe(process.stdout)
              .then(probe => {
                const audioResource = createAudioResource(
                  probe.stream,
                  {
                    metadata: {
                      title
                    } as ResourceMetadata,
                    inputType: probe.type
                  }
                );

                resolve(audioResource);
              })
              .catch(err => handleError(err));
          })
          .catch(err => handleError(err));
      });
    };

    return {
      url,
      title,
      resourceAccessor
    };
  } catch (err) {
    log.error(`failed to fetch stream from url "${url}": ${err}`);
    throw err;
  }
};
