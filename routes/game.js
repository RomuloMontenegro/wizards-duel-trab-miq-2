/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const { fetchRandomCharacters } = require('../services/potterApi');
const { DECK_SIZE_CPU } = require('../constants');

const router = express.Router();

router.post('/cpu-deck', async (req, res) => {
  try {
    const characters = await fetchRandomCharacters();
    res.json({ deck: characters.slice(0, DECK_SIZE_CPU) });
  } catch (error) {
    res.status(500).json({ error: 'erro ao montar deck cpu' });
  }
});

module.exports = router;
