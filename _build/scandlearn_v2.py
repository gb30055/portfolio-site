# Scandlearn page body. Old LMS3 screens come from the 2020 onboarding handbook Genc received at the start;
# research, sitemaps and flows come from Genc's own research deck (2026-11-17 uploads).
def oldwide(src, alt, cap):
    return (f'<figure class="wide old"><div class="old-shot"><img src="../assets/{src}"{full_attr(src)} alt="{html.escape(alt)}" loading="lazy">'
            '<p class="old-strip"><span>Before</span><span>Old version</span></p></div>'
            f'<figcaption>{cap}</figcaption></figure>')

_old = {b.split("<h2>")[1].split("</h2>")[0]: b for b in PAGES["scandlearn"]["body"] if "<h2>" in b}
_vid = [b for b in PAGES["scandlearn"]["body"] if "<h2>" not in b]

PAGES["scandlearn"]["body"] = _vid + [
    sec("My part","I was the only designer. I ran the survey and interviews, compared five competitors, wrote personas, mapped the old flows and sitemap, rebuilt the navigation, and designed the admin experience, search, course structure and component library. The Scandlearn team owned the product and built it."),
    sec("The problem",
        bigstat("21", "steps to publish one training", "Support was stretched thin because users couldn't find features. The 2020 handbook sent to me on day one needed 21 numbered steps just to publish a training. In interviews and a survey, people called it \"a frustrating maze\"."),
        "<p>Screens of the old platform, from that handbook.</p>",
        oldwide("sl-old-crew.webp", "The old Crew page: an icon rail, a second column of role and status filters, then the user list. Names and emails are blurred.", "Before: an icon rail, then a filter column, then the list. Three layers of menus before any content."),
        oldwide("sl-old-settings.webp", "The old Create Training settings: schedule, availability, expiry, expiry cycle, new session, notifications, certificate and survey.", "Before: the last of four tabs every new training went through, with expiry rules, certificate and survey on one form."),
        "<p><b>Mapping it showed why.</b> Some pages sat seven levels deep, cancelling meant starting over, and steps repeated.</p>",
        fig("sl-old-sitemap.webp", "The old sitemap drawn as levels 0 to 7, with notification and user attribute settings at level 7.", "The old sitemap: some pages sat seven levels deep", wide=True),
        fig("sl-flow.webp","Flow analysis with problem points marked in red.","Flow analysis of the old platform",wide=True), id="problem"),
    sec("What users and rivals told me",
        "In the survey, most people named the system itself as the most frustrating part, ahead of courses, navigation or control.",
        "I also compared Scandlearn with CPaT, Aviation eLearning, Evionica, Leon and Webmanuals. The rivals looked modern but gave admins little control over courses and staff. Scandlearn had that control but buried it under an outdated, crowded interface. So the brief became: <b>keep the control, lose the maze.</b>",
        '<div class="pair">' + fig("sl-survey.webp", "Four survey charts, from part of the 30 respondents: comfort with digital platforms, the most frustrating part of the system, apps used most, and the pros of those apps.", "Survey charts from part of the 30 respondents, not the whole group") + fig("sl-roles.webp", "Each role, from Administrator to Learner, Author, Financial and Protocol Manager, with the pages it needs, marked by priority.", "Each role and the pages it needs, ranked by use") + '</div>',
        fig("sl-competitors.webp", "Competitor matrix comparing Scandlearn, CPaT, Aviation eLearning and Evionica on value proposition, advantages, disadvantages and design details.", "Competitor analysis", wide=True), id="research"),
    sec("Navigation by role","Admins, authors, instructors and learners need different things. Starting from that role map, I rebuilt the sitemap into seven main sections, each with a few groups, so every role sees its own pages first. Global search, a left panel and tabs with a tree view tie them together.",
        fig("sl-new-sitemap.webp", "The new sitemap: main navigation with global search, left panel menu and tabs tree view, over seven sections from Dashboard to Configuration.", "The new sitemap", wide=True),
        fig("scandlearn-dashboard.webp","Scandlearn admin dashboard with enrolled users, trainings, reports and quick actions.","The admin dashboard",wide=True), id="navigation"),
    sec("Fewer steps, no starting over","I redrew the flows people used most. Picking curriculum content now happens in one list with filters, so cancelling no longer throws your picks away. Inviting a user straight into a group takes three fewer steps.",
        '<div class="pair">' + fig("sl-flow-curriculum.webp", "Old curriculum flow, where cancel sends you back to the start, next to the new flow with all content in one filtered list.", "Adding curriculum: old flow left, new flow right") + fig("sl-flow-invite.webp", "Old invite flow through a separate Groups page with a confirm step, next to the new flow with invite and group in one place.", "Inviting a user into a group: old left, new right") + '</div>', id="flows"),
    sec("The training list in three rounds","Admins spend most of their day in the training list, so I took it through three rounds. The first wireframe tested the layout. The second moved filters into a side panel and let a row open in place, showing its courses with links straight to each part of the training. The final version put navigation in one sidebar, moved search, columns and filters into the toolbar, and shows who is enrolled at a glance.",
        '<div class="pair">' + fig("sl-list-v1.webp", "First wireframe of the training list: a profile panel, a menu, column filters and a long table.", "Round 1: wireframe") + fig("sl-list-v2.webp", "Second wireframe: a filter panel on the left and one training row opened in place, listing its courses and links to details, curriculum, enrollment, schedule, certification, skills test and survey.", "Round 2: a row opens in place") + '</div>',
        fig("sl-list-final.webp", "Final Training Management screen: dark sidebar with sub-pages, a toolbar with search, columns and filters, and a table with type, enrolled people and status.", "Final: Training Management", wide=True), id="training-list"),
    sec("Search as the main way around","More menus don't fix findability. One search covers trainings, modules, users and materials, with type filters, a ⌘K shortcut and recent searches.",
        vid("sl-search","Finding a training with global search"),
        fig("sl-search.webp","Global search: filter chips for trainings, modules, users and materials, the ⌘K search bar, recent searches and a filtered list of trainings.","Global search",wide=True), id="search"),
    sec("What learners see","Learners need two things: what to do next and where they stand. Their list shows progress, expiry and one Resume button. Inside a training, the course outline stays on the side with each lesson's status, so nobody loses their place.",
        fig("sl-learner-list.webp", "Learner trainings list with tabs for yet to start, in progress and completed, a progress bar per training, expiry dates and a Resume button.", "A learner's trainings", wide=True),
        fig("sl-learner-player.webp", "Course player in dark mode: a self-study lesson with a download button, and the course outline on the right with each lesson's status.", "Inside a training: the outline stays visible", wide=True), id="learners"),
    sec("A tree view and one component library","An expandable tree shows where you are in a deep course. A shared library of type, colours, inputs and tables with row actions kept 400+ screens consistent, and made bigger tools like the certificate builder quick to put together.",
        fig("sl-design-system.webp", "Component library: Montserrat type scale, colour palettes, grid, date picker, dropdown, inputs, toggles, icons and buttons.", "The component library", wide=True),
        fig("sl-cert-builder.webp", "Certificate builder: drag rows, text boxes and images into a certificate, edit text in place, then save or use a template.", "Built from the library: the certificate builder", wide=True), id="components"),
    _old["Outcome"],
    _old["What I'd do differently"],
]
