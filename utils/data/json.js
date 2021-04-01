const fs = require('fs');
const submissions2021 = require('./qualtrics.json');
const data = [];
function write2021JSON() {
    for (let i = 2; i < submissions2021.length; i++) { // start at 2 to skip over first 2 irrelavent entries populated by Qualtrics
        data.push(
            {
                ResponseId: submissions2021[i].ResponseId,
                "First Name": submissions2021[i]["First Name"],
                "Last Name": submissions2021[i]["Last Name"],
                "Username": submissions2021[i]["Username"],
                "Major": submissions2021[i]["Major"],
                "College": submissions2021[i]["College"],
                "Year": "2021",
                "Title of Artwork": submissions2021[i]["Title of Artwork"],
                "Artist Statement": submissions2021[i]["Artist Statement"],
                "Media": submissions2021[i]["Media"],
                "Media URL": submissions2021[i]["Media URL"],
                "Video Platform": submissions2021[i]["Video Platform"],
                "Audio File": submissions2021[i]["Audio File_Name"],
                "Image File": submissions2021[i]["Image File_Name"]
            }    
        );
    }
    return JSON.stringify(data, null, 2);
}

// creates 2021.json
fs.writeFile('./2021.json', write2021JSON(), (err) => {
    console.log(err);
});


// copies data.json as 2020.json
fs.copyFile('../../data/data.json', './2020.json', (err) => console.log(err));