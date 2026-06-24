#!/usr/bin/env python3
"""
manali.today Blog Auto-Publisher v1
- Content strategy (topics + links) lives in blog_topics.py
- This file handles generation logic only — never edit for content updates

Adapted from the RemoteStack blog pipeline (same two-pass generation,
same human-in-the-loop topic picker, same MDX assembly pattern), with one
deliberate difference: every topic in blog_topics.py carries seed_facts,
real things Narender actually knows about that subject. The prompt builder
below weaves those facts in explicitly, so deepseek writes from real
material in Narender's voice rather than inventing personal texture about
a place it has never been. Never generate a topic with empty seed_facts.
"""

import os
import re
import random
import time
import math
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from openai import OpenAI

from dotenv import load_dotenv
load_dotenv()

from blog_topics import TOPICS, INTERNAL_LINKS, BLOG_INTERNAL_LINKS, APPROVED_EXTERNAL_DOMAINS, ATAL_TUNNEL_INTERNAL_LINK, ATAL_TUNNEL_CLUSTER_SLUGS

# ── Config ────────────────────────────────────────────────────────────────────
DEEPSEEK_API_KEY = os.environ["DEEPSEEK_KEY"]
POSTS_PER_RUN    = int(os.environ.get("POSTS_PER_RUN", "14"))
CANDIDATE_COUNT  = int(os.environ.get("CANDIDATE_COUNT", "24"))
AUTO_MODE        = os.environ.get("AUTO_MODE", "false").lower() == "true"
SKIP_COVERS      = os.environ.get("SKIP_COVERS", "false").lower() == "true"

CONTENT_DIR = Path(__file__).parent / "content" / "blog"
CONTENT_DIR.mkdir(parents=True, exist_ok=True)
COVER_SCRIPT = Path(__file__).parent / "generate-cover.js"
PUBLIC_BLOG_IMAGES_DIR = Path(__file__).parent / "public" / "blog-images"

client = OpenAI(api_key=DEEPSEEK_API_KEY, base_url="https://api.deepseek.com")

WRITING_RULES = """
WRITING RULES (follow every one, no exceptions):
- No em dashes (— or --). Use a comma, period, or rewrite the sentence.
- No "it's not X, it's Y" framing. Just say what it is.
- No "in today's world", "in this day and age", "the reality is", "the truth is"
- No "delve", "navigate", "foster", "leverage", "streamline", "game-changer", "unlock", "empower"
- No rhetorical questions used as section openers ("So what makes this place special?")
- No overly hedged language ("it's worth noting that", "it's important to remember")
- No filler transition sentences ("Now that we've covered X, let's look at Y")
- Short sentences. Vary length. Sound like a person, not a content machine.
- Be direct. If something is overrated, say so. If something is genuinely good, say why specifically.
- No hype. No "breathtaking", "must-visit", "hidden gem" used as filler (use it only if it's actually true and specific)
- No em dash substitutes like " - " used mid-sentence either. Rewrite instead.
- Never invent a personal anecdote, a specific date, a specific price, or a named local contact that
  isn't given to you in the SEED FACTS below. If you need a detail that isn't in the seed facts,
  write around it in general terms instead of making something up.
"""

VOICE_PROFILE = """
VOICE: First person, Narender, an Old Manali resident since 2018 who runs manali.today,
a live status site for Manali snow, Atal Tunnel, and Rohtang Pass conditions. He is the
sole authority on those live statuses, verified through direct on-the-ground access and
local source contacts, not an automated feed.

This background is for your context, not a line to restate every time. Across many posts on
this site, "I've lived in Old Manali since 2018" or "I run manali.today" has already been used
as an opening line far too often, it now reads as a stock intro repeated post after post. For
this post: do NOT open with that biographical line. If the fact that he lives here is genuinely
relevant to this specific topic, work it in once, briefly, later in the piece, or skip it
entirely if the post doesn't need it. Most posts should NOT mention "since 2018" or "I run
manali.today" at all. Vary how (or whether) personal context appears, the same few biographical
facts should not become a verbal tic across the site.

This is NOT a generic travel-blogger voice. It is one specific person who actually lives
here, writing to a friend who said "we're coming to Manali, help." Direct, a little
contrarian about bad tourist advice, warm toward the place and its people, never
salesy, never listicle-bait. Use "I" naturally. Reference manali.today's live checkers
only where it's genuinely relevant (don't force it into every post).
"""


