# Scandlearn (v2, 2026-11-17): rebuilt in the Fancircle / Navig8r v2 format. Old LMS3 screens come from the
# 2020 onboarding handbook Genc received at the start; research, flows, sitemaps and slides are Genc's own.
def oldwide(src, alt, cap):
    return (f'<figure class="wide old"><div class="old-shot"><img src="../assets/{src}"{full_attr(src)} alt="{html.escape(alt)}" loading="lazy">'
            '<p class="old-strip"><span>Before</span><span>Old version</span></p></div>'
            f'<figcaption>{cap}</figcaption></figure>')

# Genc's slides rebuilt as boards: the labels are real text in the site font, the UI artwork is cut from Genc's SVGs.
# Each block: (area, label or None, [images]). Desktop places blocks in a grid by area; phones stack them in order.
from PIL import Image as _Im
def _w(f): return _Im.open(os.path.join(ROOT, "assets", "m", f)).size[0]
BOARDS = {
  "sl-dashboard.webp": ("dash", [("a","At a glance: what needs attention today.",["dash-stats.webp"]), ("b",None,["dash-reports.webp"]),
                                 ("c","Quick actions for the most common jobs.",["qa-0.webp","qa-1.webp"])]),
  "sl-search.webp": ("search", [("a","Filter by trainings, modules, users or materials.",["chip-0.webp","chip-1.webp","chip-2.webp","chip-3.webp"]),
                                ("b","⌘K opens search from anywhere.",["search-bar.webp"]), ("c",None,["search-results.webp"])]),
  "sl-flow-analysis.webp": ("flow", [("a",None,["flow-1.webp"]), ("b",None,["flow-2.webp"]), ("c",None,["flow-3.webp"])]),
  "sl-design-system.webp": ("ds", [("a","Type scale",["ds-type.webp"]), ("b","Inputs and pickers",["ds-calendar.webp","ds-dropdown.webp"]), ("c","Colour",["ds-colours.webp"])]),
}
def figm(src, alt, cap):
    kind, blocks = BOARDS[src]
    def cls(f):
        if f.startswith("flow-") or f == "ds-dropdown.webp": return "m-card"
        if f.startswith("chip-"): return "m-chip"
        if f.startswith("qa-"): return "m-qa"
        return "m-shot"
    out = ""
    for area, label, imgs in blocks:
        lab = f'<p class="m-label">{label}</p>' if label else ""
        row = "chips" if imgs[0].startswith("chip-") else ""
        ims = "".join(f'<img class="{cls(f)}" src="../assets/m/{f}" data-full="../assets/{src}" alt="" loading="lazy">' for f in imgs)
        st = f' style="--fw:{_w(imgs[0])}"' if kind == "flow" else ""
        out += f'<div class="bd-{area}"{st}>{lab}<div class="m-row {row}">{ims}</div></div>'
    return (f'<figure class="wide board board-{kind}"><div class="m-stack" role="img" aria-label="{html.escape(alt)}">{out}</div>'
            f'<figcaption>{cap}</figcaption></figure>')

def pair(a, b):
    return '<div class="pair">' + fig(*a) + fig(*b) + '</div>'


# Flow analysis rebuilt from Genc's separate flow exports (2026-11-17); the notes are Genc's words, set as text.
def _fa(img, title, note, alt, w, pos, seq, start, span=""):
    # Flow export at half size (2x export). The note is a speech bubble beside the problem step. case.js walks a dot
    # through the steps (seq: [x%, y%, label, hold ms, "b" = show the note]) so each flow plays out its problem.
    sp = f'<span class="fa-span" style="{span}"></span>' if span else ""
    return (f'<div class="fa-col"><p class="fa-t">{title}</p><div class="fa-card" data-seq=\'{seq}\'><span class="fa-step">{start}</span>'
            f'<div class="fa-flow" style="--w:{w}px">{sp}<img src="../assets/{img}" alt="{html.escape(alt)}" loading="lazy">'
            f'<p class="fa-bub" style="{pos}">{note}</p></div></div></div>')
