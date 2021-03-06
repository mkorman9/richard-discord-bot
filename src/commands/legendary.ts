import { sendReply } from './utils';
import type { CommandExecutionProps, CommandManifest } from './module';

interface LegendaryCostDefinition {
  ilvl: number;
  soulAsh: number;
  soulCinder: number;
}

const LegendaryCosts: LegendaryCostDefinition[] = [
  { ilvl: 190, soulAsh: 1250, soulCinder: 0 },
  { ilvl: 210, soulAsh: 2000, soulCinder: 0 },
  { ilvl: 225, soulAsh: 3200, soulCinder: 0 },
  { ilvl: 235, soulAsh: 5150, soulCinder: 0 },
  { ilvl: 249, soulAsh: 5150, soulCinder: 1100 },
  { ilvl: 262, soulAsh: 5150, soulCinder: 1650 }
];

const callback = (props: CommandExecutionProps) => {
  sendReply(props.event.message, 'legendary/cost.twig', {
    legendary: { costs: LegendaryCosts }
  });
};

const legendary: CommandManifest = {
  execute: callback
};

export default legendary;
