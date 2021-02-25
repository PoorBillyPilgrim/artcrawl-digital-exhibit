const fs = require('fs');
const submissions = require('../../data/qualtricsTest.json');


/**
 * 
 * 
 * ROUTE THESE TO /public/
 * 
 */
submissions.forEach(sub => {
    if (sub["Audio File"] != "") {
        fs.rename(`./qualtrics/audio/${sub.ResponseId}_${sub["Audio File"]}`, `./artcrawl/audio/${sub["Audio File"]}`, (err) => {
            if (err) console.log(err);
        })
    }
    if (sub["Image File"] == "") {return;}
    fs.rename(`./qualtrics/images/${sub.ResponseId}_${sub["Image File"]}`, `./artcrawl/images/${sub["Image File"]}`, (err) => {
        if (err) console.log(err);
    })
})

