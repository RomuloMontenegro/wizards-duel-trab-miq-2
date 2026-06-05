/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const { fetchRandomCharacters } = require('../services/potterApi');
const { DECK_SIZE_PACK } = require('../constants');

const router = express.Router();

router.get('/pack', async (req, res) => {
  try {
    const characters = await fetchRandomCharacters();
    res.json({ cards: characters.slice(0, DECK_SIZE_PACK) });
  } catch (error) {
    res.status(500).json({ error: 'erro ao buscar personagens' });
  }
});

module.exports = router;
