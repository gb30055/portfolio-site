# Career Navig8r (v2, 2026-11-12): rebuilt in the Fancircle v2 format from Genc's own Figma frames.
def desk(*items, cls=""):
    # Desktop screens, two per row: (file, alt, caption)
    return phones(*items, cls=("two desk " + cls).strip())

CN_HERO = ('<figure class="wide cover-desk" aria-label="Career Navig8r: the mentor directory and the home feed.">'
  '<img src="../assets/cn2-home.webp" alt="" loading="eager">'
  '<img src="../assets/cn2-public.webp" alt="" loading="eager"></figure>')

CN_SUMMARY = ('<div class="tldr"><p class="tldr-h">The short version</p><ol>'
  '<li><a href="#setup"><b>One topic per step.</b> I split mentor setup into 5 short steps instead of 4 crowded ones.</a></li>'
  '<li><a href="#availability"><b>Show only what\'s needed.</b> Time pickers appear only for days that are on. A mentor starts with 8 controls, not about 30.</a></li>'
  '<li><a href="#executive"><b>A separate path for executive mentors.</b> Certified senior mentors apply, then set their specialisms and plans.</a></li>'
  '</ol></div>')

CN_CHAPTERS = ('<nav class="chapters" aria-label="Sections"><div>'
  + "".join(f'<a href="#{i}">{t}</a>' for i, t in [("problem","Problem"),("process","Process"),("setup","Setup"),("availability","Availability"),("executive","Executive mentors"),("beyond","Beyond setup"),("outcome","Outcome")])
  + '</div></nav>')

DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
AVAIL = ('<div class="avail">'
  '<div class="av-toast" role="status" aria-live="polite" hidden></div>'
  '<div class="av-head"><span class="av-title">Set your availability</span><span class="av-head-r"><button type="button" class="av-reset" disabled>Reset</button><span class="wn-try">Interactive</span></span></div>'
  '<p class="av-zone">Time zone <b>Europe, London</b></p>'
  '<ul class="av-days">' + "".join(
    f'<li data-day="{d}"><label class="av-row"><span>{d}</span><input type="checkbox" class="av-sw" aria-label="Available on {d}"></label>'
    '<div class="av-slots" hidden></div></li>'
    for d in DAYS) + '</ul>'
  '<p class="av-count"><b class="av-n">8</b> controls on screen, growing only with the days you switch on. The old page showed about <b>30</b> before you picked anything.</p></div>')

def loupe(src, alt, cap, x, y, lx, ly, d, z, old=False):
    # Whole screen with a fixed magnifier: content centred on (x,y), lens placed at (lx,ly), all as fractions
    st = f"--x:{x};--y:{y};--lx:{lx};--ly:{ly};--d:{d};--z:{z};--img:url(../assets/{src})"
    strip = '<p class="old-strip"><span>Before</span><span>Old version</span></p>' if old else ''
    return (f'<figure class="lp-fig{" old" if old else ""}"><div class="lp" style="{st}"><img src="../assets/{src}"{full_attr(src.replace("-hi",""))} alt="{alt}" loading="lazy">'
            f'<span class="lp-ring" aria-hidden="true"></span><span class="lp-lens" aria-hidden="true"></span>{strip}</div>'
            f'<figcaption>{cap}</figcaption></figure>')

