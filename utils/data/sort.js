const data = require('../../data/data.json');
const fs = require('fs');

function sortJSON(a, b) {
    let nameA = a["Last Name"].toUpperCase();
    let nameB = b["Last Name"].toUpperCase();
    
    return nameA > nameB ? 1 : nameB > nameA ? -1 : 0;
}

let json = JSON.stringify(data.sort(sortJSON), null, 2);
fs.writeFile('./data_alpha.json', json, (err) => {
    console.log(err);
});