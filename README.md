# portfolio-site

Genc Berisha's product design portfolio, served at https://portfolio.thequalialab.com.

Plain HTML, CSS and a little JavaScript, no build step for hosting. Deployed on Cloudflare (Workers & Pages) from this repo, same setup as qualialab-site: no build command, output directory `/`.

- `index.html`: home page (headline, "Ask me something" questions, work, experience, about, contact)
- `fancircle/`, `career-navig8r/`, `scandlearn/`: case study pages, generated from `_build/gen.py`
- `assets/`: images (and recordings as `<name>.mp4` when added)
- `genc-berisha-cv.pdf`: CV

To edit a case study: change the text in `_build/gen.py`, run `python3 _build/gen.py`, commit. Set `DRAFT = True` there to show empty slots for recordings and quotes while working.

Preview locally: `python3 -m http.server 8000` and open http://localhost:8000.