PAGES["career-navig8r"] = dict(
  cls="dark-stage v2 dark-end navig8r",
  footer=V2_FOOTER,
  title="Career Navig8r", tag="How do we get more mentors to finish their profile?",
  intro="A mentoring platform where people learn from those who already succeeded in the job they want. I led design on onboarding and the core product.",
  facts=[("Role","Product Designer, design lead"),("My part","Took over from a previous designer. Redesigned mentor onboarding and search, and guided a junior designer on the cards, posts and comments."),("Team","Founder, developers and a junior designer"),("Timeline","2025 to 2026, web")],
  stats=[("13 → 6","minutes to finish setup, timed in team walkthroughs"),("30 → 8","controls before a mentor picks a day"),("5","focused steps instead of 4 crowded ones")],
  hero=CN_HERO, summary=CN_SUMMARY, chapters=CN_CHAPTERS,
  body=[
    sec("The problem",bigstat("30","controls on one setup page","No mentors, no bookings. I took over mentor onboarding from a previous designer, and it was the hardest flow in the product: 4 crowded steps, a 100-word essay, and one page asking for availability, languages and links all at once."),
        '<p class="evidence">The founder\'s verdict on the old flow was simple: <b>the process is too long.</b> That became the brief.</p>',
        "<p>Click any screen to see the whole page.</p>",
        '<div class="lp-row">'
        + loupe("cn2-b_avail-hi.webp","The old Availability page: time zone, every day with its own time pickers, languages, and LinkedIn, Twitter and Instagram links, all on one page. The magnifier shows that days switched off still show their time pickers.","Before: time pickers for all 7 days, even the ones switched off",0.20,0.45,0.70,0.54,40,1.6,old=True)
        + loupe("cn2-b_focus-hi.webp","The old Mentoring Focus page: job role, a 100-word essay, skills, a key project and an intro video side by side. The magnifier shows the essay field, half covered by a tips popup.","Before: a 100-word essay, half hidden by a tips popup",0.36,0.23,0.70,0.56,42,1.4,old=True)
        + '</div>', id="problem"),
    sec("Mapped before it was drawn","Before any screen, I mapped who signs up and what each of them has to give us. Basic users get a short profile. Mentors get their own setup, split so every step has one job.",
        fig("cn2-flow-profile.webp","Flow: profile setup for a basic user, from work experience to language, about me and social links, until the profile is complete.","Basic user profile: the short path",wide=True),
        '<ol class="steps-cmp"><li><span>Old mentor setup</span><b>Work experience</b><b>Availability + languages + links</b><b>Mentoring focus</b><b>Plans and pricing</b></li>'
        '<li><span>New mentor setup</span><b>Work experience</b><b>Availability</b><b>Mentoring focus</b><b>Plans and pricing</b><b>Promotion</b></li></ol>', cls="band", id="process"),
    sec("One topic per step","I split setup into 5 steps: Work Experience, Availability, Mentoring Focus, Plans and Pricing, and Promotion. Each step asks one question, and the left column says why it matters to mentees.",
        "<p><b>Before and after.</b> The old Work Experience page stacked every job and a key project into one long form. The new one asks for one job at a time.</p>",
        desk(("cn2-b_work.webp","The old Work Experience page: job title, organisation, dates and a key project form stacked for each role.","Before: every job and a key project in one long form"),
             ("cn2-work-add.webp","The new Work Experience step, adding a single job.","After: one job at a time")),
        "<p><b>A short page that stays short.</b> Saved jobs collapse into small cards, and the other steps follow the same pattern: one question on the left, the answer on the right.</p>",
        desk(("cn2-work-filled.webp","Work Experience step with two saved jobs shown as compact cards.","Saved jobs collapse into compact cards"),
             ("cn2-focus.webp","Mentoring Focus step: the job role, why you're the right mentor for it, and the skills you gained.","Mentoring Focus: role, reasons and skills, with tips beside them"),
             ("cn2-promotion.webp","Promotion step: LinkedIn, Twitter and Instagram links, and openness to media requests.","Promotion: the links moved out of availability"),
             ("cn2-plans.webp","Plans and Pricing step: Lite, Standard and Professional plans, each with an Offer switch.","Plans and Pricing: one card per plan")), id="setup"),
    sec("Show only what's needed","The old page showed every control for every day. Now time pickers appear only for days that are switched on, and one slot can be applied to all selected days.",
        "<p><b>Try it.</b> Switch a day on, set its hours, then copy them to your other days with the apply button.</p>",
        AVAIL,
        '<div class="lp-row">'
        + loupe("cn2-avail-apply-hi.webp","Availability with Tuesday on and two time slots. A magnifier shows the copy button and its tooltip: Apply to your selected days.","Copy one slot to every selected day",0.80,0.525,0.36,0.55,52,2.6)
        + loupe("cn2-avail-warn-hi.webp","Availability with a warning at the top. A magnifier shows it: Please select more days to apply this timeslot.","A clear warning when there's nowhere to copy to",0.81,0.178,0.40,0.55,54,2.2)
        + '</div>', cls="warm", id="availability"),
    sec("A separate path for executive mentors","Senior, certified mentors needed more than the basic setup: proof of certification, specialisms and their own plans. I gave them their own application and setup instead of piling more fields onto everyone else's.",
        "<p><b>A clear way in.</b> Mentors who already have a profile see two paths side by side, so the upgrade is a choice, not a hidden form.</p>",
        '<figure class="tiers"><div class="tier-row">'
        '<div class="tier"><img src="../assets/cn2-icon-bulb.webp" alt="" width="120" height="120"><div><b>Navig8r</b><span>Peer mentors. Share experience, guide mentees, no certification needed.</span></div></div>'
        '<div class="tier exec"><img src="../assets/cn2-icon-trophy.webp" alt="" width="120" height="120"><div><b>Executive Mentor</b><span>Accredited mentors. Verified status and their own plans for mentees who want expert guidance.</span></div></div>'
        '</div><figcaption>3D icons for the two mentor tiers, generated with AI from a JSON prompt I wrote so both match</figcaption></figure>',
        desk(("cn2-path.webp","Level up your Mentorship Path: Enjoy your Navigator profile, or Apply as Executive Mentor for accredited mentors.","The entry point: two paths, side by side"),
             ("cn2-exec-apply.webp","Apply as Executive Mentor: name, email, coaching body, membership number and level, proof upload.","Apply with proof of certification")),
        fig("cn2-flow-mentor.webp","Flow: executive mentor setup. Experience level, career, specialisms, psychometric tools, then if certified: membership body, ID, level and proof.","Executive mentor flow",wide=True),
        "<p><b>Before and after.</b> The old pages asked for a count of mentees at every career level and put four offers in one dense grid. The new steps ask for experience in plain words, and specialisms come from suggestions, so mentees can filter by them later.</p>",
        desk(("cn2-b_exec.webp","The old executive experience page: quantity fields for each career level and a list of organisations.","Before: counts per career level"),
             ("cn2-exec-experience.webp","Tell us about your experience: years of mentoring, previous career field, and an introduction.","After: their experience, in their words"),
             ("cn2-b_plans.webp","The old plans page: Lite, Standard, Professional and Enterprise in one grid.","Before: four offers in one grid"),
             ("cn2-exec-specialism.webp","Mentoring Specialism: pick up to six areas, with suggestions, plus psychometric tools.","After: up to six specialisms, picked from suggestions")), id="executive"),
    sec("Beyond setup","Setup only matters if mentees find the mentors. I designed search and the mentor directory. A junior designer built the mentor cards, posts, comments and other components, with me setting the direction and reviewing each round. Together we tested how much a mentor card can hold before it gets hard to scan.",
        '<div class="lp-row">'
        + loupe("cn2-search-hi.webp","Search overlay with filters for Navig8rs, Executive Mentors, Questions and Career updates, plus popular and recent searches. The magnifier shows the filter chips and the first suggestions.","Filters and suggestions before you type",0.28,0.2,0.70,0.58,44,1.6)
        + loupe("cn2-public-hi.webp","Connect with a Navig8r: directory with sector, job field and level filters, active filter chips and mentor cards. The magnifier shows the active filter chips, each one removable.","Every active filter stays visible and removable",0.40,0.56,0.75,0.52,40,1.7)
        + '</div>',
        fig("cn-cards.webp","Mentor card variants, from a full card with levels and skills to a compact one with name, rating and price.","Card variants we tested, from full detail to compact"), id="beyond"),
    sec("Outcome",bigstat("13 → 6","minutes to finish setup","Timed in team walkthroughs of the old flow and the new design. Most of the time saved came from fewer fields per step, and from not filling in time pickers for days a mentor doesn't work. It's an estimate from walkthroughs, not usage data."), id="outcome"),
    sec("What I'd do differently",'<p class="lesson-big">Measure the drop-off before you fix it.</p>',"The time savings come from walkthroughs, not usage data. Next time I'd add step-by-step completion tracking from day one, to see where mentors really drop off.", cls="lesson"),
  ], next="scandlearn")
