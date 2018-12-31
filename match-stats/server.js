const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/', (req, res) => {
  return es.send({ express: 'Hello From Express' });
});
app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});
app.use(cors());
app.listen(port, () => console.log(`Listening on port ${port}`));