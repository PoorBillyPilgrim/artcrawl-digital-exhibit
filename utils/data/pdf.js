const fs = require('fs');
const data = require('./data.json');

const PDFImage = require("pdf-image").PDFImage; // https://www.npmjs.com/package/pdf-image

data.forEach(sub => {
    let i = sub["Image File"].search(/([^.]*$)/),
    ext = sub["Image File"].slice(i).toLowerCase();
    
    if (ext === "pdf") {
        let pdf = sub["ResponseId"] + '_' + sub["Image File"];
        let pdfImage = new PDFImage(`../media/qualtrics/images/${pdf}`);

        pdfImage.convertPage(0).then(function (imagePath) {
            // 0-th page (first page) of the slide.pdf is available as slide-0.png
            fs.rename(imagePath, imagePath.replace(/-0/, ''), (err) => console.log(err)); // removes '-0' that PDFImage adds
            return pdf;
        }).then(pdf => {
            fs.unlink(`../media/qualtrics/images/${pdf}`, (err) => console.log(err)); // deletes .pdf file
        })
    }
});



