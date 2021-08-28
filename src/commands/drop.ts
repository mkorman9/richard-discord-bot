import twig from '../templates';
import type { CommandExecutionProps, CommandManifest } from './module';

interface MythicDropDefinition {
  plus: number;
  ilvl: number;
  weekly: number;
}

const MythicDrops: MythicDropDefinition[] = [
  { plus: 1, ilvl: 210, weekly: 0 },
  { plus: 2, ilvl: 210, weekly: 226 },
  { plus: 3, ilvl: 213, weekly: 226 },
  { plus: 4, ilvl: 216, weekly: 229 },
  { plus: 5, ilvl: 220, weekly: 229 },
  { plus: 6, ilvl: 223, weekly: 233 },
  { plus: 7, ilvl: 223, weekly: 236 },
  { plus: 8, ilvl: 226, weekly: 239 },
  { plus: 9, ilvl: 226, weekly: 236 },
  { plus: 10, ilvl: 229, weekly: 239 },
  { plus: 11, ilvl: 229, weekly: 242 },
  { plus: 12, ilvl: 233, weekly: 246 },
  { plus: 13, ilvl: 233, weekly: 246 },
  { plus: 14, ilvl: 236, weekly: 249 },
  { plus: 15, ilvl: 236, weekly: 252 }
];

const callback = (props: CommandExecutionProps) => {
  twig.render('drop.twig', {
    mythic: { drops: MythicDrops }
  })
  .then(output => {
    props.channel.send(output);
  });
};

const drop: CommandManifest = {
  execute: callback
};

export default drop;
