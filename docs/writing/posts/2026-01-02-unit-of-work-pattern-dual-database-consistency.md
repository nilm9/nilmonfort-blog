---
title: "Why I Was Wrong About Books: How the Unit of Work Pattern Saved My Database"
authors:
  - nilmonfort
categories:
  - Software Engineering
date: 2026-01-02
description: How the Unit of Work pattern solved my dual-database consistency problem and taught me that reading and building are complementary.
draft: false
slug: unit-of-work-pattern-dual-database-consistency
tags:
  - python
  - architecture
  - unit-of-work
  - postgres
  - databases
image: ../../assets/images/nil_profile_img.jpeg
hide:
  - navigation
---

# Why I Was Wrong About Books: How the Unit of Work Pattern Saved My Database

## The Builder's Dilemma

A while ago, I became anti-books. As a developer, I went all in on building. I avoided anything that felt like analysis paralysis. I wanted to be smart by actually knowing how to build stuff, not by reading about building stuff.

Don't get me wrong. This is mostly the right approach. Doers and builders win. But here's the problem: you don't know what you don't know.

<!-- more -->

## The Book I Almost Ignored

Last week I was reading a Python architecture book. Just skimming, really. There was a concept called Unit of Work. It caught my eye for a second.

Unit of Work is basically this: when a service does several things, you want all of them to happen or none of them to happen. Atomic operations. I thought it was interesting, but I filed it away as "maybe useful someday."

Someday came the next day.

## The Problem That Hit Me

I was building a production app. I needed to change the infrastructure for cost reasons. Originally, I was using Postgres with PG Vector. All my transactional data lived there. All my embeddings lived there. One database, one source of truth.

Then I switched to Postgres with Neon for the data and Quadrant for the embeddings. Two databases. More infrastructure to manage. And suddenly, I had a real problem.

When I created one item, the metadata needed to go to Postgres. The semantic information needed to go to Quadrant. What if one succeeded and the other failed? I'd have inconsistencies everywhere. Half-created items. Orphaned data. A mess.

That's when Unit of Work clicked.

<!-- excalidraw:diagram
id: uow-dual-database-problem
title: The Dual Database Consistency Problem
type: system-overview
components:
  - name: "User Action"
    type: user
    technologies: []
    position: left
  - name: "Application"
    type: backend
    technologies: ["Python", "FastAPI"]
    position: center
  - name: "Postgres"
    type: database
    technologies: ["Neon"]
    position: right
  - name: "Quadrant"
    type: database
    technologies: ["Vector DB"]
    position: right
connections:
  - from: "User Action"
    to: "Application"
    label: "Create Item"
  - from: "Application"
    to: "Postgres"
    label: "Save Metadata ✓"
  - from: "Application"
    to: "Quadrant"
    label: "Save Embedding ✗"
description: |
  Shows the problem: when saving to two databases independently,
  one can succeed while the other fails, leaving data inconsistent.
excalidraw:diagram-end -->

![The Dual Database Consistency Problem](img/uow-dual-database-problem-afb2cfe75c.svg)

## What Unit of Work Actually Does

Think of it like a transaction boundary. It keeps a list of everything that changes during a business operation. Then it coordinates writing all those changes at once.

It gives you three critical guarantees:

**Atomicity**: All operations succeed together or fail together. No partial commits slip through.

**Consistency**: Related changes across multiple places happen together. Your data stays in sync.

**Single commit point**: One place to commit or rollback everything. Transaction boundaries are crystal clear.

In my case, I had two databases. Unit of Work would make sure both got updated or neither did.

<!-- excalidraw:diagram
id: uow-solution-architecture
title: Unit of Work Solution
type: layered
components:
  - name: "Use Case"
    type: backend
    technologies: ["Python"]
    position: left
  - name: "Unit of Work"
    type: backend
    technologies: ["Context Manager"]
    position: center
  - name: "Videos Repository"
    type: backend
    technologies: ["SQLAlchemy"]
    position: right
  - name: "Embeddings Repository"
    type: backend
    technologies: ["Quadrant Client"]
    position: right
  - name: "Postgres"
    type: database
    technologies: ["Neon"]
    position: right
  - name: "Quadrant"
    type: database
    technologies: ["Vector DB"]
    position: right
connections:
  - from: "Use Case"
    to: "Unit of Work"
    label: "async with uow"
  - from: "Unit of Work"
    to: "Videos Repository"
    label: "uow.videos.save()"
  - from: "Unit of Work"
    to: "Embeddings Repository"
    label: "uow.embeddings.save()"
  - from: "Videos Repository"
    to: "Postgres"
    label: "Persist"
  - from: "Embeddings Repository"
    to: "Quadrant"
    label: "Persist"
  - from: "Unit of Work"
    to: "Postgres"
    label: "Commit Both"
  - from: "Unit of Work"
    to: "Quadrant"
    label: "Commit Both"
