# Fancircle v2: the same case study with the UX audit fixes applied. Unlisted (noindex), for comparison.
def three(*items, cls=""):
    return phones(*items, cls=("three " + cls).strip())

V2_HERO = ('<figure class="wide cover-phones" aria-label="Three Fancircle screens: an artist profile with a fan points bar, swiping right on a song, and a note pinned to a waveform.">'
  '<img src="../assets/fc2-fan-profile.webp" alt="" loading="eager">'
  '<img src="../assets/smf-like.webp" alt="" loading="eager">'
  '<img src="../assets/fc-crf-4.webp" alt="" loading="eager"></figure>')

V2_SUMMARY = ('<div class="tldr"><p class="tldr-h">The short version</p><ol>'
  '<li><a href="#songmatch"><b>Fans discover by swiping, not browsing.</b> SongMatch plays a 15-second hook. Swipe right to keep it, left for the next.</a></li>'
  '<li><a href="#artists"><b>Artists choose the 15 seconds fans hear.</b> One plan choice, with the listens it buys, instead of three targets.</a></li>'
  '<li><a href="#creative-room"><b>Feedback is pinned to the moment.</b> Notes sit on the waveform, not in a vague chat thread.</a></li>'
  '</ol></div>')

V2_CHAPTERS = ('<nav class="chapters" aria-label="Sections"><div>'
  + "".join(f'<a href="#{i}">{t}</a>' for i, t in [("problem","Problem"),("two-apps","Two apps"),("songmatch","SongMatch"),("artists","For artists"),("creative-room","Creative Room"),("outcome","Outcome")])
  + '</div></nav>')

