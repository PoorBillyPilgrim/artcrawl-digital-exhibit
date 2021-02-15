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
Below is a suggested workflow for obtaining, validating, and processing the user submitted data following the workflow I drafted as I experimented with the various data and media needed to create the prototype. In the interest of reducing the workload for IT&D, I would like to manage the intake of data.

### Workflow Outline
Setting up the project for production in three steps:
1. Acquire, sanitize, and validate student info and media files
2. Organize student info as a `.json` file
3. Create copies of student images for different uses within app

## Student Info and Media Files
**Summary**: Receive student info and media in such a way that 1) the info can be efficiently validated and sanitized, and 2) the data can easily be converted to a `.json` file. 

### Form Submission
Info and media needed to power the app could be submitted via a Qualtrics survey, for which we've created a [draft](https://gatech.co1.qualtrics.com/jfe/form/SV_6XAsY3VQ5IwQdzD). Considerations for data submitted by users includes validating and sanitizing the data, e.g. prevent cross-site scripting. Qualtrics provides some basic validation, e.g. setting max length/max characters on text submissions.

I am open to using an alternative to Qualtrics. I recognize that other alternatives may be more efficient and better equpiied at validation and sanititization. 

### Media File Descriptions
| Media Type        | Extensions        | Use                 | User Submitted? | 
| ----------------- | ----------------- | -------------------- | -------------- |
| Image - Full Size | .jpeg, .jpg, .png | Slider               | x              |
| Image - Thumbnail | .jpg              | Grid                 |                |
| Image - DZI       | .dzi              | OpenSeadragon viewer |                |
| Audio             | .mp3, .ogg(?)     | `/audio/:id`         | x              |
| Video             | n/a               | Slider               | x              |

---

## Organize Student Info as `.json`

1. After validating and sanitizing data, create `data.json` file with objects representing artists and their data:

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

2. Alphabetize `data.json` using `./utils/sort.js`

## Process Images
Students submit full-sized copies of the images they would like to represent their art. After submission, three copies for each image will need to be created: a small 65px x 65 px thumbnail for the grid, deep zoom tiles for the OpenSeadragon viewer, and copy with a compressed width of 1080px for the slider.

I have written a script (`./utils/images.js`) using [sharp](https://sharp.pixelplumbing.com/) - a Node.js image processing package - that creates these three additional image files.
    
Workflow:
1. In `utils/`, create `artcrawl_full_size/` folder and add images submitted by students.
2. Either create three other folders (`./dzi/`, and `./thumbnails/`, and `./artcrawl_1080/`) or direct script to write newly created images files to `../public/images/dzi/`, `../public/images/thumbnails/`, and `../public/images/artcrawl/`.
3. From `utils` run the script
    ```zsh
    cd utils
    node images.js
    ````

---

## Production
---

### Considerations
1. Separate server for assets