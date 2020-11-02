require('dotenv').config();
const fs = require('fs');
const Unsplash = require('unsplash-js').default;
const toJson = require('unsplash-js').toJson;

// for Unsplash API
const fetch = require('node-fetch');
global.fetch = fetch;

const unsplash = new Unsplash({ accessKey: process.env.UNSPLASH_ACCESS_KEY });

/*
unsplash.photos.getRandomPhoto({ count: "103" })
    .then(toJson)
    .then(json => {
        let data = JSON.stringify(json);
        fs.writeFile('data/randomPhotos.json', data, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('File written');
            }
        })
    });
*/

/*
const data = require('./data/randomPhotos.json');

console.log(data[0].urls.thumb);
*/