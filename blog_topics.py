"""
blog_topics.py — manali.today content strategy config
Edit this file to add new topics, internal links, and approved external domains.
blog.py imports everything from here — never needs to be touched for content updates.

Adapted from the RemoteStack pipeline, with one key structural difference:
each topic carries `seed_facts`, a short list of real, specific things
Narender actually knows about that subject. blog.py weaves these into the
prompt so deepseek writes from real material instead of inventing personal
texture or local color it has no way of actually knowing. Never add a topic
without at least 2-3 seed_facts, an ungrounded topic produces content that
either repeats the same few personal details mechanically across posts, or
fabricates new ones, both are bad for a site whose entire premise is
first-person, lived authority.

Guides (content/guides/*.mdx) are NOT generated through this pipeline.
They're deeper, hand-written, and need real editorial judgment per piece.
This file and blog.py are for blog volume only.
"""

# ── Topic definitions ─────────────────────────────────────────────────────────
# type values currently in use: "village", "seasonal_event", "trek"
# Add new types only if a genuinely new content pattern emerges, each new
# type needs its own structural branch in blog.py's build_prompt().

TOPICS = [

    # ── VILLAGES / NEIGHBOURHOODS ──────────────────────────────────────────────

    {
        "slug": "shanag-village-manali-guide",
        "title": "Shanag Village, Manali: Why I'd Stay Here Over Mall Road",
        "keyword": "shanag village manali",
        "type": "village",
        "tags": ["shanag", "whereToStay", "offbeat", "familytravel"],
        "seed_facts": [
            "Shanag sits on the slopes above the valley, quiet, but still close enough to drive into town for a meal or shopping without living in the congestion",
            "I recommend it specifically to families over Mall Road, Nasogi, or Siyal because those areas put you in the thick of peak season traffic the entire trip",
            "Best paired with checking for a nearby meadow or short easy hike before booking a stay",
        ],
    },
    {
        "slug": "burwa-village-manali-guide",
        "title": "Burwa, Manali: The Quiet Side of the Valley Most Tourists Never Find",
        "keyword": "burwa village manali",
        "type": "village",
        "tags": ["burwa", "whereToStay", "offbeat", "familytravel"],
        "seed_facts": [
            "Burwa sits across the valley, quiet, with the same easy access into town as Shanag without the Mall Road crowd",
            "Good base for a calmer family trip, picnic toward the nearest meadow rather than chasing a checklist itinerary",
        ],
    },
    {
        "slug": "jagatsukh-village-history-manali",
        "title": "Jagatsukh: The Forgotten Original Capital of Kullu, 6 km From Manali",
        "keyword": "jagatsukh village manali",
        "type": "village",
        "tags": ["jagatsukh", "history", "offbeat", "kulluvalley"],
        "seed_facts": [
            "Jagatsukh was the original capital of the Kullu kingdom under its old name Nast, where the earliest Rajas ruled for about twelve generations before the capital moved to Naggar",
            "A few old temples still stand here including a Shiva temple in the Shikhara style with genuinely fine stone carving",
            "Most tourists drive straight past it on the way to bigger sights, which is a mistake",
            "Staying here puts you close to the Hamta trail and Jobra without the Manali town crowd",
            "The trail up from Jagatsukh toward Bhanara village leads to the Nag Devta temple and onward to a meadow called Baghi, surrounded by forest, genuinely one of the best hidden spots in the valley",
            "Don't wander the Bhanara/Baghi area after sunset, there are bears around",
        ],
    },
    {
        "slug": "naggar-castle-history-manali",
        "title": "Naggar: Kullu's Second Capital, and the Russian Painter Who Never Left",
        "keyword": "naggar castle manali",
        "type": "village",
        "tags": ["naggar", "history", "offbeat", "roerich"],
        "seed_facts": [
            "Naggar was the Kullu kingdom's capital after Jagatsukh, for close to two centuries, before the capital moved again to present-day Kullu town",
            "Naggar Castle still stands from that period, built in the Kathkuni style using interlocking deodar wood beams and stone with no mortar, which is part of why it survived the major 1905 earthquake that flattened most other buildings in the valley",
            "Russian painter Nicholas Roerich settled in Naggar in the early twentieth century, his old home is now a small gallery",
            "A genuinely peaceful base if you want distance from Manali's chaos without giving up culture and history",
        ],
    },
    {
        "slug": "old-manali-guide-cafes-hikes",
        "title": "Old Manali: Where I Actually Live, and How I'd Spend a Day There",
        "keyword": "old manali guide",
        "type": "village",
        "tags": ["oldmanali", "cafes", "hikes", "wheretostay"],
        "seed_facts": [
            "I live in Old Manali, busier than Shanag or Burwa but calmer than Mall Road, with its own cafe culture and river walk",
            "Krishna Dhaba is a small family-run local cafe with honest prices and a genuinely lovely owner, where a lot of the long-term Old Manali community hangs out daily, I do some of my own work on manali.today from there",
            "Three real day hikes from here: the Kharma Valley trail from the alley near the temple parking by Rama Dhaba, heading down to the river and water station then up to Suicide Point, a striking large cracked rock despite the name",
            "From Rocky's Cafe a trail heads up through three meadows, one after another, each higher and quieter than the last",
            "The right-hand trail instead of left from Rocky's leads toward Goshal village with good stopping points along the way",
        ],
    },
    {
        "slug": "sethan-village-offbeat-manali",
        "title": "Sethan: The Village Where the Pandavas Reportedly Hid, Now a Quiet Escape",
        "keyword": "sethan village manali",
        "type": "village",
        "tags": ["sethan", "offbeat", "hiddengems", "meadows"],
        "seed_facts": [
            "Sethan is the village to look at if you want to get away from Manali's chaos entirely",
            "The road up is steep and not particularly well maintained, not for every vehicle",
            "Views and meadows here are genuinely worth the rough drive",
            "Local lore holds that the Pandavas spent part of their exile, their agyatvas, in this village",
        ],
    },

    # ── SEASONAL EVENTS ────────────────────────────────────────────────────────

    {
        "slug": "manali-peak-summer-traffic-survival-guide",
        "title": "Why Manali Traffic Photos Online Are Missing the Point",
        "keyword": "manali traffic summer",
        "type": "seasonal_event",
        "tags": ["peakseason", "traffic", "familytravel", "summer"],
        "seed_facts": [
            "Every year families spend a serious amount of money to come here, only to get stuck in traffic and chaos for most of the trip, which genuinely makes me sad given what that money represents, a year of saving, a year managing work stress around two weeks off",
            "Summer is often the only window families get, kids have school holidays then, grandparents can't handle a winter visit's cold",
            "People online telling families not to visit during peak season because of traffic photos ignore that not everyone has the privilege of visiting whenever they want",
            "The real fix isn't avoiding Manali, it's avoiding tour agencies, staying somewhere quieter like Shanag or Burwa instead of Mall Road or Nasogi, and picking two or three things to do well instead of a fixed checklist itinerary",
        ],
    },
    {
        "slug": "manali-monsoon-landslide-season-guide",
        "title": "Why I Tell People to Skip Manali in the Monsoon Window",
        "keyword": "manali monsoon season",
        "type": "seasonal_event",
        "tags": ["monsoon", "weather", "roadclosures", "planning"],
        "seed_facts": [
            "July to August is the window I'd avoid if at all possible",
            "Landslides happen on the Chandigarh-Manali highway most years during this window, this is a real, recurring risk, not a rare event",
            "The new highway stretch after Bilaspur is smooth and modern with a long sequence of tunnels and bridges, but the patch between Pandoh and the Aut tunnel, particularly around the Pandoh-Takoli tunnel and Pandoh bypass project, is still under construction and causes slower going regardless of season",
        ],
    },
    {
        "slug": "first-snowfall-manali-2026-2027-season",
        "title": "First Snowfall of the Season in Manali: What It Actually Means for Your Trip",
        "keyword": "manali first snowfall",
        "type": "seasonal_event",
        "tags": ["snow", "winter", "livestatus", "seasonopening"],
        "seed_facts": [
            "I run manali.today's live snow checker myself, verified through direct on-the-ground access, not an automated weather feed",
            "December to February is for snow but road access can get unpredictable, some roads close with snowfall",
            "Manali sits at about 2050m, the first real snowfall of the season typically changes road and pass conditions fast",
        ],
    },
    {
        "slug": "rohtang-pass-opening-date-season",
        "title": "When Rohtang Pass Actually Opens Each Year, and Why the Date Moves",
        "keyword": "rohtang pass opening date",
        "type": "seasonal_event",
        "tags": ["rohtang", "permits", "seasonopening", "snow"],
        "seed_facts": [
            "Rohtang Pass sits at around 3,980m, well above Manali's own 2050m",
            "I run the live Rohtang status checker on manali.today myself",
            "Opening date depends on how fast BRO clears the final snowbound stretch each spring, it shifts year to year",
        ],
    },

    # ── TREKS / ACTIVITIES ────────────────────────────────────────────────────

    {
        "slug": "kharma-valley-suicide-point-hike-old-manali",
        "title": "The Kharma Valley Hike to Suicide Point: A Real Trail Guide From Old Manali",
        "keyword": "suicide point manali hike",
        "type": "trek",
        "tags": ["hiking", "oldmanali", "daytrip", "kharmavalley"],
        "seed_facts": [
            "Starts from the alley near the temple parking by Rama Dhaba in Old Manali",
            "Turns into a trail heading down toward the river and a small water station, a good spot to sit and cool off",
            "Keep going up instead and you reach Suicide Point, a name that undersells the place, it's a striking large cracked rock hanging off the hillside",
        ],
    },
    {
        "slug": "rockys-cafe-meadows-trek-old-manali",
        "title": "The Three Meadows Trail From Rocky's Cafe in Old Manali",
        "keyword": "old manali meadows trek",
        "type": "trek",
        "tags": ["hiking", "oldmanali", "meadows", "daytrip"],
        "seed_facts": [
            "From Rocky's Cafe a trail heads up through three meadows, one after another, each a little higher and quieter than the last",
            "The right-hand trail instead of left from Rocky's leads toward Goshal village instead, with good stopping points along the way",
        ],
    },
    {
        "slug": "bhanara-nag-devta-baghi-hidden-trail",
        "title": "The Hidden Trail to Baghi Meadow Through Bhanara and Nag Devta Temple",
        "keyword": "bhanara village trek manali",
        "type": "trek",
        "tags": ["hiking", "jagatsukh", "hiddengems", "meadows"],
        "seed_facts": [
            "Trail goes up from Jagatsukh toward Bhanara village",
            "From Bhanara you walk to Nag Devta temple, one of the best hidden spots in the valley",
            "Past the temple a little further is a small meadow called Baghi, surrounded by forest on all sides, hard to describe how good it is, you have to see it",
            "Important: don't wander this area after sunset, there are bears around",
        ],
    },
    {
        "slug": "solang-valley-paragliding-guide",
        "title": "Solang Valley Paragliding: When to Actually Go, and What I'd Skip",
        "keyword": "solang valley paragliding",
        "type": "trek",
        "tags": ["solangvalley", "paragliding", "adventure", "daytrip"],
        "seed_facts": [
            "Solang Valley sits at around 2,560m, about 13 to 14 km from Manali, main paragliding launch around 2,400 to 2,600m depending on the operator",
            "Go early, ideally before 9am, to beat the crowd and catch better wind conditions",
            "In winter it switches over to a small skiing setup instead",
            "Worth half a day if adventure activities matter to your group, skippable if they don't",
        ],
    },
    {
        "slug": "gondhla-fort-atal-tunnel-detour",
        "title": "Gondhla Fort: The 400-Year-Old Ruin Past Atal Tunnel Nobody Stops For",
        "keyword": "gondhla fort manali",
        "type": "trek",
        "tags": ["atalTunnel", "history", "hiddengems", "lahaul"],
        "seed_facts": [
            "Most people cross Atal Tunnel, reach Sissu, take a U-turn, and head straight back",
            "Push on a little further to Gondhla village instead and see the roughly 400-year-old fort there, ruined and abandoned but worth the short detour and worth reading about beforehand",
            "Atal Tunnel itself in peak season can cost 10 to 12 hours round trip from Manali to Sissu and back in traffic, so this detour is really only worth it if you have real flexibility in your schedule",
        ],
    },

]


