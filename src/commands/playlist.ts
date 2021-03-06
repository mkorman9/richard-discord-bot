import type { GuildMember, VoiceChannel } from 'discord.js';

import PlaylistManager, { PlaybackAlreadyInUseError } from '../playlist/manager';
import { sendReply } from './utils';
import type { CommandExecutionProps, CommandManifest } from './module';

const Playlist = new PlaylistManager();

const showHelp = (props: CommandExecutionProps) => {
  sendReply(props.event.message, 'playlist/help.twig');
};

const hasPermissionsToJoin = (bot: GuildMember, channel: VoiceChannel): boolean => {
  return channel
    .permissionsFor(bot)
    .has('CONNECT');
};

const callback = async (props: CommandExecutionProps) => {
  const cmd = (props.args[0] || '').toLowerCase();

  if (!cmd) {
    showHelp(props);
  } else {
    const voiceChannel = props.event.message.member.voice.channel as (VoiceChannel | null);
    if (!voiceChannel) {
      sendReply(props.event.message, 'playlist/no_channel.twig');
      return;
    }

    if (!hasPermissionsToJoin(voiceChannel.guild.me, voiceChannel)) {
      sendReply(props.event.message, 'playlist/accesserror.twig');
      return;
    }

    if (
      cmd === 'add' ||
      cmd === 'dodaj' ||
      cmd === '+'
    ) {
      const url = (props.args[1] || '');

      if (!url) {
        showHelp(props);
        return;
      }

      try {
        const streamDetails = await Playlist.play({
          channel: voiceChannel,
          url
        });

        sendReply(props.event.message, 'playlist/added.twig', {
          title: streamDetails.title
        });
      } catch (err) {
        if (err instanceof PlaybackAlreadyInUseError) {
          sendReply(props.event.message, 'playlist/alreadyinuse.twig');
          return;
        }

        sendReply(props.event.message, 'playlist/error.twig');
      }
    } else if (
      cmd === 'stop' ||
      cmd === 'zatrzymaj'
    ) {
      Playlist.stop({
        channel: voiceChannel
      });
    } else if (
      cmd === 'pause' ||
      cmd === 'pauza'
    ) {
      Playlist.pause({
        channel: voiceChannel
      });
    } else if (
      cmd === 'resume' ||
      cmd === 'wzn??w' ||
      cmd === 'wznow'
    ) {
      Playlist.resume({
        channel: voiceChannel
      });
    } else if (
      cmd === 'skip' ||
      cmd === 'next' ||
      cmd === 'pomi??' ||
      cmd === 'pomin' ||
      cmd === 'nast??pny' ||
      cmd === 'nastepny'
    ) {
      Playlist.skip({
        channel: voiceChannel
      });
    } else if (
      cmd === 'show' ||
      cmd === 'poka??' ||
      cmd === 'pokaz'
    ) {
      const streams = Playlist.list({
        channel: voiceChannel
      });

      sendReply(props.event.message, 'playlist/list.twig', {
        playlist: { streams }
      });
    } else {
      showHelp(props);
    }
  }
};

const playlist: CommandManifest = {
  execute: callback
};

export default playlist;
