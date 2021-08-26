import type { Message } from 'discord.js';

export interface CommandExecutionProps {
  command: string;
  args: string[];
  trigger: Message;
  commandsList: Map<string, CommandManifest>;
}

export interface CommandManifest {
  execute: (props: CommandExecutionProps) => void;
  description: string;
}
