# FastAPI Field Guide

An interactive documentation website built from the notes in [`topics/explanation-1.md`](topics/explanation-1.md). The guide covers API fundamentals, local setup, Python type hints and path parameters, query parameters, and CRUD through one student scenario.

## Open the guide

Open [`site/index.html`](site/index.html) in a browser. The guide has a switchable CRUD route walkthrough, expandable explanations, a browser-based request lab, a quiz, a practice sequence, and a quick revision summary. The walkthrough connects each actual URL to its decorator pattern and function parameters; the lab traces requests through parsing, function behavior, and the response.

The lab simulates requests in the browser. It starts with Ali and Sara, resets on page refresh, and does not call a Python server. Its validation messages are simplified for teaching; real FastAPI validation responses are more detailed.

If Node.js is installed, you can serve the site locally:

```powershell
node site/dev-server.cjs
```

Then open <http://127.0.0.1:4173>. The site uses plain HTML, CSS, and JavaScript, with no build step or backend service.

## Optional real FastAPI experiment

The [CRUD lesson](site/index.html#crud-example) contains a complete, expandable Python example. Copy it to `main.py` outside the documentation site if you want to compare the lab with real HTTP behavior:

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
py -m pip install "fastapi[standard]"
fastapi dev main.py
```

Open <http://127.0.0.1:8000/docs> and try the same student requests. This experiment is optional; the documentation works without Python.

## Check the interactive lab

```powershell
node site/test_simulator.cjs
node site/test_route_walkthrough.cjs
```

This checks the lab’s create, read, replace, partial update, delete, filtering, and validation flows. It does not test the optional Python example.

## Project approach

The website is the learning resource. Future topics should add explanations, examples, visual flows, and useful interactions within the existing site. A separate application or backend is only needed when a concept cannot be taught adequately in the browser.

Technical behavior was checked against the official FastAPI documentation for [first steps](https://fastapi.tiangolo.com/tutorial/first-steps/), [query parameters](https://fastapi.tiangolo.com/tutorial/query-params/), [response codes](https://fastapi.tiangolo.com/tutorial/response-status-code/), and [testing](https://fastapi.tiangolo.com/tutorial/testing/).
