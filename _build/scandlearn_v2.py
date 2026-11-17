# Scandlearn: the old LMS3 screens, from the 2020 onboarding handbook Genc received at the start of the project.
def oldwide(src, alt, cap):
    return (f'<figure class="wide old"><div class="old-shot"><img src="../assets/{src}"{full_attr(src)} alt="{html.escape(alt)}" loading="lazy">'
            '<p class="old-strip"><span>Before</span><span>Old version</span></p></div>'
            f'<figcaption>{cap}</figcaption></figure>')

_sl = PAGES["scandlearn"]["body"]
_i = next(i for i, b in enumerate(_sl) if "<h2>The problem</h2>" in b)
_sl[_i] = sec("The problem",
    bigstat("21", "steps to publish one training", "Support was stretched thin because users couldn't find features. The 2020 handbook sent to me on day one needed 21 numbered steps just to publish a training. In interviews and a survey (about 30 replies), people called it \"a frustrating maze\". Mapping the flows showed why: cancelling meant starting over, navigation was deep, and steps repeated."),
    "<p>Screens of the old platform, from that handbook.</p>",
    oldwide("sl-old-crew.webp", "The old Crew page: an icon rail, a second column of role and status filters, then the user list. Names and emails are blurred.", "Before: an icon rail, then a filter column, then the list. Three layers of menus before any content."),
    oldwide("sl-old-settings.webp", "The old Create Training settings: schedule, availability, expiry, expiry cycle, new session, notifications, certificate and survey.", "Before: the last of four tabs every new training went through, with expiry rules, certificate and survey on one form."),
    fig("sl-flow.webp","Flow analysis with problem points marked in red.","Flow analysis of the old platform",wide=True), id="problem")
