import type { Message } from 'discord.js';

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
  trigger: Message;
}

export interface CommandManifest {
  execute: (props: CommandExecutionProps) => void;
}
