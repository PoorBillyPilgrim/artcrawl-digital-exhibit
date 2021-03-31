const fs = require('fs');
const submissions = require('../../data/qualtrics.json');
const data = [];
function write2021JSON() {
    for (let i = 0; i < submissions.length; i++) {
        data.push(
            {
                ResponseId: submissions[i].ResponseId,
                "First Name": submissions[i]["First Name"],
                "Last Name": submissions[i]["Last Name"],
                "Username": submissions[i]["Username"].toLowerCase(),
                "Major": submissions[i]["Major"],
                "College": submissions[i]["College"],
                "Year": "2021",
                "Title of Artwork": submissions[i]["Title of Artwork"],
                "Artist Statement": submissions[i]["Artist Statement"],
                "Media": submissions[i]["Media"],
                "Media URL": submissions[i]["Media URL"],
                "Video Platform": submissions[i]["Video Platform"],
                "Audio File": submissions[i]["Audio File_Name"],
                "Image File": submissions[i]["Image File_Name"]
            }    
        );
    }
    return JSON.stringify(data, null, 2);
}

// creates 2021.json
fs.writeFile('../../data/2021.json', write2021JSON(), (err) => {
    console.log(err);
});

/* Save this until after processing 2021 JSON
    also need to remove duplicate media
// copies data.json as 2020.json
fs.copyFile('../../data/data.json', '../../data/2020.json', (err) => console.log(err))
*/