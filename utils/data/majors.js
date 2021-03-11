const data = require('../../data/data.json');
const randomColor = require('randomcolor');

let majors = [];

data.forEach(x => {
    majors.push(x["College"]);
});

let result = majors.reduce(function(result, item){
    let count = 1;
    if (!result.hasOwnProperty(item)) {
        result[item] = {"count":count};
    } else {
        result[item]["count"] += count;
    }
    return result;
}, {});

let count = Object.keys(result);

let colors = count.reduce(function(result, item) {
    let num = Math.floor(Math.random() * 3);
    let colleges = [
        // Georgia Tech Branding -- Tertiary Colors -- https://brand.gatech.edu/brand/colors
        {'Scheller College of Business': '#002233'}, // Atlanta Fog
        {'College of Computing':'#4B8B9B'}, // Tower Patina 
        {'College of Design':'#740053'}, // Whistle
        {'College of Engineering':'#F95E10'}, // Horizon
        {'Ivan Allen College of Liberal Arts':'#AD4025'}, // Georgia Clay 
        {'College of Science':'#D6DBD4'} // Pi Mile
    ]
    result[item] = randomColor({'hue': hues[num]});
    return result;
}, {});

for (let disc in colors) {
    result[disc]["color"] = colors[disc];
}

console.log(JSON.stringify(result));
console.log(data.length)