# Clough Art Crawl -- Digital Exhibit

## Overview

The digital Clough Art Crawl is an interactive digital art gallery serving as an alternative to the typically in-person, bi-annual event.

On the front-end, the project uses 3 open source JavaScript libraries:
1. [OpenSeadragon](https://openseadragon.github.io/) to display high-resolution zoomable images and leverages the [International Image Interoperability Framework (IIIF)](https://iiif.io/) specifications to do so.  
2. [Splide.js](https://splidejs.com/) to create a touch-friendly and mobile-responsive image slider.
3. [Shuffle.js](https://vestride.github.io/Shuffle/) to create a sortable, filterable, and searchable interactive grid of images.

On the back-end, the project is built on top of a simple Node.js server via [Express](https://expressjs.com/). User data is stored in `data.json` and rendered dynamically using [EJS](https://ejs.co/). Currently, all assets are stored on the server, except for a few libraries that are accessed via CDNs (which need to be added eventually):

1. jQuery
2. Popper.js
3. Bootstrap
4. Splide.js Video Extension
5. Images Loaded

---


## Setup

### Submission of User Data
Info and assets needed to power the app can be submitted via Qualtrics survey, for which we've created a [draft](https://gatech.co1.qualtrics.com/jfe/form/SV_6XAsY3VQ5IwQdzD). Considerations for data submitted by users includes validating and sanitizing the data, e.g. prevent cross-site scripting. Qualtrics provides some basic validation, e.g. setting max length/max characters on text submissions.

## Assets 
| Media Type        | Extensions        | Use                  |  
| ----------------- | ----------------- | -------------------- |
| Image - Full Size | .jpeg, .jpg, .png | Slider               |
| Image - Thumbnail | .jpg              | Grid                 |
| Image - IIIF      | .jpg              | OpenSeadragon viewer |
| Audio             | .mp3, .ogg(?)     | `/audio/:id`         |
| Video             | n/a               | Slider               |

---

### Data Cleanup and Asset Management
1. Handle user data 
    1. Sanitize/validate data
    2. Create `data.json` file with objects representing artists and their data:
        ```json
        {
            "Username": String (50 char max),
            "First Name": String (50 char max),
            "Last Name": String (50 char max),
            "Major": String (50 char max),
            "College": String (dropdown option),
            "Title of Artwork": String (x char max),
            "Artist Statement": String (150 char max(?)),
            "Media": String ('Media', 'Audio', or 'Video'),
            "Media Upload Location": String ('youtube' or 'vimeo'),
            "Media URL": String (for 'Audio' or 'Video' -- 100 char max),
            "Image File": File (extensions: .jpg, .jpeg, .png)
        }
        ```
    3. Alphabetize `data.json`
2. Create thumbnails (65 x 65) of images for grid
3. Create `iiif` files for image viewer
4. Compress full size image width to 1080

---

## Production
---

## Concerns
1. 1 server vs. many
2. file sizes