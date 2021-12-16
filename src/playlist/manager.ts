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

class PlaylistManager {
  private playbacks = new Map<string, PlaybackContext>();

  play(props: PlayProps): Promise<StreamDetails> {
    return new Promise(async (resolve, reject) => {
      try {
        const stream = await fetchStream(props.url);
        await this.startPlayback(props, stream);
        resolve(stream);
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

  private startPlayback(props: PlayProps, stream: StreamDetails): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const playlist = new Playlist([stream]);

      if (this.playbacks.has(props.channel.guild.id)) {
        const playback = this.playbacks.get(props.channel.guild.id);

        if (props.channel.id !== playback.channel.id) {
          reject(new PlaybackAlreadyInUseError());
          return;
        }

        playback.playlist.add(stream);
        resolve();
        return;
      }

      const player = this.createPlayer();
      const context: PlaybackContext = {
        channel: props.channel,
        player,
        playlist
      };
      this.playbacks.set(props.channel.guild.id, context);

      await this.joinChannel(props, context);

      player.on(AudioPlayerStatus.Idle, () => {
        this.playNext(context);
      });

      resolve();
    });
  }

  private createPlayer(): AudioPlayer {
    const player = createAudioPlayer();

    player.on('error', err => {
      const metadata = err.resource.metadata as ResourceMetadata;
      log.error(`error while playing "${metadata.title}": ${err.name} ${err.message}`, { stack: err.stack });
    });

    return player;
  }

  private joinChannel(props: PlayProps, context: PlaybackContext): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const connection = joinVoiceChannel({
        channelId: props.channel.id,
        guildId: props.channel.guild.id,
        adapterCreator: props.channel.guild.voiceAdapterCreator
      });

      connection.on(VoiceConnectionStatus.Ready, () => {
        connection.subscribe(context.player);
        this.playNext(context);
        resolve();
      });

      connection.on(VoiceConnectionStatus.Disconnected, () => {
        this.playbacks.delete(props.channel.guild.id);
      });

      connection.on('error', (err) => {
        reject(err);
      });
    });
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
