/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const { PORT } = require('./constants');
const charactersRoutes = require('./routes/characters');
const spellsRoutes = require('./routes/spells');
const gameRoutes = require('./routes/game');

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.use('/api', charactersRoutes);
app.use('/api', spellsRoutes);
app.use('/api', gameRoutes);

app.listen(PORT, () => {
  /* eslint-disable-next-line no-console */
  console.log(`rodando na porta ${PORT}`);
});
