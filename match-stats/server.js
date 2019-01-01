const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use(express.static(__dirname + '/public'))

app.get('/*', function (req, res) {
   res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use(cors());
app.listen(port, () => console.log(`Listening on port ${port}`));