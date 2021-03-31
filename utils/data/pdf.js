const fs = require('fs');
const data = require('./test.json');

const PDFImage = require("pdf-image").PDFImage; // https://www.npmjs.com/package/pdf-image

data.forEach(sub => {
    let i = sub["Image File"].search(/([^.]*$)/),
    ext = sub["Image File"].slice(i).toLowerCase();
    if (ext === "pdf") {
        let pdfImage = new PDFImage(`../media/artcrawl/images/${sub["Image File"]}`);

        pdfImage.convertPage(0).then(function (imagePath) {
        // 0-th page (first page) of the slide.pdf is available as slide-0.png
        fs.rename(imagePath, imagePath.replace(/-0/, ''), (err) => console.log(err)) 
        return sub["Image File"];
    }).then(pdf => console.log(pdf));
    }
});



