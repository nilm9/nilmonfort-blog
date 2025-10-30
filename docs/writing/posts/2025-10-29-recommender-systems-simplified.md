---
title: "Recommender Systems: The Unsexy AI That Actually Works"
authors:
  - nilmonfort
categories:
  - Software Engineering
date: 2025-10-29
description: Why you should understand collaborative filtering before building your next AI agent. A practical guide to recommender systems, from collaborative filtering to content-based approaches.
draft: false
slug: recommender-systems-simplified
tags:
  - machine-learning
  - recommender-systems
  - collaborative-filtering
  - content-based-filtering
  - rag
  - embeddings
image: ../../assets/images/nil_profile_img.jpeg
hide:
  - navigation
---

Everyone is obsessed with AI agents right now. Autonomous systems that plan and execute tasks. Multi-step reasoning. Tool use. The whole package.

Meanwhile, half the apps you use every day run on recommender systems. Netflix telling you what to watch. Spotify building your playlists. Amazon showing you products. YouTube deciding your next video. These systems move billions of dollars and nobody talks about them anymore.

I spent last year deep in recommender systems for my computer science degree. Built a few from scratch. Learned what works and what breaks at scale. The best part? If you've worked with RAG applications, you already understand half of it. The concepts overlap way more than you'd think.

## The Two Core Approaches

Recommender systems boil down to two main techniques. Collaborative filtering and content-based filtering. Each solves the recommendation problem from a different angle.

Collaborative filtering is about patterns in user behavior. If you and I both liked the same ten movies, we probably have similar taste. So if I loved a movie you haven't seen yet, you'll probably like it too. The system finds these patterns across all users and uses them to make predictions.

Content-based filtering is about the actual content. If you watched three sci-fi movies with space battles, the system recommends more sci-fi movies with space battles. It analyzes what you liked and finds similar things. Semantic matching, basically.

Both work. Both have trade-offs. Most real systems use a mix of both, but understanding each one separately helps you see when to use what.

## Collaborative Filtering: The Math Behind Netflix

![Diagram 1](/img/2025-10-29-recommender-systems-simplified-mermaid-1-fe9ccc9466.svg)



Here's how collaborative filtering actually works. Picture a giant matrix. Rows are users, columns are movies. Each cell contains a rating if that user watched that movie, or it's empty if they haven't.

Your matrix might look like this. User 1 loved Star Wars and Matrix but hated Titanic. User 2 loved Star Wars and Titanic. User 3 loved Matrix and Inception. Tons of empty cells because most users haven't watched most movies.

The goal is to fill in those empty cells. Predict what User 1 would rate Inception even though they haven't watched it yet. If the prediction is high, recommend it.

The magic happens with similarity calculations. You compare users to find who has similar taste. The most common way is cosine similarity. You treat each user's ratings as a vector in high-dimensional space. The angle between two vectors tells you how similar they are.

If User 1 and User 3 have a cosine similarity of 0.95, they have very similar taste. So movies that User 3 loved but User 1 hasn't seen yet become good recommendations. You're basically saying "people like you enjoyed this, so you probably will too."

This is why Netflix recommendations work. You're not unique. Thousands of other people have taste similar to yours. The system finds them, sees what they watched, and suggests it to you.

## The Cold Start Problem

Collaborative filtering has a brutal weakness. New users with no history. How do you recommend movies to someone who hasn't rated anything yet? You can't compare them to other users because you don't know their taste.

Same problem with new items. A movie that just launched has no ratings. You can't recommend it using collaborative filtering because no patterns exist yet. The system is blind to it.

This is called the cold start problem. Every collaborative filtering system hits it. You need data to make predictions, but new users and new items don't have data yet. It's a chicken and egg situation.

The typical solution is to start with content-based filtering for new users. Ask them to pick some movies they like. Use those choices to build an initial profile. Then switch to collaborative filtering as they rate more things. Hybrid approach.

## Content-Based Filtering: Semantic Search for Recommendations

![Diagram 2](/img/2025-10-29-recommender-systems-simplified-mermaid-2-8e801ccfe3.svg)


Content-based filtering takes a completely different approach. Instead of looking at user behavior patterns, it looks at the actual content. What are the properties of items you liked? Find other items with similar properties.