# ── Helpers ───────────────────────────────────────────────────────────────────

def get_already_published_slugs():
    return {f.stem for f in CONTENT_DIR.glob("*.mdx")}


def estimate_read_time(content):
    return max(1, math.ceil(len(content.split()) / 200))


def strip_preamble(text):
    lines = text.split("\n")
    for i, line in enumerate(lines):
        if line.strip().startswith("#"):
            return "\n".join(lines[i:])
    return text


# ── Prompt builder ────────────────────────────────────────────────────────────

def build_prompt(topic):
    t = topic["type"]
    seed_facts = topic.get("seed_facts", [])
    if not seed_facts:
        raise ValueError(f"Topic '{topic['slug']}' has no seed_facts. Add at least 2-3 before generating.")

    if topic["slug"] in ATAL_TUNNEL_CLUSTER_SLUGS:
        # This entire cluster exists to reinforce the Atal Tunnel checker's
        # ranking for "is atal tunnel open today" and related queries, so
        # the link back to it is forced in every post, never left to random
        # sampling which could otherwise skip it on a given run.
        remaining_pool = [link for link in INTERNAL_LINKS if link != ATAL_TUNNEL_INTERNAL_LINK]
        internal = [ATAL_TUNNEL_INTERNAL_LINK] + random.sample(remaining_pool, min(2, len(remaining_pool)))
    else:
        internal = random.sample(INTERNAL_LINKS, min(4, len(INTERNAL_LINKS)))
    blog_links = random.sample(BLOG_INTERNAL_LINKS, min(3, len(BLOG_INTERNAL_LINKS))) if BLOG_INTERNAL_LINKS else []
    internal_str = "\n".join([f"- [{text}]({url})" for text, url in internal])
    blog_str = "\n".join([f"- [{text}]({url})" for text, url in blog_links]) if blog_links else "(none published yet, skip this section)"
    facts_str = "\n".join([f"- {f}" for f in seed_facts])

    base = f"""You are writing a blog post for manali.today as Narender, in his own voice.

{VOICE_PROFILE}

{WRITING_RULES}

SEED FACTS (the only specific, real details you're allowed to state as fact about this topic,
everything specific in the post must trace back to one of these):
{facts_str}

FORMAT RULES:
- Write in Markdown
- H1 at top (use the exact post title provided)
- Use H2 and H3 subheadings throughout
- Post length: 900-1300 words
- Do NOT include frontmatter, just markdown starting with # Title
- Do NOT add any preamble or commentary before the # Title line, start immediately with # Title

INTERNAL LINKS (use every single one, each exactly once, woven naturally into the text):
Site pages:
{internal_str}

Related blog posts:
{blog_str}

Each internal link must appear exactly once. Do not repeat any URL. Do not invent any
other manali.today URL that isn't listed above.

POST TITLE: {topic['title']}
TARGET KEYWORD: {topic.get('keyword', '')}
"""

    if t == "atal_tunnel_feature":
        slug = topic["slug"]

        if slug == "my-father-bro-atal-tunnel-personal":
            return base + """Write this as a personal essay in Narender's voice, opening from his
own family connection to BRO. Structure:

## Why This One Is Personal
Open with the fact that his father served with BRO, the organisation that built Atal Tunnel.
Keep this general, no invented specifics about rank, years, or postings, just the honest fact
of the connection and what it means to him watching tourists drive through something his
father's organisation builds roads and infrastructure like every day.

## What BRO Actually Does
Ground this in the seed facts about BRO's scope and mandate, most people who drive through the
tunnel have no idea what organisation built it or what else that organisation does.

## What a Project Like This Actually Costs
Use the seed facts about construction method, the south-portal-only excavation years, and the
2003 cloudburst that killed 42 labourers. Handle the deaths with real weight and respect, not as
a dramatic hook, this is a genuine human cost behind something people now drive through in
fifteen minutes without a thought.

## What I Think About When I Drive Through It
A closing, reflective paragraph in Narender's voice tying his personal connection back to the
checker page he runs, check live Atal Tunnel status, since he's spent years watching this exact
road's conditions.

End with a short, honest closing paragraph, not a generic CTA.
"""

        if slug == "lahaul-before-atal-tunnel-six-months-cut-off":
            return base + """Write this as a human-interest history piece on what Lahaul valley was
actually like before the tunnel existed. Structure:

## Six to Eight Months, Cut Off
Ground this in the seed facts about the winter isolation, what it actually meant logistically
for people living there.

## What People Actually Did
Use the seed facts about stocking rations, the helicopter medical evacuations, and the real,
weighty detail of villagers carrying the sick across Rohtang Pass on their backs. Handle this
with real respect, these are real people's hardships, not adventure-travel color.

## It Isn't Entirely in the Past
Use the seed fact about Koksar and nearby villages still experiencing seasonal migration even
now, the tunnel changed most of the valley's life but not all of it evenly.

## Why This Matters When You Drive Through Today
Closing reflection tying this history to what visitors see today, check live Atal Tunnel status
naturally if it fits, don't force it.

End with a short, honest closing paragraph, not a generic CTA.
"""

        if slug == "atal-tunnel-national-security-significance":
            return base + """Write this as a factual, sourced explainer on why Atal Tunnel matters
beyond tourism. Structure:

## More Than a Tourist Attraction
Ground this in the seed facts about NH3, the Leh-Manali highway, and the tunnel's role in
year-round connectivity to strategically important border areas.

## What Changed
Use the seed facts about distance/time savings and what the corridor was like before the tunnel,
unusable for half the year for everyone including the armed forces.

## Staying Honest About What I Can and Can't Say
Explicitly state, in Narender's voice, that he is not a defence analyst and won't speculate on
troop movements, capability assessments, or anything beyond what's publicly known and widely
reported. This is a factual significance piece, not military analysis.

## Why I Still Check on This Every Day
Closing paragraph connecting the tunnel's broader significance to the practical reality that its
status still needs checking daily, check live Atal Tunnel status, weather and conditions don't
care about strategic importance.

End with a short, honest closing paragraph, not a generic CTA.
"""

        if slug == "atal-tunnel-visitor-access-guide":
            return base + """Write this as a practical visitor guide. Structure:

## What You Actually Need to Know Before You Go
Ground this in the seed facts: no permit needed (unlike Rohtang), 24/7 access in normal
conditions, drive time, and that closures do happen, so check live Atal Tunnel status before
planning around it rather than assuming.

## Inside the Tunnel
What it's actually like, no stops allowed, what's available near both portals from the seed
facts.

## The Contrast That Makes It Worth Doing
Use the seed fact about the dramatic difference between the green Manali side and stark Lahaul
side, this is genuinely part of the appeal.

## Practical Notes
Fuel, timing, anything else from the seed facts. Skip anything not supported by a seed fact.

End with a short closing paragraph in Narender's voice, not a generic CTA.
"""

        if slug == "atal-tunnel-changed-lahaul-locals-life":
            return base + """Write this as a piece specifically about local impact, not tourist
impact. Structure:

## A Different Kind of Before and After
Frame this explicitly as being about the people who live in Lahaul year-round, not visitors.

## What Actually Changed
Ground this in the seed facts: migration largely stopping, better doctor access, shorter
rationing windows, year-round market access for farmers.

## What Didn't Fully Change
Use the seed fact about buses still pausing in heavy snowfall, be honest this is a real but
partial improvement, not a complete fix, don't oversell it.

## Why This Is the Real Story
Closing reflection on why this local-impact angle matters more than the tourism angle, tie back
to checking live Atal Tunnel status as relevant since conditions still affect locals daily too.

End with a short, honest closing paragraph, not a generic CTA.
"""

        if slug == "atal-tunnel-engineering-how-it-was-built":
            return base + """Write this as an engineering/construction deep-dive. Structure:

## An Idea That Took 150 Years
Ground this in the seed fact about the 1860 Moravian Mission proposal and 1942 GSI proposal,
long before construction actually started in 2010.

## Ten Years to Build 9 Kilometers
Use the seed facts about construction method (drill and blast, NATM, not TBM) and why.

## The Seri Nala Fault Zone
This is the single most striking technical detail, use the seed fact about 587 metres taking
over four years, give it real weight, this is what made the project genuinely hard.

## What Else They Were Up Against
Use the remaining seed facts: avalanche sites, excavated material disposal, water seepage.

## What's Actually Inside the Tunnel
Ventilation, lighting, safety systems from the seed facts.

## A Real Engineering Distinction
Close with the world's-longest-above-10,000-feet fact, framed honestly as a real distinction,
not hype, and a closing line connecting back to checking live Atal Tunnel status since even
something this engineered can still close for weather.

End with a short closing paragraph in Narender's voice, not a generic CTA.
"""

        return base + "Write a grounded, specific, first-person post on this Atal Tunnel angle using only the seed facts provided.\n"

    if t == "village":
        return base + """Write this as a guide to a specific village or neighbourhood. Structure:

## What [Place] Actually Is
Ground this in the seed facts. What it's like, who it suits, why it's worth knowing about.

## Why I'd Send You Here (or Not)
Honest take. Who should stay/visit here versus who shouldn't bother. Compare briefly to the
more crowded alternatives (Mall Road, Nasogi, Siyal) without over-explaining, a brief mention
is enough since that comparison lives on the main guide.

## What to Actually Do There
Only use specifics from the seed facts. If seed facts mention a trail, temple, or landmark,
describe it properly. Don't pad with generic "explore the local market" filler.

## Practical Notes
Anything practical from the seed facts (access, safety notes like wildlife warnings, distance
from Manali, road conditions). Skip this section if no seed fact supports it.

End with a short closing paragraph, not a generic CTA, just a real closing thought in Narender's voice.
"""

    if t == "seasonal_event":
        if topic["slug"].startswith("is-") and "good-time-visit-manali" in topic["slug"]:
            month_name = topic["title"].split("Is ")[1].split(" a Good Time")[0]
            return base + f"""Write this as a direct answer to the question "{topic['title']}", the kind
of post that should satisfy someone who typed that exact question into Google. Structure:

## The Short Answer
Open with a direct, honest yes/no/it-depends answer for {month_name}, in one or two sentences,
based strictly on the seed facts. Don't bury the answer, lead with it.

## What {month_name} Is Actually Like
Ground this in the seed facts, weather pattern, crowd level, road conditions for this specific
month. Avoid stating precise temperature or rainfall numbers you weren't given, describe the
pattern honestly instead (e.g. "cold and likely snowy" rather than inventing a specific degree
figure).

## What to Plan Around
Practical implications specific to {month_name}, road risk, what to pack, what to book ahead,
whatever the seed facts actually support. Tie in a live status checker link naturally if a seed
fact mentions checking road/pass status, don't force it otherwise.

## Who Should (and Shouldn't) Come in {month_name}
Honest, specific. What kind of traveler this month suits, and who would have a better trip in a
different month instead.

End with a short, honest closing paragraph in Narender's voice, not a generic CTA.
"""

        return base + """Write this as a seasonal explainer post, the kind of thing that ranks for
"is X happening now" or "when does X happen" searches. Structure:

## What's Actually Happening
Ground this entirely in the seed facts, what this season/event actually is and why it matters
for someone planning a trip.

## What This Means for Your Trip
Practical implications, what changes for visitors during this window. Be honest about downsides
(traffic, road risk, unpredictability) as well as upsides.

## What I'd Actually Tell You to Do
Narender's direct take, what he'd recommend given this seasonal reality. Tie into one of the
internal links naturally if it fits (e.g. the live status checkers) but don't force it.

## When to Check Back
Light mention that conditions change and the live checkers on manali.today are the way to verify
current status, only if this fits naturally, don't force a sales pitch.

End with a short, honest closing paragraph in Narender's voice.
"""

    if t == "culture":
        if topic["slug"] == "my-father-bro-atal-tunnel-personal":
            return base + """Write this as a piece with a personal thread running through it, in
Narender's voice, but the headline and opening should lead with what the post is actually about:
what a road like this really costs to build, not with the personal detail itself. Structure:

## What People Don't See When They Drive Through in Fifteen Minutes
Open with the real subject of the post: most people cross this tunnel in fifteen minutes without
a thought for what it took to build. This is the actual hook, not the personal connection.

## A Personal Note
A few sentences in, or in this section, naturally mention the personal connection (his father's
BRO service, kept general per his wishes, no specific years, postings, or projects, just the fact
of the service itself). State it once, plainly, without over-explaining why it's kept vague, and
move on. This should read as natural context, not the headline event of the post.

## What BRO Actually Does
Ground this in the seed facts, what BRO is, its mandate, the kind of work it does beyond this one
tunnel.

## What a Project Like This Actually Costs
Use the seed facts on construction method, the 2003 cloudburst deaths, the years of work from one
portal only. Be matter-of-fact and respectful, not dramatic or exploitative of the tragedy, state
it plainly and let it carry its own weight. This section is also the natural place to use the live
Atal Tunnel status checker link from the internal links list, since the contrast between a fifteen
minute drive today and what it took to build works well alongside a mention of checking conditions
before you go.

## Why This Stays With Me
Close on a brief, personal, reflective note tying back to the opening. Not sentimental padding,
a genuine closing thought, understated rather than heavy-handed.

This post should read more personal and slower than Narender's other posts, but the personal
detail is texture inside the piece, not the headline, and never invent emotional detail or a
specific anecdote beyond the seed facts. Every internal link listed above, including the Atal
Tunnel checker link, must still appear exactly once somewhere in this post.
"""
        if topic["slug"] == "lahaul-before-atal-tunnel-six-months-cut-off":
            return base + """Write this as a vivid, grounded historical piece on what life in
Lahaul was actually like before the tunnel existed. Structure:

## Six Months, Cut Off
Open with the core fact: Rohtang closing for winter meant total isolation for roughly six to
eight months. Ground this immediately in the seed facts.

## What That Actually Meant, Day to Day
Use the seed facts on rationing, the migration pattern, what happened during medical emergencies
including the detail about carrying people across the pass before helicopters were reliable. Be
specific and human, not abstract.

## What Still Happens Today, Even With the Tunnel
Use the seed fact about villages near Koksar still experiencing seasonal migration due to heavy
snowfall, this keeps the piece honest rather than implying everything is solved.

## Why This Context Matters
A short closing thought tying this history to why the tunnel is genuinely significant, not just
as an engineering story but as a human one.

End with a short closing paragraph in Narender's voice, not a generic CTA.
"""
        if topic["slug"] == "atal-tunnel-changed-lahaul-locals-life":
            return base + """Write this as a grounded, human-focused piece on what changed for
people who actually live in Lahaul, not tourists. Structure:

## What Changed, Concretely
Use the seed facts: migration patterns, healthcare access, ration stockpiling, market access.
Be specific and grounded, not abstract ("life improved") but concrete ("doctors are now more
willing to be posted here").

## What Hasn't Fully Changed
Honest about the limits, e.g. bus services still pausing in heavy snowfall even with the tunnel
open. Don't oversell this as a complete fix.

## Why This Is the Real Story
Narender's direct take: this is a bigger deal for the people who live here than for the tourists
who drive through it once. Tie in a checker link naturally if it fits.

End with a short, honest closing paragraph in Narender's voice.
"""
        return base + """Write a grounded, specific, first-person post on this cultural/historical
topic using only the seed facts provided. Be honest and matter-of-fact, not sentimental.
"""

    if t == "practical":
        if topic["slug"] == "atal-tunnel-national-security-significance":
            return base + """Write this as a factual, sourced explainer on why Atal Tunnel matters
beyond tourism. Structure:

## The Short Version
One or two sentences stating plainly why this tunnel matters strategically, grounded in the seed
facts only.

## What It Actually Changed
Use the seed facts on distance/time reduction and year-round access, tie this to the broader
significance without speculating on specifics not given to you.

## Where Narender Draws the Line
Include the seed fact about not being a defence analyst and not speculating on troop movements or
capability specifics. State this honestly as a boundary, not an excuse, this is what's publicly
known and reported, not insider knowledge.

## Why This Matters to Everyone, Not Just Defence
Tie back to how this same infrastructure benefits ordinary travel and Lahaul residents, connecting
to the practical, everyday reality rather than ending on a purely geopolitical note.

Stay strictly factual throughout. Do not speculate beyond the seed facts at any point in this post.
"""
        if topic["slug"] == "atal-tunnel-engineering-how-it-was-built":
            return base + """Write this as a technical deep-dive on how the tunnel was actually
built, for readers who want the real engineering story, not just the highlight reel. Structure:

## The Idea, Long Before It Was Real
Use the seed facts on how far back this was first proposed and how long it took to actually begin.

## The Build Itself
Use the seed facts on construction method (drill and blast, New Austrian Tunnelling Method), the
biggest obstacles (the fault zone, avalanche-prone sites, water seepage, excavated material
volume). Be specific and technical where the seed facts support it, general where they don't.

## What Makes It a Genuine Engineering Achievement
Tie together the altitude, the terrain, the safety systems, why this is a real distinction and not
just marketing language. This is also a natural place to mention checking the live Atal Tunnel
status before relying on the tunnel being passable, since even a well-engineered tunnel still
closes for weather and maintenance, use the checker link from the internal links list here.

End with a short closing paragraph in Narender's voice, not a generic CTA. Every internal link
listed above, including the Atal Tunnel checker link, must still appear exactly once in this post.
"""
        if topic["slug"] == "atal-tunnel-visitor-access-guide":
            return base + """Write this as a practical, no-fluff guide for tourists actually
planning to drive through Atal Tunnel. Structure:

## What You Actually Need to Know
Permit requirements (none, unlike Rohtang), timings, drive duration, all from the seed facts.

## What to Expect Inside and at Both Portals
The contrast between south and north portal, what's allowed and not allowed, facilities nearby.

## What Can Go Wrong
Closures, weather risk, fuel availability, grounded in the seed facts. Tie in a live status
checker link naturally here, this is the most natural place for it in this post.

## Narender's Honest Take
A short, direct closing recommendation, not a generic CTA.
"""
        return base + """Write a grounded, specific, first-person post on this practical/factual
topic using only the seed facts provided. Stay factual and avoid speculation beyond the seed facts.
"""

    if t == "trek":
        return base + """Write this as a real trail/activity guide. Structure:

## The Trail (or Activity), Start to Finish
Walk through it step by step using ONLY the seed facts for the route, landmarks, and distances.
If a seed fact doesn't cover a transition, describe it in general terms ("the trail continues
upward") rather than inventing specific markers.

## What Makes It Worth Doing
Honest, specific reasoning. Avoid generic adjectives, say what's actually striking about it
based on the seed facts.

## Practical Notes
Safety notes (e.g. wildlife warnings), best time of day, fitness level needed, anything from
the seed facts. Skip any sub-point not supported by a seed fact.

## Who Should Skip This
Brief, honest. Not every trail suits every traveler, say so plainly.

End with a short closing paragraph in Narender's voice, not a generic CTA.
"""

    return base + "Write a grounded, specific, first-person post on this topic using only the seed facts provided.\n"


