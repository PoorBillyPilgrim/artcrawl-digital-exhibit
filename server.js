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

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', {
        data: data,
        majors: majors
    });
});
app.get('/audio/:id', (req, res) => {
    /*data.forEach(x => {
        if (x["Media URL"] === req.params.file) {
            let file = file;
        }
    });*/
    res.render('audio', {
        data: data,
        id: req.params.id
    });
});

app.listen(port, () => {
    console.info('Listening on port 3000');
});