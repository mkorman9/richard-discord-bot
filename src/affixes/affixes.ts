export interface AffixDefinition {
  id: number;
  name: string;
  description: string;
}

const Affixes: { [name: string]: AffixDefinition } = {
  Unknown: {
    id: -1,
    name: 'Unknown',
    description: 'Not known yet'
  },
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
  Necrotic: {
    id: 4,
    name: 'Necrotic',
    description: 'All enemies melee attacks apply a stacking blight that inflicts damage over time and reduces healing received'
  },
  Bolstering: {
    id: 7,
    name: 'Bolstering',
    description: 'When any non-boss enemy dies, its death cry empowers nearby allies, increasing their maximum health by 15% and damage by 20%'
  },
  Quaking: {
    id: 14,
    name: 'Quaking',
    description: 'Periodically, all players emit a shockwave, inflicting damage and interrupting nearby allies'
  },
  Sanguine: {
    id: 8,
    name: 'Sanguine',
    description: 'When slain, non-boss enemies leave behind a lingering pool of ichor that heals their allies and damages players'
  },
  Storming: {
    id: 124,
    name: 'Storming',
    description: 'While in combat, enemies periodically summon damaging whirlwinds'
  },
  Raging: {
    id: 6,
    name: 'Raging',
    description: 'Non-boss enemies enrage at 30% health remaining, dealing 75% increased damage until defeated'
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
  Explosive: {
    id: 13,
    name: 'Explosive',
    description: 'While in combat, enemies periodically summon Explosive Orbs that will detonate if not destroyed'
  },
  Inspiring: {
    id: 122,
    name: 'Inspiring',
    description: 'Some non-boss enemies have an inspiring presence that strengthens their allies'
  },
  Tormented: {
    id: 128,
    name: 'Tormented',
    description: 'Servants of the Jailer can be found throughout the dungeon and grant powerful boons when defeated. If a servant is not dealt with, they empower the final boss'
  }
};

export const getAffixById = (id: number): AffixDefinition => {
  return Object.values(Affixes)
    .find(a => a.id === id) || Affixes.Unknown;
};

export default Affixes;
