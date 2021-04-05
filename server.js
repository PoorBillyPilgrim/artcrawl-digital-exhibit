require('dotenv').config();
const express = require('express');
const data = require('./data/data.json');
const majors = require('./data/majors.json')
const path = require('path');

const port = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', {
        data: data,
        majors: majors
    });
});
app.get('/audio/:id', (req, res) => {
    res.render('audio', {
        data: data,
        id: req.params.id
    });
});

app.listen(port, () => {
    console.info('Listening on port 3000');
});