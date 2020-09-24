const express = require('express');
const data = require('./data/data.json');

const app = express();
// Must match JSON keys exactly, capiatlize for single words and use bracket notation for keys > one word
// console.log(data[0].Username);
// console.log(data[0]['First Name']);

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { data: data });
});

app.listen(3000, () => {
    console.info('Listening on port 3000');
});