import type { Message } from 'discord.js';

export interface CommandExecutionProps {
  command: string;
  args: string[];
  trigger: Message;
}

export interface CommandManifest {
  execute: (props: CommandExecutionProps) => void;
}
