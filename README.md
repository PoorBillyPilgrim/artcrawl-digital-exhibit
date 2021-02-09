# Clough Art Crawl -- Digital Exhibit

## Overview

The digital Clough Art Crawl is an interactive digital art gallery serving as an alternative to the typically in-person, bi-annual event.

On the front-end, the project uses 7 open source JavaScript libraries and 1 front-end framework:
1. [OpenSeadragon - v.2.4.2](https://openseadragon.github.io/) to display high-resolution zoomable images and leverages the [International Image Interoperability Framework (IIIF)](https://iiif.io/) specifications to do so.  
2. [Splide.js - latest version](https://splidejs.com/) to create a touch-friendly and mobile-responsive image slider.
3. [Splide.js video extension](https://splidejs.com/extension-video/) for adding videos to image slider.
4. [Shuffle.js - latest version](https://vestride.github.io/Shuffle/) to create a sortable, filterable, and searchable interactive grid of images.
5. [jQuery - v.3.5.1](https://jquery.com/download/)
6. Popper.js (included with Bootstrap)
7. [Images Loaded](https://imagesloaded.desandro.com/) for image event listener added to `grid.js`
8. [Bootstrap - v.4.5.2](https://getbootstrap.com/docs/4.5/getting-started/introduction/) for styling.

On the back-end, the project is built on top of a simple Node.js server via [Express](https://expressjs.com/). User data is stored in `data.json` and rendered dynamically using [EJS](https://ejs.co/). Currently, all assets are stored on the server, except for a few libraries that are accessed via CDNs (which need to be added eventually):

1. jQuery
2. Popper.js
3. Bootstrap
4. Splide.js Video Extension
5. Images Loaded

---


## Setup

### Submission of User Data
Info and assets needed to power the app can be submitted via a Qualtrics survey, for which we've created a [draft](https://gatech.co1.qualtrics.com/jfe/form/SV_6XAsY3VQ5IwQdzD). Considerations for data submitted by users includes validating and sanitizing the data, e.g. prevent cross-site scripting. Qualtrics provides some basic validation, e.g. setting max length/max characters on text submissions.

## Assets 
| Media Type        | Extensions        | Use                 | User Submitted? | 
| ----------------- | ----------------- | -------------------- | -------------- |
| Image - Full Size | .jpeg, .jpg, .png | Slider               | x              |
| Image - Thumbnail | .jpg              | Grid                 |                |
| Image - IIIF      | .jpg              | OpenSeadragon viewer |                |
| Audio             | .mp3, .ogg(?)     | `/audio/:id`         | x              |
| Video             | n/a               | Slider               | x              |


### Thumnbnails and IIIF
Students submit full-sized copies of the images they would like to represent their art. I have written a script that will loop through a folder of these full-sized images and create a new folder with thumbnail and static, tiled images structured according to IIIF standards. 

---

## Workflow
1. Handle user data 
    1. Sanitize/validate data
    2. Create `data.json` file with objects representing artists and their data:
        ```json
        {
            "Username": "String (50 char max)",
            "First Name": "String (50 char max)",
            "Last Name": "String (50 char max)",
            "Major": "String (50 char max)",
            "College": "String (dropdown option)",
            "Title of Artwork": "String (x char max)",
            "Artist Statement": "String (150 char max(?))",
            "Media": "String ('Media', 'Audio', or 'Video')",
            "Media Upload Location": "String ('youtube' or 'vimeo')",
            "Media URL": "String (for 'Audio' or 'Video' -- 100 char max)",
            "Image File": "File (extensions: .jpg, .jpeg, .png)"
        }
        ```
    3. Alphabetize `data.json`
2. Create thumbnails (65 x 65) of images for grid
3. Create `iiif` files for image viewer
4. Compress width of full-sized image to 1080, height automatically adjusts.

---

## Production
---

### Considerations
1. IIIF server - currently experience performance issues with the OpenSeadragon viewer in Safari and Chrome on an iPhone 6. Possible that this issues extends to other mobile devices. Have tested different file types and configurations and am currently [seeking advice](https://github.com/openseadragon/openseadragon/issues/1938) from the developer. Performance may be boosted by hosting IIIF images on their own [dedicated IIIF server](https://iiif.io/apps-demos/).