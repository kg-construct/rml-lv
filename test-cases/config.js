async function loadTurtle() {
  //this is the function you call in 'preProcess', to load the highlighter
  // ReSpec >= v36 no longer exposes the AMD `require`, so the worker can't be reached:
  // skip loading the Turtle highlighter instead of breaking the whole pipeline.
  if (typeof require !== "function") return;
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

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

async function highlightTurtle() {
  // ReSpec >= v36 can't load extra highlight languages (see loadTurtle), so the Turtle
  // blocks are highlighted here, in the page itself, after ReSpec is done.
  const blocks = document.querySelectorAll("pre code.turtle, pre.turtle:not(:has(code))");
  if (!blocks.length) return;
  if (!window.hljs) {
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js");
  }
  if (!hljs.getLanguage("turtle")) {
    await loadScript("https://cdn.jsdelivr.net/gh/redmer/highlightjs-turtle@v2.1.0/src/languages/turtle.js");
    hljs.registerLanguage("turtle", hljsDefineTurtle);
  }
  for (const block of blocks) {
    block.innerHTML = hljs.highlight(block.textContent, { language: "turtle" }).value;
    block.classList.add("hljs");
  }
}

var respecConfig = {
  // check https://respec.org/docs/ for the meaning of these keys
  preProcess: [loadTurtle],
  postProcess: [highlightTurtle],
  authors: [
     {
              name: "Pano Maria",
              company: "ModelDesk",
              url: "https://modeldesk.io",
              orcid: "0009-0000-2598-1894",
              companyURL: "https://modeldesk.io"
            },
    {
      name: "Els de Vleeschauwer",
      mailto: "els.devleeschauwer@ugent.be",
      company: "Ghent University &ndash; imec &ndash; IDLab",
      orcid: "0000-0002-8630-3947",
      companyURL: "https://idlab.technology/"
    }
  ],
  edDraftURI: "https://w3id.org/rml/lv/test-cases/",
  editors: [
     {
              name: "Pano Maria",
              company: "ModelDesk",
              url: "https://modeldesk.io",
              orcid: "0009-0000-2598-1894",
              companyURL: "https://modeldesk.io"
            },
    {
      name: "Els de Vleeschauwer",
      mailto: "els.devleeschauwer@ugent.be",
      company: "Ghent University &ndash; imec &ndash; IDLab",
      orcid: "0000-0002-8630-3947",
      companyURL: "https://idlab.technology/"
    }
  ],
  formerEditors: [
  ],
  github: "https://github.com/kg-construct/rml-lv",
  license: "w3c-software-doc",
  localBiblio: {
    "RML-Core": {
      title: "RML-Core",
      href: "https://w3id.org/rml/core/spec",
      status: "Draft Community Group Report",
      publisher: "W3C",
      date: "07 August 2024",
    },
    "RML-IO": {
      title: "RML-IO",
      href: "https://w3id.org/rml/io/spec",
      status: "Draft Community Group Report",
      publisher: "W3C",
      date: "12 March 2024",
    },
  },
  //publishDate:  "2026-03-03",
  otherLinks: [],
  latestVersion: null,
  prevVersion: "https://kg-construct.github.io/rml-lv/test-cases/docs/20260303/",
  shortName: "RML-LV-Testcases",
  specStatus: "CG-DRAFT",
  // W3C config
  copyrightStart: "2024",
  doJsonLd: true,
  group: "kg-construct",
};