FLOW_BOARD = ('<figure class="wide fa-board"><div class="fa-grid">'
  + _fa("sl-fa-curriculum.webp", "Adding curriculum", "Cancelling forces users to restart from scratch.", "Old flow: Curriculum page, Add curriculum, Select type, Add item, Confirm, Add to the list. Cancel at Add item goes back to the Curriculum page.", 210, "top:20%", '[[-5, 5.1, "Step 1 of 4"], [-5, 22.7, "Step 2 of 4"], [-5, 40.3, "Step 3 of 4"], [3, 65.2, "Step 4 of 4: cancel?"], [79, 65.2, "Cancel", 0, "b"], [88.4, 65.2, "Cancel"], [88.4, 5.1, "Cancel"], [72, 5.1, "Cancel"], [41.5, 5.1, "Cancel"], [-5, 5.1, "Back to step 1", 2600]]', "Cancel sends you back to step 1")
  + _fa("sl-fa-group.webp", "Adding a user to a group", "Redundant steps slow down progress.", "Old flow: Users page, Add email, Go to Groups, Add to group, Select groups, Confirm, then the groups are added to the list.", 160, "top:29%", '[[-5, 3.9, "Step 1 of 7"], [-5, 17.4, "Step 2 of 7"], [-5, 30.8, "Step 3 of 7", 0, "b"], [-5, 44.4, "Step 4 of 7"], [-5, 57.8, "Step 5 of 7"], [-5, 77, "Step 6 of 7"], [-5, 96, "Step 7 of 7: done", 2600]]', "7 steps for one person", "top:26%;height:36%")
  + _fa("sl-fa-module.webp", "Opening a module", "Deep navigation levels slow down core tasks.", "Old flow: Home page, Training, Creative Studio, Modules, Filter by draft, Open module.", 138, "top:36%", '[[-7, 5.2, "Level 1 of 6"], [-7, 23.1, "Level 2 of 6"], [-7, 41, "Level 3 of 6", 0, "b"], [-7, 58.9, "Level 4 of 6"], [-7, 76.8, "Level 5 of 6"], [-7, 94.6, "Level 6 of 6: open", 2600]]', "6 levels deep")
  + '</div></figure>')

SL_HERO = ('<figure class="wide cover-desk" aria-label="Scandlearn: the admin training list and the learner course player.">'
  '<img src="../assets/sl-list-final.webp" alt="" loading="eager">'
  '<img src="../assets/sl-learner-player.webp" alt="" loading="eager"></figure>')

SL_SUMMARY = ('<div class="tldr"><p class="tldr-h">The short version</p><ol>'
  '<li><a href="#navigation"><b>Each role sees its own pages first.</b> Seven clear sections replaced a sitemap where some pages sat seven levels deep.</a></li>'
  '<li><a href="#search"><b>Search became the main way around.</b> One search across trainings, modules, users and materials, one ⌘K away.</a></li>'
  '<li><a href="#flows"><b>No more starting over.</b> Curriculum content is picked from one filtered list, so cancelling no longer throws your work away.</a></li>'
  '</ol></div>')

SL_CHAPTERS = ('<nav class="chapters" aria-label="Sections"><div>'
  + "".join(f'<a href="#{i}">{t}</a>' for i, t in [("problem","Problem"),("research","Research"),("navigation","Navigation"),("search","Search"),("flows","Flows"),("training-list","Training list"),("learners","Learners"),("components","Components"),("outcome","Outcome")])
  + '</div></nav>')


# Interactive global search demo (built from Genc's search elements)
GS_TRAININGS = ["ADS-B Out & In","Controlled Flight Into Terrain (CFIT)","Cosmic and Solar Radiation","Crew Resource Management (CRM)","Fuel Tank Safety Awareness Training","First Aid","Low Visibility (LVO) CAT II/III","Meteorology","Performance-Based Navigation (PBN)","Winter operations and Surface contamination training (generic)","Airbus A320 - Flight Crew"]
GS_DATA = {"t": GS_TRAININGS,
  "m": ["ADS-B: How surveillance works","CFIT: Terrain awareness","Crew communication","Radiation exposure on long flights","De-icing procedures","CPR and AED basics","Approach minima","Reading METARs and TAFs"],
  "u": ["John Doe","Emma Smith","Olivia Jones","Sophia Miller","Jackson Davis","Ava Brown","Liam Wilson","Mia Clark"],
  "x": ["Aviation Security - Cabin.pdf","A320 Quick Reference.pdf","CRM Case Studies.pdf","test-image.jpg","Winter Ops Checklist.docx","First Aid Poster.png"]}
