const fs = require('fs');
const submissions = require('../../data/qualtrics.json');
const data = [];
function writeDataJSON() {
    for (let i = 0; i < submissions.length; i++) {
        data.push(
            {
                ResponseId: submissions[i].ResponseId,
                id: i,
                "First Name": submissions[i]["First Name"],
                "Last Name": submissions[i]["Last Name"],
                "Username": submissions[i]["Username"],
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

fs.writeFile('../../data/qualtricsTest.json', writeDataJSON(), (err) => {
    console.log(err);
});