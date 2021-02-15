const fs = require('fs');
const sharp = require('sharp');

fs.readdir('./artcrawl_full_size/', (err, files) => {
    files.forEach(file => {
        let i = file.search(/\./),
        ext = file.slice(i);
        username = file.slice(0, i),
        promises = [],
        sharpStream = sharp(`./artcrawl_full_size/${file}`);
        const logErr = (file, err) => { console.log(`${file}:${err}`)}
        
        // Thumbnails
        promises.push(
            sharpStream
                .clone()
                .resize(65, 65, {
                    fit: 'fill'
                })
                .toFile(`./thumbnails/${username}${ext}`)
                .catch(err => logErr(file, err))
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
                .toFile(`./dzi/${username}.dz`)
                .catch(err => logErr(file, err))
        );

        // 1080px width 
        promises.push(
            sharpStream
                .clone()
                .resize(1080)
                .toFile(`./artcrawl_1080/${username}${ext}`)
                .catch(err => logErr(file, err))
        );

        Promise.all(promises)
        .then(res => { console.log(`${file}`, res); })
        .catch(err => {
            console.error(`Error processing ${file}, let's clean it up`, err);
        });
    });
});