import json as _json
GS_DEMO = ('<figure class="wide gs-fig"><div class="gs" data-gs=\'' + html.escape(_json.dumps(GS_DATA), quote=True) + '\'>'
  '<div class="gs-app">'
  '<label class="gs-box"><span class="ic ic-search" aria-hidden="true"></span>'
  '<span class="gs-tag" hidden><span class="ic"></span><b></b><button type="button" aria-label="Remove filter">×</button></span>'
  '<input type="text" autocomplete="off" spellcheck="false" aria-label="Search trainings, modules, users and materials" placeholder="Search everything">'
  '<kbd class="gs-kbd">⌘K</kbd></label>'
  '<div class="gs-chips" role="toolbar" aria-label="Filter by type">'
  '<button type="button" data-t="t"><span class="ic ic-cap"></span>Trainings</button>'
  '<button type="button" data-t="m"><span class="ic ic-puzzle"></span>Modules</button>'
  '<button type="button" data-t="u"><span class="ic ic-users"></span>Users</button>'
  '<button type="button" data-t="x"><span class="ic ic-book"></span>Materials</button></div>'
  '<div class="gs-panel"><p class="gs-h"></p><ul class="gs-list" role="listbox"></ul></div>'
  '<p class="gs-toast" aria-live="polite"></p></div></div>'
  '<figcaption>Try it: click the search bar or press ⌘K, pick a type, and type.</figcaption></figure>')

_extra = [b for b in PAGES["scandlearn"]["body"] if "<h2>" not in b]   # draft-only slots (walkthrough video, quote)

