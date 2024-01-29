# RML logical Views specification

Specification of RML logical view

## Quickstart

- edit dev.html
  - Makes sure all your local assets are in the `resources` folder, and the links in your dev.html file are relative (important because the publishing script creates multiple nested paths)
- run a HTTP server in this directory: `python3 -m http.server`
- open `dev.html` with a browser as http://localhost:8000/dev.html
- save as snapshot to `rendered.html` using the ReSpec's functionality: Button in the top right of the page "ReSpec" -> "Export..." -> "HTML"
- run `node publish.js` to get the index.html + archived version in the `docs` folder
