require('dotenv').config();
const express = require('express');
const data = require('./data/data.json');
const randomPhotos = require('./data/randomPhotos.json');
const majors = require('./data/majors.json')
const path = require('path');
// const regex = /.(jpeg|jpg|png)/; this was needed for the actual art crawl submissions

const port = process.env.PORT || 3000;

const app = express();
// Must match JSON keys exactly, capiatlize for single words and use bracket notation for keys > one word
// console.log(data[1].Username);
//console.log(data.length);
//console.log(randomPhotos.length);

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', {
        data: data,
        randomPhotos: randomPhotos,
        majors: majors
    });
});

app.listen(port, () => {
    console.info('Listening on port 3000');
});