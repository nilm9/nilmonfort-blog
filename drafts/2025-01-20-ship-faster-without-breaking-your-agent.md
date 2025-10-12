---
title: "Ship Faster Without Breaking Your Agent"
authors:
  - nilmonfort
categories:
  - AI Engineering
date: 2025-01-20
description: A tiny evaluator that catches prompt drift and tool bugs before your users do.
draft: false
slug: ship-faster-without-breaking-your-agent
tags:
  - agents
  - testing
  - evaluation
  - llm
  - monitoring
image: ../images/ai-post-card.png
---

# Ship Faster Without Breaking Your Agent

*A tiny evaluator that catches prompt drift and tool bugs before your users do.*

Every time I changed my agent's prompt or a tool description, something else broke. Tool B started working and Tool A began to hallucinate. Rolling back and retesting by hand was slow and noisy. I needed a quick truth check I could run on every change.

<!-- more -->

So I built a small service that runs a fixed test suite, compares fresh answers to a ground truth, and explains what drifted. I call it **AITruthGuard**. It turned "hope it works" into "know what changed."

[Diagram: Prompt change → Webhook → Test Runner → Agent (orchestrator) → Reference Search → LLM Judge → Report + Weekly Metrics]

Here's the idea in plain terms. I keep realistic Q&A cases in YAML, including the expected tool and a reference answer. When I push a prompt change, a webhook triggers a run. The runner asks the live agent for answers, fetches a few supporting snippets, and hands both to a second model that judges the result with a short rubric. Everything runs in parallel, so hundreds of cases finish fast.

What makes it practical is the simple stack. Python 3.11 with FastAPI. Async HTTP with `httpx`. Dependency injection to keep pieces clean. The service runs in a container anywhere. Postgres stores full reports and a weekly view, and Alembic manages migrations. Outbound calls use OAuth2 client-credentials with token caching. Logs redact secrets and carry a request ID so tracing one bad case is easy.

When I want speed, I stream ND-JSON and watch scores arrive. When I want history, I open the latest report and see deltas against the previous run. A minute of compute replaces an afternoon of manual checks, and regressions stop slipping through.

## What it measures

* Answer correctness against a reference.
* Right tool selection for the task.
* Confidence + a short reason when something fails.

Behind the scenes, the judge model reads the ground truth, the agent's reply, and a compact rubric. It returns a score and a human note: what went wrong, which tool should have been used, and how to fix it. That note is the key. It points to the cause—prompt wording, retrieval gaps, or routing—and tells me where to tweak.

The API stays small on purpose. Run tests. List reports. Read weekly metrics. You can stream results if you like tight feedback loops. You can also schedule nightly runs to catch slow drift. It's vendor-neutral, so you can swap the agent, the judge, or the search endpoint with a config change.

This is how I ship changes without surprises. I refactor a tool description, nudge the system prompt, or swap a model, then run the suite. In about a minute I know what improved, what regressed, and why. No drama. No guesswork.

**Takeaway:** treat your agent like production code. Lock a test suite, compare against ground truth, and let a judge highlight fixes.

**CTA:** Want my minimal template (YAML suite + FastAPI runner + judge rubric)? DM me "evals" and I'll share it.
