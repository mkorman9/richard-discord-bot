import {
  VoiceConnection,
  VoiceConnectionStatus,
  AudioPlayer,
  AudioPlayerStatus,
  joinVoiceChannel,
  createAudioPlayer
} from '@discordjs/voice';
import type { VoiceChannel } from 'discord.js';

import Playlist from './playlist';
import { fetchStream, StreamDetails, ResourceMetadata } from './stream';
import log from '../log';

interface PlaybackContext {
  channel: VoiceChannel;
  connection: VoiceConnection;
  player: AudioPlayer;
  playlist: Playlist;
}

interface GenericProps {
  channel: VoiceChannel;
}

interface PlayProps extends GenericProps {
  url: string;
}

class PlaylistManager {
  private playbacks = new Map<string, PlaybackContext>();

  play(props: PlayProps): Promise<StreamDetails> {
    return new Promise((resolve, reject) => {
      fetchStream(props.url)
        .then(stream => {
          resolve(stream);

          if (this.playbacks.has(props.channel.id)) {
            this.playbacks.get(props.channel.id).playlist.add(stream);
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
            connection,
            player,
            playlist
          };

          connection.on(VoiceConnectionStatus.Ready, () => {
            connection.subscribe(player);
            manager.playbacks.set(props.channel.id, context);
            manager.playNext(context);
          });

          player.on('error', err => {
            const metadata = err.resource.metadata as ResourceMetadata;
            log.error(`error while playing "${metadata.title}": ${err.name} ${err.message}`, { stack: err.stack });
          });

          player.on(AudioPlayerStatus.Idle, () => {
            manager.playNext(context);
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  pause(props: GenericProps) {
    if (!this.playbacks.has(props.channel.id)) {
      return;
    }

    const player = this.playbacks.get(props.channel.id).player;
    player.pause();
  }

  resume(props: GenericProps) {
    if (!this.playbacks.has(props.channel.id)) {
      return;
    }

    const player = this.playbacks.get(props.channel.id).player;
    player.unpause();
  }

  stop(props: GenericProps) {
    if (!this.playbacks.has(props.channel.id)) {
      return;
    }

    const player = this.playbacks.get(props.channel.id).player;
    const connection = this.playbacks.get(props.channel.id).connection;

    player.stop();
    connection.destroy();
    this.playbacks.delete(props.channel.id);
  }

  skip(props: GenericProps) {
    if (!this.playbacks.has(props.channel.id)) {
      return;
    }

    const context = this.playbacks.get(props.channel.id);

    context.player.stop();
    this.playNext(context);
  }

  list(props: GenericProps): StreamDetails[] {
    if (!this.playbacks.has(props.channel.id)) {
      return [];
    }

    return this.playbacks.get(props.channel.id).playlist.details();
  }

  private playNext(context: PlaybackContext) {
    const stream = context.playlist.next();
    if (!stream) {
      this.stop({
        channel: context.channel
      });
      return;
    }

    context.player.play(stream.resourceAccessor());
  }
}

export default PlaylistManager;
