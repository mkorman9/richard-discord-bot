import {
  VoiceConnectionStatus,
  AudioPlayer,
  AudioPlayerStatus,
  joinVoiceChannel,
  getVoiceConnection,
  createAudioPlayer
} from '@discordjs/voice';
import type { VoiceChannel } from 'discord.js';

import Playlist from './playlist';
import { fetchStream, StreamDetails, ResourceMetadata } from './stream';
import log from '../log';

interface PlaybackContext {
  channel: VoiceChannel;
  player: AudioPlayer;
  playlist: Playlist;
  hasJoinedChannel: boolean;
}

interface GenericProps {
  channel: VoiceChannel;
}

interface PlayProps extends GenericProps {
  url: string;
}

export class PlaybackAlreadyInUseError extends Error {
  constructor() {
    super('playback is already is use on this server');
  }
}

export class VoiceChannelJoiningError extends Error {
  constructor() {
    super('voice channel could not be joined');
  }
}

class PlaylistManager {
  private playbacks = new Map<string, PlaybackContext>();

  play(props: PlayProps): Promise<StreamDetails> {
    return new Promise(async (resolve, reject) => {
      try {
        const stream = await fetchStream(props.url);

        if (this.playbacks.has(props.channel.guild.id)) {
          const playback = this.playbacks.get(props.channel.guild.id);

          if (props.channel.id !== playback.channel.id) {
            reject(new PlaybackAlreadyInUseError());
            return;
          }

          playback.playlist.add(stream);
          resolve(stream);
          return;
        }

        const manager = this;
        const connection = joinVoiceChannel({
          channelId: props.channel.id,
          guildId: props.channel.guild.id,
          adapterCreator: props.channel.guild.voiceAdapterCreator
        });
        const player = createAudioPlayer();
        const playlist = new Playlist([stream]);
        const context: PlaybackContext = {
          channel: props.channel,
          player,
          playlist,
          hasJoinedChannel: false
        };

        manager.playbacks.set(props.channel.guild.id, context);

        connection.on(VoiceConnectionStatus.Disconnected, () => {
          manager.playbacks.delete(props.channel.guild.id);

          if (!context.hasJoinedChannel) {
            reject(new VoiceChannelJoiningError());
          }
        });

        connection.on(VoiceConnectionStatus.Ready, () => {
          connection.subscribe(player);
          manager.playNext(context);
          resolve(stream);

          context.hasJoinedChannel = true;
        });

        player.on('error', err => {
          const metadata = err.resource.metadata as ResourceMetadata;
          log.error(`error while playing "${metadata.title}": ${err.name} ${err.message}`, { stack: err.stack });
        });

        player.on(AudioPlayerStatus.Idle, () => {
          manager.playNext(context);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  pause(props: GenericProps) {
    if (!this.playbacks.has(props.channel.guild.id)) {
      return;
    }
    if (props.channel.id !== this.playbacks.get(props.channel.guild.id).channel.id) {
      return;
    }

    const { player } = this.playbacks.get(props.channel.guild.id);

    player.pause();
  }

  resume(props: GenericProps) {
    if (!this.playbacks.has(props.channel.guild.id)) {
      return;
    }
    if (props.channel.id !== this.playbacks.get(props.channel.guild.id).channel.id) {
      return;
    }

    const { player } = this.playbacks.get(props.channel.guild.id);

    player.unpause();
  }

  stop(props: GenericProps) {
    if (!this.playbacks.has(props.channel.guild.id)) {
      return;
    }
    if (props.channel.id !== this.playbacks.get(props.channel.guild.id).channel.id) {
      return;
    }

    const { player } = this.playbacks.get(props.channel.guild.id);
    const connection = getVoiceConnection(props.channel.guild.id);

    player.stop();
    connection.disconnect();
    connection.destroy();
  }

  skip(props: GenericProps) {
    if (!this.playbacks.has(props.channel.guild.id)) {
      return;
    }
    if (props.channel.id !== this.playbacks.get(props.channel.guild.id).channel.id) {
      return;
    }

    const context = this.playbacks.get(props.channel.guild.id);

    context.player.stop();
    this.playNext(context);
  }

  list(props: GenericProps): StreamDetails[] {
    if (!this.playbacks.has(props.channel.guild.id)) {
      return [];
    }
    if (props.channel.id !== this.playbacks.get(props.channel.guild.id).channel.id) {
      return [];
    }

    return this.playbacks.get(props.channel.guild.id).playlist.details();
  }

  private playNext(context: PlaybackContext) {
    const stream = context.playlist.next();
    if (!stream) {
      this.stop({
        channel: context.channel
      });
      return;
    }

    stream.resourceAccessor()
      .then(audioResource => context.player.play(audioResource))
      .catch(err => log.error(`error while playing back: ${err}`, { stack: err.stack }));
  }
}

export default PlaylistManager;