# ── External link injection (pass 2) ──────────────────────────────────────────

def build_external_link_prompt(content, topic):
    domains_str = "\n".join([f"- {d}" for d in APPROVED_EXTERNAL_DOMAINS])
    return f"""You are editing a blog post. Your ONLY job is to add 2 to 4 external links.

The post is about: {topic['title']}

RULES:
1. Add between 2 and 4 external links total. Do not exceed 4.
2. Every link's domain MUST be one of these exact domains, no others, ever:
{domains_str}
3. Only use a specific URL you are confident is real (e.g. a real Wikipedia article that
   plausibly exists for this exact topic). If you are not confident a specific page exists,
   link to the domain's general subject page instead, or skip adding a link there.
4. Every link must be relevant to the specific sentence or paragraph it appears in.
5. Natural anchor text, not "click here" or "source".
6. Do NOT touch any existing manali.today links.
7. Do NOT change any other content, wording, or structure.
8. Return ONLY the post markdown starting with # Title. No preamble.

POST TO EDIT:
{content}"""


# ── Generate post (two-pass) ──────────────────────────────────────────────────

def generate_post(topic):
    prompt = build_prompt(topic)

    print(f"  Pass 1: generating content...")
    r1 = client.chat.completions.create(
        model="deepseek-chat",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2400, temperature=0.7,
    )
    content = strip_preamble(r1.choices[0].message.content)
    print(f"  Pass 1 done: {len(content)} chars")

    print(f"  Pass 2: injecting external links (Wikipedia/gov/research only)...")
    link_prompt = build_external_link_prompt(content, topic)
    r2 = client.chat.completions.create(
        model="deepseek-chat",
        messages=[{"role": "user", "content": link_prompt}],
        max_tokens=2800, temperature=0.3,
    )
    final = strip_preamble(r2.choices[0].message.content)

    # Safety net: strip any external link that snuck in from a non-approved domain
    final = scrub_unapproved_links(final)
    print(f"  Pass 2 done: {len(final)} chars")
    return final


