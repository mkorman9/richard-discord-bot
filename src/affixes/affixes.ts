export interface AffixDefinition {
  id: number;
  name: string;
  description: string;
}

export default {
  Tyrannical: {
    id: 9,
    name: 'Tyrannical',
    description: 'Bosses have 30% more health. Bosses and their minions inflict up to 15% increased damage'
  },
  Fortified: {
    id: 10,
    name: 'Fortified',
    description: 'Non-boss enemies have 20% more health and inflict up to 30% increased damage'
  },
  Bursting: {
    id: 11,
    name: 'Bursting',
    description: 'When slain, non-boss enemies explode, causing all players to suffer damage over 4 sec. This effect stacks'
  },
  Volcanic: {
    id: 3,
    name: 'Volcanic',
    description: 'While in combat, enemies periodically cause gouts of flame to erupt beneath the feet of distant players'
  },
  Spiteful: {
    id: 123,
    name: 'Spiteful',
    description: 'Fiends rise from the corpses of non-boss enemies and pursue random players'
  },
  Grievous: {
    id: 12,
    name: 'Grievous',
    description: 'Injured players suffer increasing damage over time until healed'
  },
  Tormented: {
    id: 128,
    name: 'Tormented',
    description: 'Servants of the Jailer can be found throughout the dungeon and grant powerful boons when defeated. If a servant is not dealt with, they empower the final boss'
  }
};
