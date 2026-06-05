/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const { fetchAllSpells } = require('../services/potterApi');
const { SPELLS_RETURN_SIZE } = require('../constants');

const router = express.Router();

router.get('/spells', async (req, res) => {
  try {
    const spells = await fetchAllSpells();
    res.json({ spells: spells.slice(0, SPELLS_RETURN_SIZE) });
  } catch (error) {
    res.status(500).json({ error: 'erro ao buscar feiticos' });
  }
});

module.exports = router;
