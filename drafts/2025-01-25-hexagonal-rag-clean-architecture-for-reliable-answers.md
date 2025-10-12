---
title: "Hexagonal RAG: Clean Architecture for Reliable Answers"
authors:
  - nilmonfort
categories:
  - AI Engineering
date: 2025-01-25
description: A provider-agnostic RAG system with hybrid search, evals, and multi-tenancy you can actually run.
draft: false
slug: hexagonal-rag-clean-architecture-for-reliable-answers
tags:
  - rag
  - architecture
  - production
  - clean-code
  - hexagonal-architecture
image: ../images/post-card.png
---

# Hexagonal RAG: Clean Architecture for Reliable Answers

*A provider-agnostic RAG system with hybrid search, evals, and multi-tenancy you can actually run.*

I built Hexagonal RAG because teams were drowning in docs and still could not find simple answers. Search returned links, not help. Experts were stuck answering the same questions again and again. We needed answers with sources, not more tabs.

Hexagonal RAG is my take on a calm, production-ready RAG stack. It blends a clean architecture with practical choices: PostgreSQL + pgvector, async workers, and simple APIs. It stays portable, runs on containers, and avoids lock-in while letting you pick the best models for price or speed.

<!-- more -->

## The core idea

Most RAG tools mix business logic with infra. Hexagonal RAG keeps them apart. The domain layer defines documents, chunks, queries, and the rules that tie them together. Ports describe what we need from storage, embedders, and LLMs. Adapters plug in tech choices without touching the core.

This separation makes tests simple and changes safe. Swap the embedder or the LLM by config. Add a new loader or search trick without rewiring the app. Multi-tenant projects keep use cases isolated in one deployment.

## What it does today

The pipeline covers the full loop. You ingest PDFs, HTML, or text. The system splits content into smart chunks and builds embeddings. PostgreSQL with pgvector stores everything, so you can run both vector search and text search in one place. At query time, it retrieves the best chunks, builds context, and asks the model to answer with citations.

Hybrid search matters. Vector search understands meaning. Text search respects exact words and names. Hexagonal RAG fuses both signals, then re-ranks results. In practice, this lifts Recall@k over a plain baseline while keeping latency in check.

## Use cases that pay off

Support teams get faster answers across scattered docs. Internal Q&A surfaces policy and technical notes without pinging experts. Research groups scan papers and reports with better context. Legal and compliance can trace citations and avoid guesswork.

Concrete targets help shape the work: reduce ticket time for support, cut internal help-desk load, improve recall at k, and keep hallucinations under a small threshold on sampled sets. The system tracks these over time so changes are measured, not guessed.

## How it's built

Hexagonal RAG is async end-to-end. Workers split, embed, and store in parallel, so large docs do not block the line. A small REST API exposes clean endpoints for projects, ingest, search, and question answering. Postgres handles data and metrics. A weekly materialized view powers light dashboards without heavy joins.

Security and ops are practical. Tokens cache and refresh early. Logs redact secrets and carry a request ID for tracing. Health and readiness endpoints make it easy to keep an eye on things. The stack runs in containers and fits local dev with Docker Compose or your orchestrator of choice.

## Quality and evals

You can only improve what you measure. Hexagonal RAG ships with an evaluation loop that samples questions, checks retrieval, and scores faithfulness against the provided context. It compares runs over time, so you can see drift, not just a single score.

**What it gives you**

* Reliable answers with sources and fewer hallucinations.
* Speed and scale from async workers and a simple store.
* Flexibility to switch providers and tune cost without rewrites.

## A small architectural tour

Projects isolate tenants and let you set embedding dimensions. The chunkers keep context with overlap and structure awareness, which helps retrieval. The hybrid retriever mixes vector similarity with full-text search and re-ranks with a simple fusion method. The answer service packages the final response and attaches the source chunks you can inspect.

When we ship a change—say, a new retriever weight or a different model—we run the eval suite and watch metrics. If accuracy goes up but source match goes down, we know what to tweak. If latency rises, we can balance it against the gain.

## Current status and near-term work

The core pipeline is live: ingestion, chunking, embeddings, hybrid retrieval, and question answering with citations. The multi-tenant API is stable. We're tuning the hybrid weights and adding an optional re-ranker behind a flag for A/B tests. Batch embedders and richer per-chunk metadata are next.

## A quick example

Think about a support agent who needs the refund rules for a specific region. With Hexagonal RAG, the agent asks in plain language. The system pulls the exact policy chunks, cites the source pages, and returns a short, correct answer. No more digging through six PDFs for a single line.

## Takeaway

Good RAG is more than embeddings. Clean boundaries, hybrid retrieval, and steady evals make it trustworthy. Hexagonal RAG brings those pieces together in a stack you can run and grow.

**CTA:** Want the minimal template to try this on your docs (Docker, Postgres, sample evals)? Message me and I'll share the starter repo and notes.