def scrub_unapproved_links(content):
    """
    Defense in depth: even though pass 2 is instructed to only use approved
    domains, LLMs occasionally ignore instructions. This strips the markdown
    link syntax (keeping the anchor text as plain text) for any http(s) link
    whose domain isn't in APPROVED_EXTERNAL_DOMAINS or isn't a manali.today
    internal link.
    """
    def replace_link(match):
        text, url = match.group(1), match.group(2)
        if url.startswith("/") or "manali.today" in url:
            return match.group(0)
        for domain in APPROVED_EXTERNAL_DOMAINS:
            if domain in url:
                return match.group(0)
        print(f"    Stripped unapproved link: {url}")
        return text

    return re.sub(r"\[([^\]]+)\]\((https?://[^\)]+)\)", replace_link, content)


# ── Save as MDX ───────────────────────────────────────────────────────────────

def save_as_mdx(topic, content):
    slug = topic["slug"]
    read_time = estimate_read_time(content)
    published_at = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    description = ""
    for line in content.split("\n"):
        line = line.strip()
        if (line and not line.startswith("#") and not line.startswith(">")
                and not line.startswith("-") and len(line) > 40):
            description = re.sub(r'\*\*(.+?)\*\*', r'\1', line)
            description = re.sub(r'\[(.+?)\]\(.+?\)', r'\1', description)
            description = description.replace('"', '').replace("'", '').replace(':', ' ').replace('\\', '')
            description = description.strip()
            if len(description) > 160:
                truncated = description[:160].rsplit(' ', 1)[0]
                description = truncated.rstrip('.,;') + '...'
            break

    tags_yaml = "[" + ", ".join(f'"{t}"' for t in topic["tags"]) + "]"
    frontmatter = f"""---
title: "{topic['title']}"
slug: "{slug}"
publishedAt: "{published_at}"
description: "{description}"
tags: {tags_yaml}
readTimeInMinutes: {read_time}
coverImage: "/blog-images/{slug}/cover.jpg"
thumbImage: "/blog-images/{slug}/thumb.jpg"
---

"""

    content_lines = content.split("\n")
    if content_lines and content_lines[0].strip().lstrip("# ").strip() == topic['title'].strip():
        content = "\n".join(content_lines[1:]).lstrip("\n")

    filepath = CONTENT_DIR / f"{slug}.mdx"
    filepath.write_text(frontmatter + content, encoding="utf-8")
    print(f"  Saved: {filepath}")
    return filepath