For movies, properties might include genre, director, actors, plot keywords, release year, runtime, whatever. You build a profile of each movie as a set of features. Then you build a profile of each user based on movies they liked. Match user profiles to movie profiles and recommend the closest matches.

Sound familiar? If you've built RAG applications, this should click. It's the same concept. Encode content as embeddings. Encode queries as embeddings. Find the closest matches using vector similarity. Retrieve and rank.

The modern approach uses embeddings for everything. Instead of manually defining features like genre and director, you use a model to create dense vector representations of the content. These embeddings capture semantic meaning automatically.

For movies, you might embed the plot summary, the review text, the metadata, all of it. You get a vector that represents what the movie is about. For users, you create an embedding based on movies they liked. Their taste becomes a vector too.

Then recommendation is just vector search. Find movies whose embeddings are closest to the user's embedding. Rank by similarity. Done.

## Why This Feels Like RAG

![Diagram 3](/img/2025-10-29-recommender-systems-simplified-mermaid-3-bef25b38af.svg)


If you've built retrieval augmented generation systems, this is the same pattern. You have a corpus of documents, you encode them as embeddings, you store them in a vector database. When a query comes in, you encode it, search for similar vectors, retrieve the top matches.

Recommender systems do exactly this. The corpus is your catalog of items. The query is the user's taste profile. The retrieval step is finding similar items. The only difference is that in RAG you pass the retrieved content to an LLM for generation. In recommendations, you just show the items directly.

The infrastructure is nearly identical. Vector databases like Pinecone or Weaviate work for both. The embedding models are similar. The similarity metrics are the same. If you know how to build RAG, you can build content-based recommendations.

This is why I said you already know half of it. The techniques transfer directly.

## The Trade-Offs Between Approaches

![Diagram 4](/img/2025-10-29-recommender-systems-simplified-mermaid-4-9068c43db6.svg)


Collaborative filtering is powerful when you have lots of users and lots of behavior data. It finds patterns you'd never think to encode manually. It discovers that people who like sci-fi also tend to like certain documentaries, even though the content seems unrelated. Surprising connections that work.

But it's expensive at scale. Every time a new user joins or a new item gets added, you need to recompute similarity matrices. For a system with millions of users and millions of items, that's a lot of computation. The matrix is huge and mostly empty, which creates storage and speed problems.

Collaborative filtering also struggles with the filter bubble. It reinforces your existing taste. If you've only watched action movies, it recommends more action movies. You never get exposed to things outside your pattern. The system makes your taste narrower over time.

Content-based filtering is fast and scales well. Adding a new item just means computing its embedding once. No need to recompute anything about users. Adding a new user just means building their profile from items they interact with. Independent operations.

But content-based filtering can't discover surprising connections. It only recommends things similar to what you already liked. If you watched sci-fi movies, it shows you more sci-fi. It won't suggest that documentary unless the content is semantically similar. You miss serendipity.

Content-based filtering also suffers from overspecialization. If your profile is too narrow, recommendations become repetitive. You get stuck in a loop of very similar items. Diversity drops.

## The Hybrid Approach That Actually Works

![Diagram 5](/img/2025-10-29-recommender-systems-simplified-mermaid-5-0706fd5454.svg)


Most production systems use both techniques together. Hybrid recommender systems that combine collaborative and content-based filtering to get the benefits of each while minimizing the weaknesses.

One common pattern is to use content-based filtering for new users and new items. This solves the cold start problem. As soon as you have enough behavioral data, switch to collaborative filtering for personalized recommendations based on patterns.

Another pattern is to use both in parallel and blend the results. Get recommendations from collaborative filtering. Get recommendations from content-based filtering. Merge the two lists with some weighting. Maybe 70% collaborative and 30% content-based. Tune the weights based on what works for your data.

A more sophisticated approach is to use content-based filtering for candidate generation and collaborative filtering for ranking. Content-based gives you a broad set of potentially relevant items quickly. Collaborative filtering ranks them based on predicted engagement. Fast first pass, accurate second pass.

Netflix actually does something like this. They use multiple algorithms in a cascade. Each layer filters and ranks. Content features, collaborative patterns, contextual signals like time of day, all combined into a final ranked list. It's not one algorithm, it's an ensemble.

## Scaling Challenges You'll Hit

