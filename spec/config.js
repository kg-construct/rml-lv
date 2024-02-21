async function loadTurtle() {
  //this is the function you call in 'preProcess', to load the highlighter
  const worker = await new Promise(resolve => {
    require(["core/worker"], ({ worker }) => resolve(worker));
  });
  const action = "highlight-load-lang";
  const langURL =
    "https://cdn.jsdelivr.net/gh/redmer/highlightjs-turtle/src/languages/turtle.js";
  const propName = "hljsDefineTurtle"; // This funtion is defined in the highlighter being loaded
  const lang = "turtle"; // this is the class you use to identify the language
  worker.postMessage({ action, langURL, propName, lang });
  return new Promise(resolve => {
    worker.addEventListener("message", function listener({ data }) {
      const { action: responseAction, lang: responseLang } = data;
      if (responseAction === action && responseLang === lang) {
        worker.removeEventListener("message", listener);
        resolve();
      }
    });
  });
}
var respecConfig = {
  preProcess: [loadTurtle],
  localBiblio: {
    "RDF11-Concepts": {
      title: "RDF 1.1 Concepts and Abstract Syntax",
      href: "https://www.w3.org/TR/rdf11-concepts/",
      status: "W3C Recommendation",
      publisher: "W3C",
      date: "25 February 2014",
    },
    "Turtle": {
      title: "RDF 1.1 Turtle",
      href: "https://www.w3.org/TR/turtle/",
      status: "W3C Recommendation",
      publisher: "W3C",
      date: "25 February 2014",
    },
    "RML": {
      title: "RDF Mapping Language",
      href: "https://rml.io/specs/rml/",
      status: "Unofficial draft",
      publisher: "https://rml.io",
      date: "06 October 2020",
    }
  },
  // These may become useful if the document gets a more 'official' status
  // postProcess : [ postProc ],
  doRdfa: "true",
  processVersion: 2021,
  // specification status (e.g. WD, LCWD, WG-NOTE, etc.). If in doubt use ED.
  specStatus: "CG-DRAFT",
  // the specification's short name, as in http://www.w3.org/TR/short-name/
  shortName: "rml-fields",
  // if your specification has a subtitle that goes below the main
  // formal title, define it here
  // subtitle   :  "White Paper",
  // if you wish the publication date to be other than the last modification, set this
  // publishDate:  "2015-06-30",
  // if the specification's copyright date is a range of years, specify
  // the start date here:
  copyrightStart: "2021",
  // if there is a previously published draft, uncomment this and set its YYYY-MM-DD date
  // and its maturity status
  // previousPublishDate: "2015-10-15",
  // previousMaturity: "FPWD",
  // if there a publicly available Editor's Draft, this is the link
  edDraftURI: "https://w3id.org/kg-construct/rml-fields",
  // if this is a LCWD, uncomment and set the end of its review period
  // lcEnd: "2009-08-05",
  // editors, add as many as you like
  // only "name" is required
  editors: [
    {
      name: "Thomas Delva"
      , mailto: "thomas.delva@ugent.be"
      , company: "Ghent University &ndash; imec &ndash; IDLab",
      orcidid: "0000-0001-9521-2185",
      companyURL: "https://idlab.technology/"
    },
    {
      name: "Anastasia Dimou"
      , mailto: "anastasia.dimou@ugent.be"
      , company: "Ghent University &ndash; imec &ndash; IDLab",
      orcidid: "0000-0003-2138-7972",
      companyURL: "https://idlab.technology/"
    }
  ],
  // name of the WG, should be listed at https://respec.org/w3c/groups/
  group: "kg-construct",
  latestVersion: null,
  issueBase: "https://github.com/kg-construct/rml-fields-spec/issues",
  noRecTrack: "true",
  otherLinks: [
    {
      key: "This Version",
      data: [{
        value: "https://kg-construct.github.io/rml-fields-spec/%thisDate%/",
        href: "https://kg-construct.github.io/rml-fields-spec/%thisDate%/"
      }]
    },
    {
      key: "Previous Version",
      data: [{
        value: "https://kg-construct.github.io/rml-fields-spec/%prevDate%/",
        href: "https://kg-construct.github.io/rml-fields-spec/%prevDate%/"
      }]
    },
    {
      key: "Website",
      data: [{
        value: "https://rml.io/",
        href: "https://rml.io/"
      }]
    }
  ],
  // alternateFormats: [],
  //charterDisclosureURI: "http://www.w3.org/2004/01/pp-impl/64149/status",
  // URI of the patent status for this WG, for Rec-track documents
  // !!!! IMPORTANT !!!!
  // This is important for Rec-track documents, do not copy a patent URI from a random
  // document unless you know what you're doing. If in doubt ask your friendly neighbourhood
  // Team Contact.
  //wgPatentURI: "http://www.w3.org/2004/01/pp-impl/64149/status",
  // !!!! IMPORTANT !!!! MAKE THE ABOVE BLINK IN YOUR HEAD
};
