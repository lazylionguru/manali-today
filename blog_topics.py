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

    # ── MONTHLY VISIT GUIDES ──────────────────────────────────────────────────
    # Direct response to real Search Console queries: "is july a good time to
    # visit manali", "manali in july", "manali july weather forecast", and
    # the equivalent for other months. These intentionally avoid precise
    # temperature/rainfall numbers, weather data sources disagree with each
    # other significantly month to month, and your own manali.mdx guide
    # already warns that forecasts are often wrong in the mountains. Stick to
    # broad, honest seasonal patterns and your own lived sense of each month,
    # not numbers you can't stand behind. These are deliberately narrower and
    # more conversational than the future best-time-to-visit-manali guide,
    # which owns the comprehensive month-by-month reference table, these
    # answer the specific "is it good right now" question a searcher has.

    {
        "slug": "is-january-good-time-visit-manali",
        "title": "Is January a Good Time to Visit Manali?",
        "keyword": "manali in january",
        "type": "seasonal_event",
        "tags": ["january", "winter", "snow", "planning"],
        "seed_facts": [
            "January is deep winter, the coldest stretch of the year, snow on the ground in town is common and likely",
            "Roads further up like Rohtang are typically closed this time of year, check live Rohtang status before planning around it",
            "Good month for people who specifically want snow and a quiet, cold mountain town feel, not for people chasing outdoor activities like paragliding which mostly pause in winter",
            "Pack for genuine cold, layers, and be ready for road delays if snowfall is heavy",
        ],
    },
    {
        "slug": "is-february-good-time-visit-manali",
        "title": "Is February a Good Time to Visit Manali?",
        "keyword": "manali in february",
        "type": "seasonal_event",
        "tags": ["february", "winter", "snow", "planning"],
        "seed_facts": [
            "February is still firmly winter, often the snowiest stretch of the year in this valley",
            "Still a quiet month tourist-wise compared to summer, fewer crowds, colder weather",
            "Rohtang and higher passes are typically still closed, check live Rohtang status before planning around it",
            "Good for snow lovers and people who want town-level winter without attempting high-altitude passes",
        ],
    },
    {
        "slug": "is-march-good-time-visit-manali",
        "title": "Is March a Good Time to Visit Manali?",
        "keyword": "manali in march",
        "type": "seasonal_event",
        "tags": ["march", "spring", "planning"],
        "seed_facts": [
            "March is the transition out of winter, snow is melting at lower elevations but can still linger higher up",
            "Crowds start picking up from March onward as the spring season begins, noticeably calmer than peak summer though",
            "Higher passes like Rohtang typically remain closed or just starting to open this time of year, check live Rohtang status before relying on it",
            "A reasonable month if you want a mix of some snow and easing crowds without the full peak-season chaos",
        ],
    },
    {
        "slug": "is-april-good-time-visit-manali",
        "title": "Is April a Good Time to Visit Manali?",
        "keyword": "manali in april",
        "type": "seasonal_event",
        "tags": ["april", "spring", "planning"],
        "seed_facts": [
            "April is solidly spring, weather turning pleasant, greenery returning to the valley",
            "Crowds are building toward the summer peak but generally still more manageable than May or June",
            "Good window for people who want decent weather without the worst of the traffic",
            "Some higher-altitude spots may still have lingering snow or limited access depending on the year",
        ],
    },
    {
        "slug": "is-may-good-time-visit-manali",
        "title": "Is May a Good Time to Visit Manali?",
        "keyword": "manali in may",
        "type": "seasonal_event",
        "tags": ["may", "summer", "peakseason", "planning"],
        "seed_facts": [
            "May is right at the edge of peak season, weather is good but crowds are climbing fast as summer holidays approach",
            "This is roughly when the traffic and chaos problems described in the peak summer survival piece start to kick in",
            "Booking ahead matters more from May onward, accommodation fills up",
            "If you want to stay near Shanag or Burwa instead of Mall Road, this is the point in the year where that advice starts mattering most",
        ],
    },
    {
        "slug": "is-june-good-time-visit-manali",
        "title": "Is June a Good Time to Visit Manali?",
        "keyword": "manali in june",
        "type": "seasonal_event",
        "tags": ["june", "summer", "peakseason", "planning"],
        "seed_facts": [
            "June is full peak season, school summer holidays, the busiest stretch of the year for families",
            "This is exactly the window the peak-season traffic piece is written about, real congestion, real chaos if you don't plan around it",
            "Good weather, but the tradeoff is crowds and traffic, not the weather itself",
            "Late June can sometimes already show early monsoon signs depending on the year, worth checking closer to your travel dates",
        ],
    },
    {
        "slug": "is-july-good-time-visit-manali",
        "title": "Is July a Good Time to Visit Manali?",
        "keyword": "manali in july",
        "type": "seasonal_event",
        "tags": ["july", "monsoon", "planning", "weather"],
        "seed_facts": [
            "July sits right in the monsoon window, landslides happen on the Chandigarh-Manali highway most years during this stretch",
            "Still peak tourist season by calendar even though the monsoon makes it a genuinely riskier month to travel in",
            "Heavy rain and humidity are common, road delays and unpredictable closures are a real possibility, not a rare edge case",
            "If you must travel in July, build slack into your itinerary and check live road status before any day trip toward Atal Tunnel or Rohtang",
        ],
    },
    {
        "slug": "is-august-good-time-visit-manali",
        "title": "Is August a Good Time to Visit Manali?",
        "keyword": "manali in august",
        "type": "seasonal_event",
        "tags": ["august", "monsoon", "planning", "weather"],
        "seed_facts": [
            "August is still deep in the monsoon window, similar risk profile to July, landslides on the highway are a real recurring possibility",
            "Valley looks genuinely lush and green this time of year if you don't mind the rain risk",
            "Fewer foreign tourists this month, but still has the inherent monsoon road risk",
            "Same advice as July, build slack into plans and check live road status before committing to day trips",
        ],
    },
    {
        "slug": "is-september-good-time-visit-manali",
        "title": "Is September a Good Time to Visit Manali?",
        "keyword": "manali in september",
        "type": "seasonal_event",
        "tags": ["september", "autumn", "planning"],
        "seed_facts": [
            "September is right after the monsoon tapers off, this is usually when the valley starts getting genuinely clear again",
            "Noticeably fewer crowds than summer, while still having decent weather",
            "One of the better months overall if you want clarity and calm without winter cold",
            "Good timing for day trips since road risk from monsoon landslides drops off compared to July-August",
        ],
    },
    {
        "slug": "is-october-good-time-visit-manali",
        "title": "Is October a Good Time to Visit Manali?",
        "keyword": "manali in october",
        "type": "seasonal_event",
        "tags": ["october", "autumn", "planning"],
        "seed_facts": [
            "October is solidly post-monsoon, generally one of the clearer, calmer months in the valley",
            "Days start getting noticeably shorter and cooler as the month goes on",
            "Good window for clear mountain views without summer crowds or monsoon risk",
            "Worth packing for cooler evenings even if days feel mild",
        ],
    },
    {
        "slug": "is-november-good-time-visit-manali",
        "title": "Is November a Good Time to Visit Manali?",
        "keyword": "manali in november",
        "type": "seasonal_event",
        "tags": ["november", "autumn", "winter", "planning"],
        "seed_facts": [
            "November is the transition into winter, days get noticeably colder and shorter as the month progresses",
            "First snow of the season can sometimes show up by late November depending on the year, check live snow status closer to your dates",
            "Quiet month tourist-wise, calm before the winter snow crowd arrives",
            "Higher passes like Rohtang are typically closing or already closed by this point in the year",
        ],
    },
    {
        "slug": "is-december-good-time-visit-manali",
        "title": "Is December a Good Time to Visit Manali?",
        "keyword": "manali in december",
        "type": "seasonal_event",
        "tags": ["december", "winter", "snow", "planning"],
        "seed_facts": [
            "December is the start of real winter, snow becomes a realistic possibility in town as the month goes on",
            "Popular month for people specifically chasing snow and a New Year's mountain trip, expect a different kind of crowd than summer",
            "Higher passes are typically closed by this point, check live Rohtang status rather than assuming",
            "Good month if cold and snow are the goal, not the month for high-altitude day trips",
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
    ("The Hidden Trail to Baghi Meadow Through Bhanara and Nag Devta Temple", "https://manali.today/blog/bhanara-nag-devta-baghi-hidden-trail"),
    ("Burwa, Manali: The Quiet Side of the Valley Most Tourists Never Find", "https://manali.today/blog/burwa-village-manali-guide"),
    ("First Snowfall of the Season in Manali: What It Actually Means for Your Trip", "https://manali.today/blog/first-snowfall-manali-2026-2027-season"),
    ("Gondhla Fort: The 400-Year-Old Ruin Past Atal Tunnel Nobody Stops For", "https://manali.today/blog/gondhla-fort-atal-tunnel-detour"),
    ("Jagatsukh: The Forgotten Original Capital of Kullu, 6 km From Manali", "https://manali.today/blog/jagatsukh-village-history-manali"),
    ("Why I Tell People to Skip Manali in the Monsoon Window", "https://manali.today/blog/manali-monsoon-landslide-season-guide"),
    ("Why Manali Traffic Photos Online Are Missing the Point", "https://manali.today/blog/manali-peak-summer-traffic-survival-guide"),
    ("Naggar: Kullu's Second Capital, and the Russian Painter Who Never Left", "https://manali.today/blog/naggar-castle-history-manali"),
    ("Old Manali: Where I Actually Live, and How I'd Spend a Day There", "https://manali.today/blog/old-manali-guide-cafes-hikes"),
    ("The Three Meadows Trail From Rocky's Cafe in Old Manali", "https://manali.today/blog/rockys-cafe-meadows-trek-old-manali"),
    ("When Rohtang Pass Actually Opens Each Year, and Why the Date Moves", "https://manali.today/blog/rohtang-pass-opening-date-season"),
    ("Sethan: The Village Where the Pandavas Reportedly Hid, Now a Quiet Escape", "https://manali.today/blog/sethan-village-offbeat-manali"),
    ("Solang Valley Paragliding: When to Actually Go, and What I'd Skip", "https://manali.today/blog/solang-valley-paragliding-guide"),
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