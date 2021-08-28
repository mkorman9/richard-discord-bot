import type { TextBasedChannels } from 'discord.js';

export interface CommandCallerProps {
  id: string;
  name: string;
  alias: string;
  isPrivileged: boolean;
}

export interface CommandExecutionProps {
  command: string;
  args: string[];
  caller: CommandCallerProps;
  channel: TextBasedChannels;
}

export interface CommandManifest {
  execute: (props: CommandExecutionProps) => void;
}
