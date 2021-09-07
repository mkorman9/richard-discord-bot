import type { VoiceChannel } from 'discord.js';

import PlaylistManager, { PlaybackAlreadyInUseError } from '../playlist/manager';
import { sendReply } from './utils';
import type { CommandExecutionProps, CommandManifest } from './module';

const Playlist = new PlaylistManager();

const showHelp = (props: CommandExecutionProps) => {
  sendReply(props.message, 'playlist/help.twig');
};

const callback = async (props: CommandExecutionProps) => {
  const cmd = (props.args[0] || '').toLowerCase();

  if (!cmd) {
    showHelp(props);
  } else {
    const voiceChannel = props.message.member.voice.channel as (VoiceChannel | null);
    if (!voiceChannel) {
      sendReply(props.message, 'playlist/no_channel.twig');
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

        sendReply(props.message, 'playlist/added.twig', {
          title: streamDetails.title
        });
      } catch (err) {
        if (err instanceof PlaybackAlreadyInUseError) {
          sendReply(props.message, 'playlist/alreadyinuse.twig');
          return;
        }

        sendReply(props.message, 'playlist/error.twig');
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
      cmd === 'wznów' ||
      cmd === 'wznow'
    ) {
      Playlist.resume({
        channel: voiceChannel
      });
    } else if (
      cmd === 'skip' ||
      cmd === 'next' ||
      cmd === 'pomiń' ||
      cmd === 'pomin' ||
      cmd === 'następny' ||
      cmd === 'nastepny'
    ) {
      Playlist.skip({
        channel: voiceChannel
      });
    } else if (
      cmd === 'show' ||
      cmd === 'pokaż' ||
      cmd === 'pokaz'
    ) {
      const streams = Playlist.list({
        channel: voiceChannel
      });

      sendReply(props.message, 'playlist/list.twig', {
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
