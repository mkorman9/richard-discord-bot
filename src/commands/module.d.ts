import type { TextBasedChannels } from 'discord.js';

export interface CommandExecutionProps {
  command: string;
  args: string[];
  channel: TextBasedChannels;
  commandsList: Map<string, CommandManifest>;
}

export interface CommandManifest {
  execute: (props: CommandExecutionProps) => void;
  description: string;
}
