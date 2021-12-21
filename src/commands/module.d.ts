import type { BotMessageEvent } from '../bot.d';

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
  event: BotMessageEvent;
}

export interface CommandManifest {
  execute: (props: CommandExecutionProps) => void;
}
