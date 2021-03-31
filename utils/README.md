# Qualtrics Workflow
1. Download CSV and media files from Qualtrics
2. Save CSV to `Desktop/qualtrics/data/`
3. media to `Desktop/qualtrics/media/` and rename `/Audio File/` as `/media/` and `/Image File/` as `/images/`
4. Convert CSV to JSON and save to `Desktop/qualtrics/data/`
5. Copy JSON to `/art-crawl-exhibit/`
    ```bash
    cp Desktop/qualtrics/data/qualtrics.json Documents/projects/art-crawl-exhibit/utils/data/qualtrics.json
    ```
6. Copy media to `/art-crawl-exhibit/`
    ```bash
    cp Desktop/qualtrics/media/ Documents/projects/art-crawl-exhibit/utils/media/
    ```
7. Rewrite `qualtrics.json` as `2021.json` by running `/utils/data/json.js` & rewrite `data.json` as `2022.json`
8. Using `/utils/data/duplicates.js`, weed out duplicates from `2020.json`, remove duplicates from `/public/images/git `, combine `2020.json` and `2021.json`, alphabetize, and save as `data.json`
9. Convert `.pdf`s to `.jpg`s
10. Qualtrics prepends the Reponse ID to each media file name. To rename files with username, run `/utils/data/renameMedia.js`
11. Generate .dzi, thumbnails, and compressed images by running `/utils/media/images.js`



