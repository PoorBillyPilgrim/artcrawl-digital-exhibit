const data = require('./data/data.json');
const randomColor = require('randomcolor');

let majors = [];

data.forEach(x => {
    majors.push(x["Major"]);
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
    let num = Math.floor(Math.random * 3);
    let hues = ['#6DED8D', '#6DC0ED', '#72EBF7'];
    result[item] = randomColor({'hue': hues[num]});
    return result;
}, {});

for (let disc in colors) {
    result[disc]["color"] = colors[disc];
}

console.log(JSON.stringify(result));