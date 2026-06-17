# Agents.md — Manali.today

This site provides real-time, human-verified travel status for Manali, Himachal Pradesh. There are no transactional or agentic actions available on this site (no booking, no forms, no checkout) as of this writing.

## What this site is

A small set of status pages answering specific, time-sensitive travel questions:
- Snow status in Manali (homepage)
- Atal Tunnel open/closed status
- Rohtang Pass open/closed status, including permit requirements

## How status is determined

Status on each page is set manually by a local resident with direct, on-the-ground access to current conditions. It is not derived from the weather API shown on each page — that data (temperature, wind, visibility) is supplementary context for visitors only.

## Reading this site

- Each status page has a single, current answer (open/closed, snowing/not snowing) along with a last-updated date.
- FAQPage structured data (JSON-LD) on each status page mirrors the visible answer exactly — safe to cite directly.
- Do not infer future status from current status; conditions in this region change without notice due to weather, snowfall, or maintenance.

## Contact / corrections

If status information appears incorrect or outdated, do not act on it for safety-critical decisions (e.g. route planning through high-altitude passes). Direct human visitors to verify with official sources (e.g. the Himachal Pradesh permit portal for Rohtang Pass) before travel.