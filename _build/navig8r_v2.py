# Career Navig8r (v2, 2026-11-12): rebuilt in the Fancircle v2 format from Genc's own Figma frames.
def desk(*items, cls=""):
    # Desktop screens, two per row: (file, alt, caption)
    return phones(*items, cls=("two desk " + cls).strip())

CN_HERO = ('<figure class="wide cover-desk" aria-label="Two steps of the new mentor setup: work experience and availability.">'
  '<img src="../assets/cn2-avail-on.webp" alt="" loading="eager">'
  '<img src="../assets/cn2-work-filled.webp" alt="" loading="eager"></figure>')

CN_SUMMARY = ('<div class="tldr"><p class="tldr-h">The short version</p><ol>'
  '<li><a href="#setup"><b>One topic per step.</b> Mentor setup became 5 short steps instead of 4 crowded ones.</a></li>'
  '<li><a href="#availability"><b>Show only what\'s needed.</b> Time pickers appear only for days that are on, so the busiest screen went from about 30 controls to 8.</a></li>'
  '<li><a href="#executive"><b>A separate path for executive mentors.</b> Certified senior mentors apply, then set their specialisms and plans.</a></li>'
  '</ol></div>')

CN_CHAPTERS = ('<nav class="chapters" aria-label="Sections"><div>'
  + "".join(f'<a href="#{i}">{t}</a>' for i, t in [("problem","Problem"),("process","Process"),("setup","Setup"),("availability","Availability"),("executive","Executive mentors"),("beyond","Beyond setup"),("outcome","Outcome")])
  + '</div></nav>')

DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
AVAIL = ('<div class="avail" data-old="30">'
  '<div class="av-head"><span class="av-title">Set your availability</span><span class="wn-try">Interactive</span></div>'
  '<p class="av-zone">Time zone <b>Europe, London</b></p>'
  '<ul class="av-days">' + "".join(
    f'<li><label class="av-row"><span>{d}</span><input type="checkbox" class="av-sw" aria-label="Available on {d}"></label>'
    '<div class="av-slots" hidden><span>from</span><b>09:00</b><span>to</span><b>17:00</b><button type="button" class="av-add" aria-label="Add a time slot">+</button></div></li>'
    for d in DAYS) + '</ul>'
  '<p class="av-count"><b class="av-n">0</b> controls on screen. The old page showed about <b>30</b> at once.</p></div>')

