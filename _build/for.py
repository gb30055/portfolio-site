# Builds one hidden page per company: for/<slug>/index.html. Run: python3 _build/for.py (from the site folder)
# The pages are not linked from the site and carry noindex, so only people with the link see them.
# Images for a company go in for/<slug>/ next to its page (e.g. for/acme/before.webp).
import html, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def img(src, alt, cap=None):
    # src is a file in for/<slug>/; until it exists, a dashed placeholder shows.
    c = f"<figcaption>{cap}</figcaption>" if cap else ""
    return f'<figure class="wide"><img src="{src}" alt="{html.escape(alt)}" loading="lazy">{c}</figure>'

def before_after(before, after, alt_b, alt_a):
    return ('<div class="pair ba">'
            f'<figure><img src="{before}" alt="{html.escape(alt_b)}" loading="lazy"><figcaption><b>Today</b></figcaption></figure>'
            f'<figure><img src="{after}" alt="{html.escape(alt_a)}" loading="lazy"><figcaption><b>My idea</b></figcaption></figure></div>')

def sec(h, *parts):
    return f"<section><h2>{h}</h2>" + "".join(p if p.startswith("<") else f"<p>{p}</p>" for p in parts) + "</section>"

def ul(*items):
    return "<ul>" + "".join(f"<li>{i}</li>" for i in items) + "</ul>"

CASES = {
  "fancircle": ("Fancircle", "Consumer app from 0 to 1, two user roles, 700+ screens."),
  "career-navig8r": ("Career Navig8r", "Onboarding redesign that cut setup time about in half."),
  "scandlearn": ("Scandlearn", "Complex B2B platform made findable, 4 roles, 400+ screens."),
}

# One entry per company. Copy "example", rename the key (it becomes the link), fill it in.
COMPANIES = {
"example": dict(
  publish=False,  # the example is only a preview, it never goes live
  company="Example Co", role="Product Designer application",
  title="Getting new teams to their first report faster",
  intro="Hi, I'm Genc, a product designer applying for your Product Designer role. Before applying, I signed up and spent an hour with the product. One moment stood out, so here is a quick first take, from the outside.",
  body=[
    sec("What I noticed","After sign-up, new teams land on an empty dashboard with six options and no clear first step. I clicked around for a few minutes before I found how to create a first report.",
        img("noticed.webp","The empty dashboard after sign-up.","The first screen after sign-up")),
    sec("The idea","Replace the empty dashboard with one guided first step: pick a template, connect one data source, and see a report in under two minutes. Everything else stays one click away.",
        before_after("before.webp","after.webp","Today's empty dashboard.","A guided first step with templates.")),
    sec("Why it could matter",ul("Teams that see value in the first session are more likely to come back.","Fewer \"where do I start?\" support questions.","It works with what's already built, so it's a small change to try.")),
    sec("How I'd check it","I'd look at how many new teams create a first report in their first session today, talk to five of them, and test the guided step against the current screen with a small group first."),
    sec("What I don't know","I only see the product from the outside. You know your users, your data and your constraints, so some of this may already be planned or ruled out. I'd love to hear what I got wrong."),
  ],
  case="career-navig8r"),
}

TPL = open(os.path.join(ROOT, "_build", "for.tpl.html")).read()
for slug, p in COMPANIES.items():
    title, why = CASES[p["case"]]
    out = (TPL.replace("{{COMPANY}}", p["company"]).replace("{{ROLE}}", p["role"])
           .replace("{{TITLE}}", p["title"]).replace("{{INTRO}}", p["intro"])
           .replace("{{BODY}}", "".join(p["body"]))
           .replace("{{CASE_SLUG}}", p["case"]).replace("{{CASE_TITLE}}", title).replace("{{CASE_WHY}}", why))
    base = "for" if p.get("publish", True) else "preview/for"
    d = os.path.join(ROOT, base, slug)
    os.makedirs(d, exist_ok=True)
    if base != "for":  # preview copies sit one level deeper
        out = out.replace('href="../../', 'href="../../../').replace('"../../styles.css"', '"../../../styles.css"')
    open(os.path.join(d, "index.html"), "w").write(out)
    print("wrote", os.path.join(base, slug))