description: |
  The Unit of Work coordinates both repositories and ensures
  atomic commits across both databases.
excalidraw:diagram-end -->

![Unit of Work Solution](img/uow-solution-architecture-67a2fb819f.svg)

## How I Used It in Production

My app is a YouTube aggregator. When I process a video, I need to save video metadata to Postgres and vector embeddings to Quadrant. Both need to happen.

Here's the pattern I used:

```python
async with self.uow:
    # Update the video
    video.update_summary(summary=summary, s3_key=summary_key)
    video.mark_completed()

    # Save to Postgres
    await self.uow.videos.save(video)

    # Save embedding to Quadrant
    await self.uow.embeddings.save(
        video_id=video.video_id,
        embedding=embedding,
        payload={...}
    )

    # Commits BOTH databases atomically
    await self.uow.commit()
```

If anything fails, everything rolls back. No partial commits. No orphaned data.

## The Architecture Behind It

I set up a protocol (an interface) that defines what a Unit of Work should do:

```python
class UnitOfWorkProtocol(Protocol):
    @property
    def users(self) -> UserRepositoryProtocol: ...

    @property
    def videos(self) -> VideoRepositoryProtocol: ...

    @property
    def embeddings(self) -> EmbeddingRepositoryProtocol: ...

    async def commit(self) -> None: ...
    async def rollback(self) -> None: ...
```

Then I built a concrete implementation that handles both databases. It creates a SQLAlchemy async session for Postgres. It provides access to the Quadrant client for vector operations.

The commit process works in phases. First, it commits the Postgres transaction. That's true ACID. Then it flushes the Quadrant operations. If Quadrant fails after Postgres succeeds, it logs the error. Not perfect, but much better than no coordination at all.

## How It Works in Practice

Every use case follows the same pattern now. Open the Unit of Work with async with. Do your reads. Do your business logic. Save your changes. Commit.

The context manager handles the cleanup. If anything throws an exception, it rolls back automatically. Transaction boundaries are crystal clear.

Creating a user looks like this:

```python
async with self.uow:
    existing_user = await self.uow.users.find_by_id(command.user_id)
    if existing_user:
        raise ValueError(f"User already exists")

    user = User(user_id=command.user_id, email=command.email, ...)
    await self.uow.users.save(user)
    await self.uow.commit()
```

Processing videos with embeddings is more complex. I use multiple transactions for long-running operations. First transaction: mark the video as processing. Then I call external APIs and run ML inference. Second transaction: save the video metadata and embedding together, atomically.

## Why This Pattern Matters

Unit of Work gives me several things I didn't have before.

**Clean architecture**: My domain layer defines the protocol. My infrastructure layer implements it. The business logic doesn't care about database details.

**Testable code**: I can mock the Unit of Work protocol for unit tests. I don't need real databases running.

**Flexibility**: If I want to swap database implementations later, I just change the concrete class. My use cases stay the same.

**Automatic error handling**: Failures trigger rollbacks. No partial commits slip through.

**Clarity**: I can see exactly where transactions start and end. No hidden database calls scattered everywhere.

## The Bigger Lesson: Books vs Building

This is especially powerful when you're coordinating between different systems. I have Postgres for relational data. I have Quadrant for vector search. Unit of Work keeps them consistent.

But the real lesson isn't about databases. It's about books.

I was wrong to dismiss reading. Building is key. But so is learning patterns that other people discovered the hard way. Unit of Work isn't something I would have invented on my own. I probably would have put together some half-working solution and called it good enough.

Instead, I read about it once. The next day I needed it. Now my data stays consistent across two different databases.

You don't know what you don't know. Sometimes a book tells you.

## Practical Takeaways

If you're building production systems with multiple data stores, here's what I recommend:

- **Learn the pattern first**: Read about Unit of Work before you need it. When the problem hits, you'll recognize it immediately.

- **Start with protocols**: Define your interfaces in the domain layer. Keep infrastructure details in adapters.

- **Use context managers**: Python's `async with` pattern makes transaction boundaries explicit and cleanup automatic.

- **Handle partial failures**: With multiple systems, true atomicity is hard. Log errors and plan for manual recovery when needed.

- **Don't skip testing**: Mock your protocols for unit tests. Use integration tests for the real implementation.

- **Balance simplicity and structure**: For projects under three days, maybe skip the pattern. For anything longer, the structure pays off.

## Conclusion

Building is key. Action beats theory every time. But patterns and books give you tools before you waste time reinventing them.

The Unit of Work pattern solved my dual-database consistency problem in a clean, maintainable way. More importantly, it taught me that reading and building aren't opposites. They're complementary.

Next time you're tempted to skip the book and just build, remember: the thing you think you don't need might be exactly what you need tomorrow.

Want to avoid data consistency nightmares? Check out the Unit of Work pattern in your architecture book of choice. Or just start building and hit the problem yourself. Both work. One is faster.
