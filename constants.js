const CONSTANTS = {
  PORT: 3000,
  API_BASE_URL: 'https://api.potterdb.com/v1',
  PAGE_SIZE: 100,
  MAX_PAGES: 8,
  DECK_SIZE_PACK: 4,
  DECK_SIZE_CPU: 2,
  SPELLS_RETURN_SIZE: 20,
  DEFAULT_STAT: 50,
  HP_BASE: 80,
  HP_RANDOM_MULTIPLIER: 20,
  DEFAULT_SPELL_DAMAGE: 30,

  HOUSE_POWER: {
    Gryffindor: 90,
    Slytherin: 85,
    Hufflepuff: 75,
    Ravenclaw: 80,
  },

  SPECIES_MAGIC: {
    human: 70,
    'half-giant': 88,
    giant: 95,
    'house elf': 82,
    ghost: 60,
    werewolf: 91,
    vampire: 87,
    centaur: 78,
  },

  ANCESTRY_DEFENSE: {
    'pure-blood': 90,
    'half-blood': 75,
    'muggle-born': 70,
    muggle: 40,
    squib: 35,
  },

  SPELL_DAMAGE: {
    Charm: 45,
    Curse: 90,
    Hex: 65,
    Jinx: 55,
    Spell: 50,
    Transfiguration: 40,
    'Counter-spell': 35,
    'Healing spell': -40,
  },
};

module.exports = CONSTANTS;