![Diagram 6](/img/2025-10-29-recommender-systems-simplified-mermaid-6-0321fa7dfe.svg)


When your system is small, none of this matters much. You can compute similarities on the fly. You can store everything in memory. But as you grow, scaling becomes the hard part.

For collaborative filtering, the user-item matrix becomes massive. Millions of users times millions of items is trillions of cells. Most are empty, but even storing the non-empty ones is expensive. You need sparse matrix representations and efficient storage.

Computing similarities gets slow. Comparing every user to every other user is quadratic. That doesn't scale. You need approximation techniques. Locality sensitive hashing to find similar users without comparing everyone. Matrix factorization to reduce dimensions. Clustering to group similar users and compare within clusters only.

For content-based filtering, the bottleneck is embedding generation. If you're using a neural network to create embeddings, that's compute-intensive. You need to batch it efficiently. Cache embeddings so you're not recomputing them constantly. Use faster models or distilled models when you can.

Vector search at scale is its own challenge. Exact nearest neighbor search is slow when you have millions of vectors. You need approximate nearest neighbor algorithms like HNSW or IVF. Trade a bit of accuracy for massive speed improvements.

## The Real-World Complexity

Production recommender systems have layers of complexity beyond the core algorithms. You need to handle business rules. Some items should never be recommended together. Some items should be boosted for business reasons. Some users have restrictions on what they can see.

You need to balance exploration and exploitation. If you only recommend things users are likely to engage with, they never discover new interests. You need to inject some randomness, some diversity, some items outside their pattern. But too much and engagement drops.

You need to deal with feedback loops. If you recommend mostly action movies, users watch mostly action movies, which makes you recommend even more action movies. The system reinforces its own biases. You need mechanisms to break these loops.

You need to measure what matters. Click-through rate is easy to measure but doesn't capture satisfaction. Watch time is better for videos. Purchase rate matters for e-commerce. Long-term retention is hardest to measure but most important. Your metrics shape what the system optimizes for.

## Why This Matters Now

Everyone is building AI agents and chatbots. Those are cool. But most businesses don't need an agent that plans multi-step tasks. They need a system that shows users the right content at the right time. That's still a recommender system problem.

If you're building a product with any kind of catalog, you need recommendations. E-commerce, media, education, social networks, job boards, dating apps, all of them. The pattern is universal. Help users find relevant items from a large set.

The techniques I described work today. They're proven. They scale. You don't need to invent new AI to solve this. Collaborative filtering has been around for decades. Content-based filtering with embeddings has been refined for years. The tools exist.

And if you've already built RAG systems, you have most of the skills. Vector databases, embeddings, similarity search, these are the same building blocks. You're just applying them to a different problem.

## Getting Started

If you want to build a recommender system, start simple. Don't try to build Netflix's full stack on day one. Begin with basic content-based filtering. Take the items in your catalog. Generate embeddings for them using a pre-trained model. Store embeddings in a vector database. When a user interacts with items, create a profile embedding. Search for similar items. Recommend them.

This gets you 80% of the value with 20% of the complexity. It works for new users and new items. It scales reasonably well. You can ship it in a week if you use existing tools.

As you get more data, add collaborative filtering. Start tracking user behavior. Build a user-item interaction matrix. Compute user similarities. Use those patterns to make recommendations alongside your content-based ones. Blend the results.

Measure everything. Track what users click on, what they engage with, what they ignore. Use those signals to tune your system. Try different weighting schemes for hybrid recommendations. A/B test changes. Let data guide your decisions.

## The Unsexy Truth

Recommender systems aren't as flashy as AI agents. They don't write code or book your calendar. But they drive more business value than most of the AI projects people obsess about.

They help users find what they want faster. They increase engagement. They drive revenue. They work at massive scale for huge companies and they work for startups with tiny catalogs. The same principles apply.

If you're building a product, you probably need recommendations more than you need an AI agent. Focus on showing users the right content. Make that experience great. That's where the value is.

And the best part? You already have the tools to build this. Vector databases, embeddings, similarity search. It's the same stack you'd use for RAG. Just applied differently.

Stop chasing the shiny new thing. Build the unsexy system that actually helps your users. That's how you win.

---

*What's your experience with recommender systems? Have you built one?*


