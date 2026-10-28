# Builds the case study pages from the content below. Run: python3 _build/gen.py (from the site folder)
import html, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def fig(src, alt, cap=None, wide=False):
    c = f"<figcaption>{cap}</figcaption>" if cap else ""
    return f'<figure class="{"wide" if wide else ""}"><img src="../assets/{src}" alt="{html.escape(alt)}" loading="lazy">{c}</figure>'

def sec(h, *parts):
    return f"<section><h2>{h}</h2>" + "".join(p if p.startswith("<") else f"<p>{p}</p>" for p in parts) + "</section>"

def ul(*items):
    return "<ul>" + "".join(f"<li>{i}</li>" for i in items) + "</ul>"

DRAFT = False  # shows empty slots for recordings and quotes; set False before going live

def vid(name, label):
    # Put the recording at assets/<name>.mp4 (silent, 10 to 20 s). Until then a draft slot shows.
    if os.path.exists(os.path.join(ROOT, "assets", name + ".mp4")):
        return f'<figure class="wide"><video src="../assets/{name}.mp4" autoplay muted loop playsinline aria-label="{html.escape(label)}"></video><figcaption>{label}</figcaption></figure>'
    return f'<div class="slot">Screen recording: {label}</div>' if DRAFT else ""

def quote(text=None, who=None, ask=""):
    if text:
        return f'<blockquote><p>{text}</p><cite>{who}</cite></blockquote>'
    return f'<div class="slot">Quote from {ask}</div>' if DRAFT else ""

