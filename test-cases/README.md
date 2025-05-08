# RML LV test cases

The test cases publication (html pages) can be generated as followed:

1. Add the testcase description in `descriptions.csv` or fetch it from the [Google spreadsheet](https://docs.google.com/spreadsheets/d/1Ui216z2cF8bNAbdZvws-JoAhcjj4M2k_NlfzmCh1jh8/edit?gid=1769343477#gid=1769343477).
2. Navigate to folder ./test-cases
3. Execute the `make-metadata.py` script: `python3 make-metadata.py http://w3id.org/rml/lv/`
   (This is based on the content of the folders with the test cases, more than on the descriptions.csv)
4. Generate the manifest with [Burp](https://github.com/kg-construct/BURP): `java -jar burp.jar -m manifest.rml.ttl -o manifest.ttl -b http://w3id.org/rml/lv/test/`
5. Run list.sh and insert output in dev.html
6. To publish the new HTML verson of the test cases, export `dev.html` as `index.html` in ./docs and in a subfolder with the date of the publication (maybe adapt the publication date)

