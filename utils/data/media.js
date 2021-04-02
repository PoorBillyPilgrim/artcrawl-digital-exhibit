const fs = require('fs');
const submissions = require('./data.json');


/**
 * 
 * 
 * ROUTE THESE TO /public/
 * 
 */
/**
 * 
 * Not all submission image files were saved as username + extension
 * Need to rename files so that they 
 * ext = /([^.]*$)/ --> this only collects extension, doesn't include .
 * 
 */
const data = [];
function renameMedia() {
    submissions.forEach(sub => {
        if (sub["Year"] == '2021') {
            // need to add audio file name change
            if (sub["Audio File"] != "") {
                fs.rename(`../media/qualtrics/audio/${sub.ResponseId}_${sub["Audio File"]}`, `../media/artcrawl/audio/${sub["Audio File"]}`, (err) => {
                    if (err) console.log(err);
                })
            }
    
            if (sub["Image File"] == "") {return;}
    
            let i = sub["Image File"].search(/([^.]*$)/),
            ext = '.' + sub["Image File"].slice(i),
            newFile = (ext == '.pdf') ? sub["Username"].toLowerCase() + '.png' : sub["Username"].toLowerCase() + ext,
            oldFile = (ext == '.pdf') ? sub["Image File"].replace('pdf', 'png') : sub["Image File"];

            sub["Image File"] = newFile.toLowerCase();
            fs.rename(`../media/qualtrics/images/${sub.ResponseId}_${oldFile}`, `../media/artcrawl/images/need_processing/${newFile.toLowerCase()}`, (err) => {
                if (err) console.log(err);
            });
        }
        data.push(sub)
    })
    data.forEach(sub => {
        sub["Username"] = sub["Username"].toLowerCase();
    })
    return JSON.stringify(data, null, 2)
}

fs.writeFile('../../data/data.json', renameMedia(), (err) => {
    console.log(err);
});