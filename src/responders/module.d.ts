import type { Message } from 'discord.js';

export interface ResponderExecutionProps {
  message: Message;
}

export interface ResponderManifest {
  execute: (props: ResponderExecutionProps) => void;
}