# ── Cover image generation ────────────────────────────────────────────────────

def generate_cover(topic):
    """
    Calls generate-cover.js (Puppeteer) to render cover.jpg + thumb.jpg into
    public/blog-images/{slug}/, matching the paths save_as_mdx() already
    wrote into the post's frontmatter (coverImage/thumbImage). Falls back
    to a warning rather than failing the whole post if Puppeteer or Node
    isn't available, a post with no cover/thumb is recoverable, a failed
    pipeline run partway through generating content is not.
    """
    if SKIP_COVERS or not COVER_SCRIPT.exists():
        return False

    slug = topic["slug"]
    output_dir = PUBLIC_BLOG_IMAGES_DIR / slug
    try:
        result = subprocess.run(
            ["node", str(COVER_SCRIPT), topic["title"], topic["type"], str(output_dir)],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode == 0:
            print(result.stdout.strip())
            return True
        print(f"  Cover failed: {result.stderr.strip()}")
        return False
    except Exception as e:
        print(f"  Cover error: {e}")
        return False


# ── Topic picker ──────────────────────────────────────────────────────────────

def pick_candidates(n=12):
    random.seed()
    published = get_already_published_slugs()
    available = [t for t in TOPICS if t["slug"] not in published]

    if not available:
        print("All topics have been published!")
        return []

    missing_facts = [t["slug"] for t in available if not t.get("seed_facts")]
    if missing_facts:
        print(f"  WARNING: these topics have no seed_facts and will be skipped: {missing_facts}")
        available = [t for t in available if t.get("seed_facts")]

    print(f"  {len(available)} unpublished, grounded topics remaining out of {len(TOPICS)} total")

    by_type = {}
    for t in available:
        by_type.setdefault(t["type"], []).append(t)
    for k in by_type:
        random.shuffle(by_type[k])

    candidates = []
    types = list(by_type.keys())
    random.shuffle(types)
    while len(candidates) < n and any(by_type.values()):
        for t in types:
            if by_type.get(t) and len(candidates) < n:
                candidates.append(by_type[t].pop(0))
    return candidates[:n]


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print(f"[{datetime.now(timezone.utc).isoformat()}] manali.today Blog Publisher v1 starting...")
    print(f"Output directory: {CONTENT_DIR}")

    candidates = pick_candidates(CANDIDATE_COUNT)
    if not candidates:
        return

    print(f"\n{'='*75}")
    print(f"TOPIC SUGGESTIONS:")
    print(f"{'='*75}")
    for i, t in enumerate(candidates, 1):
        print(f"  {i:2}. [{t['type']:<14}] {t['title']}")
    print(f"{'='*75}")

    if AUTO_MODE:
        topics = candidates[:POSTS_PER_RUN]
        print(f"\nAuto mode: publishing top {POSTS_PER_RUN}")
    else:
        print(f"\nEnter numbers to publish (e.g. 1,3,7) or 'a' for top {POSTS_PER_RUN}:")
        choice = input("> ").strip().lower()
        if choice == "a":
            topics = candidates[:POSTS_PER_RUN]
        else:
            try:
                indices = [int(x.strip()) - 1 for x in choice.split(",")]
                topics = [candidates[i] for i in indices if 0 <= i < len(candidates)]
            except Exception:
                print("Invalid input, aborting.")
                return
        if not topics:
            print("No topics selected, aborting.")
            return
        print(f"\nYou selected:")
        for t in topics:
            print(f"  - {t['title']}")
        if input("\nConfirm and generate? (y/n): ").strip().lower() != "y":
            print("Aborted.")
            return

    print(f"\nGenerating {len(topics)} posts...\n")
    generated = failed = 0

    for i, topic in enumerate(topics, 1):
        print(f"[{i}/{len(topics)}] Generating: {topic['title']}")
        try:
            content = generate_post(topic)
            save_as_mdx(topic, content)
            generate_cover(topic)
            generated += 1
            if i < len(topics):
                time.sleep(5)
        except Exception as e:
            print(f"  ERROR: {e}")
            failed += 1

    print(f"\nDone. Generated: {generated} | Failed: {failed}")
    if generated > 0:
        print(f"\nNext steps:")
        print(f"  1. Read every generated post before pushing, seed facts prevent invention")
        print(f"     but don't guarantee good writing, still needs a human pass.")
        print(f"  2. Add this run's slugs/titles to BLOG_INTERNAL_LINKS in blog_topics.py")
        print(f"     so future posts can link back to them.")
        print(f"  git add content/blog/ public/blog-images/")
        print(f"  git commit -m 'blog: add new posts'")
        print(f"  git push")


if __name__ == "__main__":
    main()