PAGES = {
"fancircle": dict(
  title="Fancircle", tag="How do new artists find their first true fans?",
  intro="A loyalty-based social app for music, with a fan app and an artist app. I helped shape the product from the idea stage and led design to v1.0.",
  facts=[("Role","Head of Design"),("Team","Founder, COO, project manager, 2 growing to 5 developers, QA"),("Timeline","2023 to 2025"),("Platform","iOS and Android")],
  stats=[("700+","screens across two role-based apps"),("50+","artist commitments before launch"),("0 to 1","from first sketch to v1.0")],
  hero=("fancircle-creative-room.webp","Creative Room: a song's waveform with time-stamped comments, next to the feedback history."),
  body=[
    vid("fc-walkthrough","60-second screen recording of the Fancircle prototype, with short captions for each decision (no face or voice)"),
    sec("My part","I co-shaped the product with the founder and designed both apps end to end, including SongMatch and Creative Room, plus the prototypes and decks used with investors and artists. The founder set the vision, a project manager ran delivery, and a team that grew to 5 developers and QA built it."),
    quote(ask="Stephan Goldhahn, founder"),
    sec("The problem","Artists earn about 0.003€ per stream, and social media gives them reach but no real relationship with the fans who were there first. Most fans say they would support their artists directly if there were a good way to do it."),
    sec("Two apps, one product","Fans want to discover and feel close. Artists want to publish, reward and understand their community. One interface for both would have made each side worse, so I designed two role-based apps on one shared system: 300+ frames for fans, 400+ for artists.",
        '<div class="pair">'+fig("fc-fan-frames.webp","Figma overview of the fan app.","Fan app")+fig("fc-artist-frames.webp","Figma overview of the artist app.","Artist app")+'</div>'),
    sec("SongMatch: discovery like dating","Scrolling a catalogue is tiring. I borrowed a gesture everyone knows: swipe right to like a song, left to skip. Every like lands in a playlist the fan can keep.",
        vid("fc-songmatch","Swiping through songs in SongMatch"),
        fig("fc-songmatch.webp","SongMatch flow from the Explore card to the saved playlist.","From Explore to playlist",wide=True)),
    sec("Creative Room: feedback pinned to the moment","\"The middle part feels off\" wastes everyone's time. In Creative Room, collaborators select part of the waveform and leave a note there, SoundCloud style, and a timeline keeps every upload, comment and task in order.",
        vid("fc-creative-room","Leaving a comment on part of a track"),
        fig("fc-timeline.webp","Creative Room project timeline.","The project timeline",wide=True)),
    sec("Outcome",ul("v1.0 designed and built for iOS and Android.","50+ artist commitments before launch, won with the app prototypes and pitch decks I designed.","A registered EU trademark."),"The product did not take off. The company ran out of money before it found its users."),
    sec("What I'd do differently","Our scope grew faster than the team could build, and the core loop was never tested on its own. Today I'd push for a tight MVP around that one loop, agree on a single success metric, and put it in front of real fans first. Saying no to features is part of the job."),
  ], next="career-navig8r"),
"career-navig8r": dict(
  title="Career Navig8r", tag="How do we get more mentors to finish their profile?",
  intro="A mentoring platform where people learn from those who already succeeded in the job they want. I was the only designer, on onboarding and the core product.",
  facts=[("Role","Product Designer, sole designer"),("Team","Founder and developers"),("Timeline","2025 to 2026"),("Scope","Feed, posting, search, mentor discovery, mentor onboarding")],
  stats=[("~½","the setup time, about 13 min to 6 (walkthrough estimate)"),("30 → 8","controls on the busiest screen"),("5","focused steps, plus a review page")],
  hero=("navig8r-home-feed.webp","Career Navig8r home feed with posts, questions and suggested mentors."),
  body=[
    vid("cn-walkthrough","60-second screen recording of the new mentor setup, with short captions for each decision (no face or voice)"),
    sec("My part","I was the only designer, taking over a platform a previous designer had started. I redesigned mentor onboarding and designed the feed, posting, search and mentor cards. The founder owned the direction and the developers built it."),
    quote(ask="the Career Navig8r founder"),
    sec("The problem","No mentors, no bookings. But becoming a mentor was the hardest flow in the product: 4 crowded steps, a 100-word essay, and one page with about 30 controls for availability, languages and links at once.",
        '<div class="pair">'+fig("cn-old-focus.webp","The old Mentoring Focus page.","Before: many unrelated questions on one page")+fig("cn-new-work.webp","The new Work Experience step.","After: one topic per step")+'</div>'),
    sec("One topic per step","I split setup into 5 steps: Work Experience, Availability, Mentoring Focus, Plans and Pricing, and Promotion. Each step answers one question, and the left column explains why it matters.",
        vid("cn-onboarding","Going through the 5 setup steps")),
    sec("Show only what's needed","Time pickers appear only for days that are switched on. Saved jobs collapse into small cards. The busiest screen went from about 30 controls to 8.",
        fig("cn-availability.webp","Availability step states.","Pickers appear only for days that are on",wide=True)),
    sec("Review before saving","A final page shows the whole profile with an edit link per section, so mentors fix mistakes without stepping back through everything."),
    sec("Beyond onboarding","I also designed the home feed, posting, comments, search with filters and mentor cards, testing several card layouts to see how much a card can hold before it gets hard to scan.",
        '<div class="pair">'+fig("cn-search.webp","Search overlay with filters.","Search")+fig("cn-cards.webp","Mentor card variants.","Mentor card variants")+'</div>'),
    sec("What I'd do differently","The time savings come from walkthroughs, not usage data. Next time I'd add step-by-step completion tracking before launch, to see where mentors really drop off."),
  ], next="scandlearn"),
"scandlearn": dict(
  title="Scandlearn", tag="How do pilots find their training in a system that feels like a maze?",
  intro="A Swedish training and certification platform for airlines. As the only designer, I redesigned it in 8 months, then stayed 4 more to design new features.",
  facts=[("Role","Product Designer, sole designer"),("Users","Admin, Author, Protocol Instructor, Learner"),("Timeline","2022 to 2023"),("Scope","Dashboard, training modules, quizzes, certificate builder, search")],
  stats=[("400+","screens in 8 months"),("4","user roles, each with its own navigation"),("~30","survey replies, plus user interviews")],
  hero=("scandlearn-dashboard.webp","Scandlearn admin dashboard with enrolled users, trainings, reports and quick actions."),
  body=[
    vid("sl-walkthrough","60-second screen recording of the redesigned platform, with short captions for each decision (no face or voice)"),
    sec("My part","I was the only designer: I ran the interviews and survey, mapped the old flows, rebuilt the sitemap, and designed the admin experience, search, course structure and component library. The Scandlearn team owned the product and built it."),
    quote(ask="someone at Scandlearn"),
    sec("The problem","Support was stretched thin because users couldn't find features. In interviews and a survey (about 30 replies), people called it \"a frustrating maze\". Mapping the flows showed why: cancelling meant starting over, navigation was deep, and steps repeated.",
        fig("sl-flow.webp","Flow analysis with problem points marked in red.","Flow analysis of the old platform",wide=True)),
    sec("Navigation by role","Admins, authors, instructors and learners need different things. I rebuilt the sitemap so each role sees its own pages first, and designed the full-access admin experience."),
    sec("Search as the main way around","More menus don't fix findability. One search covers trainings, modules, users and materials, with type filters, a ⌘K shortcut and recent searches.",
        vid("sl-search","Finding a training with global search"),
        fig("sl-search.webp","Global search with filters and recent searches.","Global search",wide=True)),
    sec("A tree view and one component library","An expandable tree shows where you are in a deep course. A shared library of type, colours, inputs and tables with row actions kept 400+ screens consistent.",
        fig("sl-components.webp","Scandlearn component library.","The component library",wide=True)),
    sec("Outcome",ul("400+ screens handed over to development.","The client kept me on for 4 more months for a new website, video player and CBTA (competency-based training) feature."),"I left before the build finished, so I have no usage numbers."),
    sec("What I'd do differently","We had a baseline, the survey, but no plan to measure again. Next time I'd agree before handover to rerun it after launch."),
  ], next="fancircle"),
}

TPL = open(os.path.join(ROOT, "_build", "case.tpl.html")).read()
for slug, p in PAGES.items():
    nxt = PAGES[p["next"]]
    out = (TPL.replace("{{TITLE}}", p["title"]).replace("{{TAG}}", p["tag"]).replace("{{INTRO}}", p["intro"])
       .replace("{{FACTS}}", "".join(f"<div><dt>{k}</dt><dd>{v}</dd></div>" for k, v in p["facts"]))
       .replace("{{STATS}}", "".join(f"<li><strong>{n}</strong><span>{t}</span></li>" for n, t in p["stats"]))
       .replace("{{HERO}}", fig(p["hero"][0], p["hero"][1], wide=True))
       .replace("{{BODY}}", "".join(p["body"]))
       .replace("{{NEXT_SLUG}}", p["next"]).replace("{{NEXT_TITLE}}", nxt["title"]).replace("{{NEXT_TAG}}", nxt["tag"]))
    os.makedirs(os.path.join(ROOT, slug), exist_ok=True)
    open(os.path.join(ROOT, slug, "index.html"), "w").write(out)
    print("wrote", slug)
