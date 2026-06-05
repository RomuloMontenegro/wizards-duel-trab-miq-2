/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
const fetch = require('node-fetch');
const { API_BASE_URL, PAGE_SIZE, MAX_PAGES } = require('../constants');
const { calculateCharacterStats, calculateSpellStats } = require('./statsCalculator');

const shuffleArray = (array) => {
  const shuffled = array.slice();
  for (let currentIndex = shuffled.length - 1; currentIndex > 0; currentIndex -= 1) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    const temporaryValue = shuffled[currentIndex];
    shuffled[currentIndex] = shuffled[randomIndex];
    shuffled[randomIndex] = temporaryValue;
  }
  return shuffled;
};

const fetchRandomCharacters = async () => {
  const randomPage = Math.floor(Math.random() * MAX_PAGES) + 1;
  const response = await fetch(`${API_BASE_URL}/characters?page[size]=${PAGE_SIZE}&page[number]=${randomPage}`);
  const jsonResponse = await response.json();

  const characters = jsonResponse.data
    .map(calculateCharacterStats)
    .filter((character) => character !== null);

  return shuffleArray(characters);
};

const fetchAllSpells = async () => {
  const response = await fetch(`${API_BASE_URL}/spells?page[size]=${PAGE_SIZE}`);
  const jsonResponse = await response.json();

  const spells = jsonResponse.data
    .map(calculateSpellStats)
    .filter((spell) => spell !== null);

  return shuffleArray(spells);
};

module.exports = { fetchRandomCharacters, fetchAllSpells };