PAGES["career-navig8r"] = dict(
  cls="dark-stage v2 dark-end navig8r",
  footer=V2_FOOTER,
  title="Career Navig8r", tag="How do we get more mentors to finish their profile?",
  intro="A mentoring platform where people learn from those who already succeeded in the job they want. I was the only designer, on onboarding and the core product.",
  facts=[("Role","Product Designer, sole designer"),("My part","Took over from a previous designer. Redesigned mentor onboarding, and designed the feed, posting, search and mentor cards."),("Team","Founder and developers"),("Timeline","2025 to 2026, web")],
  stats=[("~½","the setup time, about 13 min to 6 (walkthrough estimate)"),("30 → 8","controls on the busiest screen"),("5","focused steps instead of 4 crowded ones")],
  hero=CN_HERO, summary=CN_SUMMARY, chapters=CN_CHAPTERS,
  body=[
    sec("The problem",bigstat("30","controls on one setup page","No mentors, no bookings. But becoming a mentor was the hardest flow in the product: 4 crowded steps, a 100-word essay, and one page asking for availability, languages and links all at once."),
        desk(("cn2-b_avail.webp","The old Availability page: time zone, every day with its own time pickers, languages, and LinkedIn, Twitter and Instagram links, all on one page.","Before: availability, languages and links on one page"),
             ("cn2-b_focus.webp","The old Mentoring Focus page: job role, a 100-word essay, skills, a key project and an intro video side by side.","Before: role, essay, skills and a key project at once")), id="problem"),
    sec("Mapped before it was drawn","Before any screen, I mapped who signs up, what each kind of mentor has to give us, and in which order, so every step had one job.",
        fig("cn2-flow-profile.webp","Flow: profile setup for a basic user, from sign-up to a finished profile.","Profile setup flow",wide=True), cls="band", id="process"),
    sec("One topic per step","Setup became 5 steps: Work Experience, Availability, Mentoring Focus, Plans and Pricing, and Promotion. Each step asks one question, and the left column says why it matters to mentees.",
        "<p><b>Start empty, end with a clear record.</b> Saved jobs collapse into small cards, so the page stays short as mentors add more.</p>",
        desk(("cn2-work-empty.webp","Work Experience step, empty: You haven't added any work history yet.","Work Experience, empty"),
             ("cn2-work-filled.webp","Work Experience step with two saved jobs shown as compact cards.","Saved jobs become compact cards")),
        "<p><b>Before and after.</b> The old Work Experience page asked for every job and a key project in one long form. The new one asks for one job at a time.</p>",
        desk(("cn2-b_work.webp","The old Work Experience page: job title, organisation, dates and a key project form stacked for each role.","Before: one long form"),
             ("cn2-work-add.webp","The new Work Experience step, adding a single job.","After: one job at a time")),
        "<p><b>The rest follows the same pattern.</b> One question on the left, the answer on the right.</p>",
        desk(("cn2-focus.webp","Mentoring Focus step: the job role, why you're the right mentor for it, and the skills you gained.","Mentoring Focus"),
             ("cn2-promotion.webp","Promotion step: LinkedIn, Twitter and Instagram links, and openness to media requests.","Promotion")), id="setup"),
    sec("Show only what's needed","The old page showed every control for every day. Now time pickers appear only for days that are switched on, and one slot can be applied to all selected days.",
        "<p><b>Try it.</b> Switch days on and off, and watch how little is on screen.</p>",
        AVAIL,
        desk(("cn2-avail-apply.webp","Availability with Tuesday on, two time slots, and a tooltip: Apply to your selected days.","Apply one slot to every selected day"),
             ("cn2-avail-warn.webp","A warning: Please select more days to apply this timeslot.","A clear warning instead of a silent fail")), cls="band", id="availability"),
    sec("A separate path for executive mentors","Senior, certified mentors needed more than the basic setup: proof of certification, specialisms and their own plans. I gave them their own application and setup instead of piling more fields onto everyone else's.",
        "<p><b>A clear way in.</b> Mentors who already have a profile see two paths side by side, so the upgrade is a choice, not a hidden form.</p>",
        desk(("cn2-path.webp","Level up your Mentorship Path: Enjoy your Navigator profile, or Apply as Executive Mentor for accredited mentors.","The entry point: two paths, side by side"),
             ("cn2-exec-apply.webp","Apply as Executive Mentor: name, email, coaching body, membership number and level, proof upload.","Apply with proof of certification")),
        fig("cn2-flow-mentor.webp","Flow: executive mentor setup. Experience level, career, specialisms, psychometric tools, then if certified: membership body, ID, level and proof.","Executive mentor flow",wide=True),
        "<p><b>Before and after.</b> The old pages asked for a count of mentees at every career level and put four offers in one dense grid. The new steps ask for experience in plain words, and give each plan a full card with a clear Offer switch.</p>",
        desk(("cn2-b_exec.webp","The old executive experience page: quantity fields for each career level and a list of organisations.","Before: counts per career level"),
             ("cn2-exec-experience.webp","Tell us about your experience: years of mentoring, previous career field, and an introduction.","After: their experience, in their words"),
             ("cn2-b_plans.webp","The old plans page: Lite, Standard, Professional and Enterprise in one grid.","Before: four offers in one grid"),
             ("cn2-exec-plans.webp","Design your mentoring offerings: Lite, Standard and Professional plans with meetings per month and response time.","After: one card per plan, switched on or off")),
        "<p><b>Specialisms, not essays.</b> Mentors pick up to six areas from suggestions, so mentees can filter by them later.</p>",
        fig("cn2-exec-specialism.webp","Mentoring Specialism: pick up to six areas, with suggestions.","Pick up to six specialisms"), id="executive"),
    sec("Beyond setup","Setup only matters if mentees find the mentors. I also designed the home feed, search and the mentor directory.",
        "<p><b>Home and search.</b> The feed mixes questions and career milestones, with mentors on the right. Search opens with popular and recent searches before you type.</p>",
        desk(("cn2-home.webp","Home feed for a new user: post box, recent activity, questions and milestones, and mentor suggestions.","Home feed"),
             ("cn2-search.webp","Search overlay with filters for Navig8rs, Executive Mentors, Questions and Career updates, plus popular and recent searches.","Search before you type")),
        "<p><b>One search, three kinds of result.</b> People, questions and career updates sit under one query, filtered from the left.</p>",
        desk(("cn2-results.webp","Search results for UX/UI Design: a question, then people cards for Navig8rs and Executive Mentors.","All results"),
             ("cn2-questions.webp","Results filtered to Questions.","Filtered to questions")),
        "<p><b>Finding the right mentor.</b> The directory splits Navig8rs from Executive Mentors and filters by sector, job field and level. I tested several card layouts to see how much a card can hold before it gets hard to scan.</p>",
        desk(("cn2-public.webp","Connect with a Navig8r: directory with sector, job field and level filters, active filter chips and mentor cards.","Mentor directory with filters"),
             ("cn2-updates.webp","Results filtered to Milestones: career update posts.","Filtered to career updates")),
        fig("cn-cards.webp","Mentor card variants.","Mentor card variants"), id="beyond"),
    sec("Outcome",bigstat("13 → 6","minutes to finish setup","In team walkthroughs, the new flow took about half the time of the old one, with 5 focused steps and at most 8 controls on a screen. This is an estimate from walkthroughs, not usage data."), id="outcome"),
    sec("What I'd do differently",'<p class="lesson-big">Measure the drop-off before you fix it.</p>',"The time savings come from walkthroughs, not usage data. Next time I'd add step-by-step completion tracking before launch, to see where mentors really drop off.", cls="lesson"),
  ], next="scandlearn")