# ── Site page internal links ──────────────────────────────────────────────────
# Sampled per post in blog.py. Add new pages here as they go live.

INTERNAL_LINKS = [
    ("check live snow status", "https://manali.today/"),
    ("check live Atal Tunnel status", "https://manali.today/is-atal-tunnel-open-today"),
    ("check live Rohtang Pass status", "https://manali.today/is-rohtang-pass-open-today"),
    ("browse the Manali travel guide", "https://manali.today/guide"),
    ("the complete Manali travel guide", "https://manali.today/guide/manali"),
]


# ── Published blog post links ─────────────────────────────────────────────────
# Sampled per post in blog.py. Add new posts here as they go live, so future
# posts can link back to them. Keep this list in sync with what's actually
# published in content/blog/ — blog.py does not auto-discover these.

BLOG_INTERNAL_LINKS = [
    # Populate as posts go live, e.g.:
    # ("Shanag Village, Manali: Why I Send Families Here Instead of Mall Road", "https://manali.today/blog/shanag-village-manali-guide"),
]


# ── Approved external domains ─────────────────────────────────────────────────
# Pass 2 of generation (external link injection) is restricted to these
# domains only. No travel-blog, listicle, or competitor sites, ever.
# Wikipedia/government/research/weather sources only.

APPROVED_EXTERNAL_DOMAINS = [
    "en.wikipedia.org",
    "hi.wikipedia.org",
    "hp.gov.in",
    "himachaltourism.gov.in",
    "rohtangpermits.hp.gov.in",
    "imd.gov.in",
    "mausam.imd.gov.in",
    "incois.gov.in",
    "nih.ernet.in",
    "ngt.gov.in",
    "censusindia.gov.in",
    "britannica.com",
]