PAGES["scandlearn"] = dict(
  cls="dark-stage v2 dark-end scandlearn",
  footer=V2_FOOTER,
  title="Scandlearn", tag="How do pilots find their training in a system that feels like a maze?",
  intro="A Swedish training and certification platform for airlines. As the only designer, I redesigned it in 8 months, then stayed 4 more to design new features.",
  facts=[("Role","Product Designer, sole designer"),("My part","Survey and interviews, competitor review, sitemap, admin and learner experience, search and the component library. The Scandlearn team owned the product and built it."),("Users","Admin, Author, Protocol Instructor, Learner"),("Timeline","2022 to 2023, web")],
  stats=[("400+","screens in 8 months"),("4","user roles, each with its own navigation"),("30","survey replies, plus user interviews")],
  hero=SL_HERO, summary=SL_SUMMARY, chapters=SL_CHAPTERS,
  body=_extra + [
    sec("The problem",
        bigstat("21", "steps to publish one training", "Support was stretched thin because users couldn't find features. The 2020 handbook sent to me on day one needed 21 numbered steps just to publish a training. In interviews and a survey, people called it \"a frustrating maze\"."),
        "<p>Screens of the old platform, from that handbook. Click any screen to see it whole.</p>",
        oldwide("sl-old-crew.webp", "The old Crew page: an icon rail, a second column of role and status filters, then the user list. Names and emails are blurred.", "Before: an icon rail, then a filter column, then the list. Three layers of menus before any content."),
        oldwide("sl-old-settings.webp", "The old Create Training settings: schedule, availability, expiry, expiry cycle, new session, notifications, certificate and survey.", "Before: the last of four tabs every new training went through"),
        "<p><b>Mapping it showed why.</b> Some pages sat seven levels deep. Cancelling meant starting over, and steps repeated.</p>",
        fig("sl-old-sitemap.webp", "The old sitemap drawn as levels 0 to 7, with notification and user attribute settings at level 7.", "The old sitemap: some pages sat seven levels deep", wide=True),
        FLOW_BOARD, id="problem"),
    sec("What users and rivals told me",
        "In the survey, most people named the system itself as the most frustrating part, ahead of courses, navigation or control.",
        "I compared Scandlearn with CPaT, Aviation eLearning, Evionica, Leon and Webmanuals. The rivals looked modern but gave admins little control over courses and staff. Scandlearn had that control but buried it under an outdated, crowded interface. So the brief became: <b>keep the control, lose the maze.</b>",
        pair(("sl-survey.webp", "Four survey charts, from part of the 30 respondents: comfort with digital platforms, the most frustrating part of the system, apps used most, and the pros of those apps.", "Survey charts from part of the 30 respondents, not the whole group"),
             ("sl-roles.webp", "Each role, from Administrator to Learner, Author, Financial and Protocol Manager, with the pages it needs, marked by priority.", "Each role and the pages it needs, ranked by use")),
        fig("sl-competitors.webp", "Competitor matrix comparing Scandlearn, CPaT, Aviation eLearning and Evionica on value proposition, advantages, disadvantages and design details.", "Competitor analysis", wide=True), cls="band", id="research"),
    sec("Navigation by role","Admins, authors, instructors and learners need different things. Starting from the role map, I rebuilt the sitemap into seven main sections, each with a few groups, so every role sees its own pages first. Global search, a left panel and a tree of tabs tie them together.",
        fig("sl-new-sitemap.webp", "The new sitemap: main navigation with global search, left panel menu and tabs tree view, over seven sections from Dashboard to Configuration.", "The new sitemap", wide=True),
        "<p><b>The dashboard opens on what needs attention.</b> Key numbers, the latest activity, quick actions to add a training, invite users or make a group, and notifications.</p>",
        fig("sl-dashboard-full.webp", "Admin dashboard: users enrolled, trainings and expired currencies, a feed of reports, a work-in-progress card, quick actions for new training, invite users and new group, and notifications.", "The admin dashboard: what needs attention today, one click from action", wide=True).replace('<figure class="wide">','<figure class="wide pan">'), id="navigation"),
    sec("Search as the main way around","More menus don't fix findability. One search covers trainings, modules, users and materials, with type filters, a ⌘K shortcut and recent searches, so admins jump straight to what they need.",
        vid("sl-search","Finding a training with global search"),
        GS_DEMO, cls="band", id="search"),
    sec("Fewer steps, no starting over","I redrew the two flows from the analysis above. Curriculum content is now picked from one list with filters, so cancelling no longer throws your picks away. Inviting a user and adding them to a group happen in one place, with no separate Groups page and no confirm step.",
        pair(("sl-flow-curriculum-new.webp", "New curriculum flow: Curriculum page, Add curriculum, all curriculum content, filter and pick content, updated curriculum page.", "Adding curriculum: one filtered list"),
             ("sl-flow-invite-new.webp", "New invite flow: from the home page to Users and Groups, add an email and invite, pick groups in a popup, and the list updates.", "Inviting a user: invite and group in one place")), id="flows"),
    sec("The training list in three rounds","Admins spend most of their day in the training list, so I took it through three rounds. The first wireframe tested the layout. The second moved filters into a side panel and let a row open in place, showing its courses with links straight to each part of the training. The final version put navigation in one sidebar, moved search, columns and filters into the toolbar, and shows who is enrolled at a glance.",
        pair(("sl-list-v1.webp", "First wireframe of the training list: a profile panel, a menu, column filters and a long table.", "Round 1: wireframe"),
             ("sl-list-v2.webp", "Second wireframe: a filter panel on the left and one training row opened in place, listing its courses and links to details, curriculum, enrollment, schedule, certification, skills test and survey.", "Round 2: a row opens in place")),
        fig("sl-list-final.webp", "Final Training Management screen: dark sidebar with sub-pages, a toolbar with search, columns and filters, and a table with type, enrolled people and status.", "Final: Training Management", wide=True), cls="band", id="training-list"),
    sec("What learners see","Learners need two things: what to do next and where they stand. Their list shows progress, expiry and one Resume button. Inside a training, the course outline stays on the side with each lesson's status, so nobody loses their place.",
        fig("sl-learner-list.webp", "Learner trainings list with tabs for yet to start, in progress and completed, a progress bar per training, expiry dates and a Resume button.", "A learner's trainings", wide=True),
        fig("sl-learner-player.webp", "Course player in dark mode: a self-study lesson with a download button, and the course outline on the right with each lesson's status.", "Inside a training: the outline stays visible", wide=True), id="learners"),
    sec("One component library","A shared library of type, colours, inputs, pickers and tables with row actions kept 400+ screens consistent. It also made bigger tools, like the certificate builder, quick to put together.",
        figm("sl-design-system.webp", "Component library: Montserrat type scale, colour palettes, grid, date picker, dropdown, inputs, toggles, icons and buttons.", "The component library"),
        fig("sl-cert-builder.webp", "Certificate builder: drag rows, text boxes and images into a certificate, edit text in place, then save or use a template.", "Built from the library: the certificate builder", wide=True), id="components"),
    sec("Outcome", bigstat("400+", "screens handed over to development", "The client kept me on for 4 more months to design a new website, a video player and a CBTA (competency-based training) feature. I left before the build finished, so I have no usage numbers."), id="outcome"),
    sec("What I'd do differently", '<p class="lesson-big">Plan the second survey before the first one ends.</p>', "We had a baseline, the survey, but no plan to measure again. Next time I'd agree before handover to rerun it after launch.", cls="lesson"),
  ], next="fancircle")