PAGES["fancircle-v2"] = dict(
  cls="dark-stage scroll-story v2",
  head='<meta name="robots" content="noindex">',
  title="Fancircle", tag="How do new artists find their first true fans?",
  intro="A loyalty-based social app for music, with a fan app and an artist app. I helped shape the product from the idea stage and led design to v1.0.",
  facts=[("Role","Head of Design"),("My part","Co-shaped the product with the founder. Designed both apps end to end, plus the prototypes and pitch decks."),("Team","Founder, COO, PM, 2 to 5 developers, QA"),("Timeline","2023 to 2025, iOS and Android")],
  stats=[("50+","artists committed before launch"),("2","apps, one for fans and one for artists, on one system"),("700+","screens designed to v1.0")],
  hero=V2_HERO, summary=V2_SUMMARY, chapters=V2_CHAPTERS,
  body=[
    sec("The problem",bigstat("0.003€","what an artist earns per stream","Social media gives artists reach, but no real relationship with the fans who were there first. Most fans say they would support their artists directly if there were a good way to do it."), id="problem"),
    sec("Two apps, one product","Fans want to discover and feel close. Artists want to publish, reward and understand their community. One interface for both would have made each side worse, so I designed two role-based apps on one shared system. The same profile and the same rewards look different depending on who is holding the phone.",
        phones(("fc2-fan-profile.webp","An artist's profile as a member fan sees it: a points bar (7,248 of 10,000), their rank, and how many Fancoins to the next level.","Fan: the artist's profile"),
               ("fc2-artist-profile.webp","The same profile as the artist sees it: edit highlights, and Insights and Edit on every post.","Artist: the same profile"),
               ("fc2-fan-rewards.webp","The fan rewards store: backstage passes, meet and greets and video messages, each priced in loyalty points.","Fan: rewards, paid in points"),
               ("fc2-artist-reward.webp","Creating a reward: the artist picks from 17 reward types, from a wallpaper to a video call.","Artist: creating a reward"), cls="two"), id="two-apps"),
    sec("SongMatch: discovery like dating","Scrolling a catalogue is tiring. I borrowed a gesture everyone knows: swipe right to like a song, left to skip. Every like lands in a playlist the fan can keep.",
        "<p><b>First version: a Stop button.</b> Fans heard a clip and tapped Stop to react.</p>",
        three(("smv1-f0.webp","First version of the song player with a Join button, in greyscale.","Wireframe: the player"),
              ("smv1-f1.webp","First version of the SongMatch song card, with a Stop button, in greyscale.","Wireframe: tap Stop"),
              ("smv1-f2.webp","First version of the liked-songs playlist, in greyscale.","Wireframe: the playlist")),
        "<p><b>The final design: one swipe does both.</b> A swipe is the answer and the next song in one move.</p>",
        phones(("smf-explore.webp","The SongMatch card on the Explore page.","1. Found on Explore"),
               ("smf-song.webp","A song card with a 15-second clip playing, and skip and like buttons.","2. Hear a 15-second clip"),
               ("smf-like.webp","Swiping right on a song: a heart appears and the song goes to a playlist.","3. Swipe right to like"),
               ("smf-next.webp","The next song card, with the liked-songs counter at the top.","4. Straight to the next song"),
               ("smf-playlist.webp","The SongMatch Likes playlist with the liked songs.","5. Every like saved to a playlist")), cls="band", id="songmatch"),
    sec("For artists: pay to be heard, see if it worked","Fans swipe, but artists need a way into that stack. The artist side is a short setup: choose the clip fans will hear, pick a plan, review before paying.",
        "<p><b>First version: three targets to set.</b> Artists set cost, duration and views as three separate targets.</p>",
        three(("smv1-a1.webp","First version, step 1: choosing songs, in greyscale.","Wireframe: choose songs"),
              ("smv1-a3.webp","First version, step 3: a free plan, or cost, duration and views targets set with a slider, in greyscale.","Wireframe: three targets"),
              ("smv1-a4.webp","First version, step 4: overview with duration, cost and the songs before paying, in greyscale.","Wireframe: overview")),
        "<p><b>The final design: one choice, with what it buys.</b> The plan is just how long it runs, shown with the estimated listens.</p>",
        three(("sm-step2-clip.webp","Dragging a 15-second selection on each song's waveform.","Choose the 15 seconds"),
              ("sm-step3-paid.webp","A paid plan by duration, with a slider showing 15 days, about 2,400 listens, for 29.90 euros.","Pick how long it runs"),
              ("sm-step4-review.webp","Review of songs, clips, plan, cost and payment before launch.","Review and launch")),
        ul("<b>The artist picks the 15 seconds.</b> A fan decides in one hook, so the artist chooses which part plays, starting from a default clip.",
           "<b>Every price shows what it buys.</b> Plans show estimated listens next to the cost, and a free tier (100 views a month) lets new artists try it first.",
           "<b>Results in fans, not impressions.</b> Each promotion shows likes against skips and new followers, with a prompt to renew as it ends.", cls="decisions"),
        "<p><b>After launch: did it work?</b></p>",
        phones(("sm-active.webp","Promotions overview with progress bars, like and dislike ratios, and a renew prompt.","Likes against skips, per song"),
               ("sm-details.webp","Promotion details: plan, progress, total listens, likes and new followers.","New followers it brought"), cls="two"), id="artists"),
    sec("Creative Room: feedback pinned to the moment","\"The middle part feels off\" wastes everyone's time. In Creative Room, collaborators select part of the waveform and leave a note right there, and a timeline keeps every upload, comment and task in order.",
        "<p><b>First version: mapped before it was drawn.</b> Open a file, mark a moment or a section, write the note.</p>",
        three(("fc-crw-2.webp","Wireframe: the audio file with a draggable waveform and a Give Feedback button.","Wireframe: drag to the moment"),
              ("fc-crw-3.webp","Wireframe: selecting a section of the waveform, 0:31 to 0:57.","Wireframe: or select a section"),
              ("fc-crw-5.webp","Wireframe: the comment shown with its time range under the waveform.","Wireframe: the note keeps its time")),
        "<p><b>The final design: the note lives on the waveform.</b> Anyone opening the track sees exactly where each comment points.</p>",
        three(("fc-crf-2.webp","A section of the waveform selected, 00:15 to 00:32.","Drag over a section"),
              ("fc-crf-3.webp","Writing the note: Leaving feedback at 00:15 to 00:32.","Write the note"),
              ("fc-crf-4.webp","The comment appears as a bubble above its part of the waveform.","Pinned to the waveform")), cls="band", id="creative-room"),
    sec("Outcome",bigstat("50+","artists committed before launch","Won with the app prototypes and pitch decks I designed. v1.0 was designed and built for iOS and Android, and the brand got a registered EU trademark."),
        "The product did not take off. The company ran out of money before it found its users.", id="outcome"),
    sec("What I'd do differently","Our scope grew faster than the team could build, and the core loop was never tested on its own. Today I'd push for a tight MVP around that one loop, agree on a single success metric, and put it in front of real fans first. Saying no to features is part of the job."),
  ], next="career-navig8r")
