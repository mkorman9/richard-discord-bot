import type { VoiceChannel } from 'discord.js';

import PlaylistManager, { PlaybackAlreadyInUseError } from '../playlist/manager';
import twig from '../templates';
import type { CommandExecutionProps, CommandManifest } from './module';

const Playlist = new PlaylistManager();

const showHelp = (props: CommandExecutionProps) => {
  twig.render('playlist_help.twig', {})
    .then(output => {
      props.message.reply(output);
    });
};

const callback = async (props: CommandExecutionProps) => {
  const cmd = (props.args[0] || '').toLowerCase();

  if (!cmd) {
    showHelp(props);
  } else {
    const voiceChannel = props.message.member.voice.channel as (VoiceChannel | null);
    if (!voiceChannel) {
      twig.render('playlist_no_channel.twig', {})
        .then(output => {
          props.message.reply(output);
        });
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

        twig.render('playlist_added.twig', {
          title: streamDetails.title
        })
          .then(output => {
            props.message.reply(output);
          });
      } catch (err) {
        if (err instanceof PlaybackAlreadyInUseError) {
          twig.render('playlist_alreadyinuse.twig', {})
            .then(output => {
              props.message.reply(output);
            });
          return;
        }

        twig.render('playlist_error.twig', {})
          .then(output => {
            props.message.reply(output);
          });
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

      twig.render('playlist_list.twig', {
        playlist: { streams }
      })
        .then(output => {
          props.message.reply(output);
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
