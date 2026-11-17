# Scandlearn (v2, 2026-11-17): rebuilt in the Fancircle / Navig8r v2 format. Old LMS3 screens come from the
# 2020 onboarding handbook Genc received at the start; research, flows, sitemaps and slides are Genc's own.
def oldwide(src, alt, cap):
    return (f'<figure class="wide old"><div class="old-shot"><img src="../assets/{src}"{full_attr(src)} alt="{html.escape(alt)}" loading="lazy">'
            '<p class="old-strip"><span>Before</span><span>Old version</span></p></div>'
            f'<figcaption>{cap}</figcaption></figure>')

MSTACK = {
  "sl-dashboard.webp": [["dash-stats.webp"], ["dash-reports.webp"]],
  "sl-search.webp": [["search-bar.webp"], ["search-results.webp"]],
  "sl-flow-analysis.webp": [["flow-1.webp"], ["flow-2.webp"], ["flow-3.webp"]],
  "sl-design-system.webp": [["ds-type.webp"], ["ds-calendar.webp", "ds-dropdown.webp"], ["ds-colours.webp"]],
}
def figm(src, alt, cap):
    # Wide slide on desktop. On phones the slide is swapped for its screens alone, cut from Genc's SVGs.
    cls = lambda f: "m-card" if f.startswith("flow-") or f == "ds-dropdown.webp" else "m-shot"
    rows = "".join('<div class="m-row">' + "".join(f'<img class="{cls(f)}" src="../assets/m/{f}" data-full="../assets/{src}" alt="" loading="lazy">' for f in r) + "</div>" for r in MSTACK[src])
    return (f'<figure class="wide has-m"><img class="d-only" src="../assets/{src}" data-full="../assets/{src}" alt="{html.escape(alt)}" loading="lazy">'
            f'<div class="m-stack" role="img" aria-label="{html.escape(alt)}">{rows}</div><figcaption>{cap}</figcaption></figure>')

def pair(a, b):
    return '<div class="pair">' + fig(*a) + fig(*b) + '</div>'

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
        figm("sl-flow-analysis.webp", "Flow analysis of three old flows: adding curriculum, where cancelling restarts from scratch; adding a user to a group, with redundant steps; and opening a module, buried under deep navigation.", "Flow analysis: where the old flows broke"), id="problem"),
    sec("What users and rivals told me",
        "In the survey, most people named the system itself as the most frustrating part, ahead of courses, navigation or control.",
        "I compared Scandlearn with CPaT, Aviation eLearning, Evionica, Leon and Webmanuals. The rivals looked modern but gave admins little control over courses and staff. Scandlearn had that control but buried it under an outdated, crowded interface. So the brief became: <b>keep the control, lose the maze.</b>",
        pair(("sl-survey.webp", "Four survey charts, from part of the 30 respondents: comfort with digital platforms, the most frustrating part of the system, apps used most, and the pros of those apps.", "Survey charts from part of the 30 respondents, not the whole group"),
             ("sl-roles.webp", "Each role, from Administrator to Learner, Author, Financial and Protocol Manager, with the pages it needs, marked by priority.", "Each role and the pages it needs, ranked by use")),
        fig("sl-competitors.webp", "Competitor matrix comparing Scandlearn, CPaT, Aviation eLearning and Evionica on value proposition, advantages, disadvantages and design details.", "Competitor analysis", wide=True), cls="band", id="research"),
    sec("Navigation by role","Admins, authors, instructors and learners need different things. Starting from the role map, I rebuilt the sitemap into seven main sections, each with a few groups, so every role sees its own pages first. Global search, a left panel and a tree of tabs tie them together.",
        fig("sl-new-sitemap.webp", "The new sitemap: main navigation with global search, left panel menu and tabs tree view, over seven sections from Dashboard to Configuration.", "The new sitemap", wide=True),
        "<p><b>The dashboard opens on what needs attention.</b> Key numbers, the latest activity, quick actions to add a training, invite users or make a group, and notifications.</p>",
        figm("sl-dashboard.webp", "Admin dashboard: users enrolled, trainings and currencies, a feed of reports, quick actions for new training, invite users and new group, and notifications.", "The admin dashboard"), id="navigation"),
    sec("Search as the main way around","More menus don't fix findability. One search covers trainings, modules, users and materials, with type filters, a ⌘K shortcut and recent searches, so admins jump straight to what they need.",
        vid("sl-search","Finding a training with global search"),
        figm("sl-search.webp", "Global search: filter chips for trainings, modules, users and materials, the ⌘K search bar, recent searches and a filtered list of trainings.", "Global search"), cls="band", id="search"),
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
