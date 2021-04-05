const fs = require('fs'),
    s20 = require('./2020.json'), // change data.json -> 2020.json
    s21 = require('./2021.json'), // change qualtrics.json -> 2021.json
    usernames21 = [],
    dups20 = [],
    dups21 = [];

s21.forEach(sub => { usernames21.push(sub["Username"].toLowerCase()) });

const removeDups = () => {
    return new Promise((resolve, reject) => {
        s20.forEach((sub20, idx) => {
            if(s21.some(sub21 => sub21["Username"].toLowerCase() === sub20["Username"])) {
                dups20.push(sub20);
                s20.splice(idx, 1);
            }
        })
        //console.log('Spring 2020 + Dups: ' + (parseInt(s20.length) + parseInt(s21.length)));
        resolve({
            s20: s20, // Spring 2020 submissions with duplicates removed
            dups20: dups20 // Spring 2020 duplicates that were removed from s20
        });
    })
}

const mergeJSON = (subs) => {
    return new Promise((resolve, reject) => {
        let data = s21.concat(subs.s20)
        let dups = subs.dups20
        fs.writeFile('data.json', JSON.stringify(data.sort(sortJSON), null, 2), (err) => {
             if (err) {
                 reject(err)
             } else {
                 resolve(dups); 
             }
        });
        
    })
}

const sortJSON = (a, b) => {
    let nameA = a["Last Name"].toUpperCase(), nameB = b["Last Name"].toUpperCase();
    return nameA > nameB ? 1 : nameB > nameA ? -1 : 0;
}

removeDups()
    .then(subs => {
        console.log(subs.dups20)
        mergeJSON(subs)
        subs.dups20.forEach(sub => {
            // need to remove duplicate images from:
            // /public/images/artcrawl
            // /public/images/thumbnails
            // /public/images/dzi/ -> `${username} + _files`  & `${username} + _files/` 
            // To remove folders: fs.rmdir(path_to_dir, {recursive: true}, callback)
            // To remove files: fs.unlink(path_to_file, callback)
            // fs.rmdir('./test', {recursive: true}, (err) => {console.log(err)})
            fs.unlink(`../../public/images/artcrawl/${sub["Image File"]}`, (err) => console.log(err));
            fs.unlink(`../../public/images/thumbnails/${sub["Image File"]}`, (err) => console.log(err));
            fs.unlink(`../../public/images/dzi/${sub["Username"]}.dzi`, (err) => console.log(err))
            fs.rmdir(`../../public/images/dzi/${sub["Username"]}_files`, {recursive: true}, (err) => {console.log(err)})
        })
    })
    .catch(err => console.log(err));