/* eslint-disable import/prefer-default-export */
const {
  DEFAULT_STAT,
  HP_BASE,
  HP_RANDOM_MULTIPLIER,
  DEFAULT_SPELL_DAMAGE,
  HOUSE_POWER,
  SPECIES_MAGIC,
  ANCESTRY_DEFENSE,
  SPELL_DAMAGE,
} = require('../constants');

const calculateCharacterStats = (characterData) => {
  const { attributes } = characterData;
  if (!attributes.name || attributes.name === '' || !attributes.image) {
    return null;
  }

  const power = HOUSE_POWER[attributes.house] || DEFAULT_STAT;
  const magic = SPECIES_MAGIC[attributes.species] || DEFAULT_STAT;
  const defense = ANCESTRY_DEFENSE[attributes.ancestry] || DEFAULT_STAT;

  const healthPoints = defense + Math.floor(Math.random() * HP_RANDOM_MULTIPLIER) + HP_BASE;

  return {
    id: characterData.id,
    name: attributes.name,
    house: attributes.house || 'Unknown',
    species: attributes.species || 'Unknown',
    ancestry: attributes.ancestry || 'Unknown',
    image: attributes.image,
    power,
    magic,
    defense,
    hp: healthPoints,
    maxHp: healthPoints,
  };
};

const calculateSpellStats = (spellData) => {
  const { attributes } = spellData;
  if (!attributes.name || attributes.name === '') {
    return null;
  }

  const damage = SPELL_DAMAGE[attributes.category] || DEFAULT_SPELL_DAMAGE;

  return {
    id: spellData.id,
    name: attributes.name,
    effect: attributes.effect || 'Efeito desconhecido',
    category: attributes.category || 'Spell',
    light: attributes.light || 'Unknown',
    damage,
  };
};

module.exports = { calculateCharacterStats, calculateSpellStats };
