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
        '<div class="pair">' + fig("sl-survey.webp", "Four survey charts: comfort with digital platforms, the most frustrating part of the system, apps used most, and the pros of those apps.", "Survey results") + fig("sl-roles.webp", "Each role, from Administrator to Learner, Author, Financial and Protocol Manager, with the pages it needs, marked by priority.", "Each role and the pages it needs, ranked by use") + '</div>',
        fig("sl-competitors.webp", "Competitor matrix comparing Scandlearn, CPaT, Aviation eLearning and Evionica on value proposition, advantages, disadvantages and design details.", "Competitor analysis", wide=True), id="research"),
    sec("Navigation by role","Admins, authors, instructors and learners need different things. Starting from that role map, I rebuilt the sitemap into seven main sections, each with a few groups, so every role sees its own pages first. Global search, a left panel and tabs with a tree view tie them together.",
        fig("sl-new-sitemap.webp", "The new sitemap: main navigation with global search, left panel menu and tabs tree view, over seven sections from Dashboard to Configuration.", "The new sitemap", wide=True),
        fig("scandlearn-dashboard.webp","Scandlearn admin dashboard with enrolled users, trainings, reports and quick actions.","The admin dashboard",wide=True), id="navigation"),
    sec("Fewer steps, no starting over","I redrew the flows people used most. Picking curriculum content now happens in one list with filters, so cancelling no longer throws your picks away. Inviting a user straight into a group takes three fewer steps.",
        '<div class="pair">' + fig("sl-flow-curriculum.webp", "Old curriculum flow, where cancel sends you back to the start, next to the new flow with all content in one filtered list.", "Adding curriculum: old flow left, new flow right") + fig("sl-flow-invite.webp", "Old invite flow through a separate Groups page with a confirm step, next to the new flow with invite and group in one place.", "Inviting a user into a group: old left, new right") + '</div>', id="flows"),
    _old["Search as the main way around"],
    _old["A tree view and one component library"],
    _old["Outcome"],
    _old["What I'd do differently"],
]
