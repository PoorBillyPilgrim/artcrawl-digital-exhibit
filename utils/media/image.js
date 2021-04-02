const fs = require('fs');
const sharp = require('sharp');


/**
 * 
 * For processing one image
 * 
 */
let image = {
    username: 'ljarrel6',
    ext: '.jpg',
}
image.fileName = image.username + image.ext;


promises = [],
sharpStream = sharp(`./artcrawl/images/need_processing/${image.fileName}`);
const logErr = (file, err) => { console.log(`${file}: ${err}`)}

// Thumbnails
promises.push(
    sharpStream
        .clone()
        .resize(65, 65, {
            fit: 'fill'
        })
        .toFile(`./artcrawl/thumbnails/${image.fileName}`)
        .catch(err => logErr(image.fileName, err))
);

// DZI
promises.push(
    sharpStream
        .clone()
        .tile({ 
            // both tileSize and pixelOverlap can be changed
            // the smaller the tile the deeper the zoom, but more tiles to load
            size: 512,
            overlap: 1
        })
        .toFile(`./artcrawl/dzi/${image.username}.dz`)
        .catch(err => logErr(image.fileName, err))
);

// 1080px width 
promises.push(
    sharpStream
        .clone()
        .resize(1080)
        .toFile(`./artcrawl/1080/${image.fileName}`)
        .catch(err => logErr(image.fileName, err))
);

Promise.all(promises)
    .then(res => { 
        console.log(`${image.fileName}`, res);
        fs.rename(`./artcrawl/images/need_processing/${image.fileName}`, `./artcrawl/images/${image.fileName}`, (err) => {
            if (err) console.log(err);
        });
    })
    .catch(err => {
        console.error(`Error processing ${image.fileName}, let's clean it up`, err);
    });

