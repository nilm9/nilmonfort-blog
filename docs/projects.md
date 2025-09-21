# Projects

Here are some of the AI/ML projects I've been working on:

## 🤖 AI Truth Guard

A FastAPI microservice with hexagonal design for end-to-end LLM validation. Measures precision, recall, and tool selection while streaming results over SSE and persisting data in PostgreSQL.

**Tech Stack:** Python, FastAPI, PostgreSQL, Hexagonal Architecture, SSE  
**Status:** Production at Inditex  
**Features:** LLM validation, streaming results, async workflows

## 🔍 End-to-End RAG Platform

Designed and led development of a multi-tenant RAG platform featuring hybrid dense+lexical search and pluggable LLM providers. Serves 60+ unstructured documents across multiple departments.

**Tech Stack:** Python, FastAPI, Vector Stores, LLM APIs, Multi-tenant Architecture  
**Status:** Production at Inditex  
**Impact:** Enhanced performance across multiple departments

## 🎨 GenAI Design Assistant

Architected an e2e GenAI application for retail customers, enhancing design team capabilities by 50x using AI agents. Features multimodal image generation, editing, and design classification.

**Tech Stack:** React, Python, LLMs, AWS, Serverless, CDK  
**Status:** Production  
**Impact:** 50x speed improvement in design workflows

## 📊 GenAI Content Ingestion Pipeline

A scalable pipeline using FastAPI, Celery with Redis, and AWS S3/DynamoDB to ingest YouTube transcripts via RSS and execute async LLM workflows (summarize, filter, generate, enhance, rank).

**Tech Stack:** Python, FastAPI, Celery, Redis, AWS S3, DynamoDB, Hexagonal Design  
**Status:** Active  
**Features:** Resilient tasks, retry mechanisms, provider-agnostic LLM integration

## 🧾 Smart Invoice Automation

Created a GenAI automation system for converting invoice images to Excel using LLMs. Built with event-driven architecture using webhooks and queues, including security measures for transactions.

**Tech Stack:** Python, LLMs, Event-driven Architecture, Webhooks, Queues  
**Status:** Active  
**Features:** Image-to-Excel conversion, secure transactions

## 🚕 High-Performance Taxi Allocation

Developed a taxi allocation algorithm using genetic, greedy, and heuristic algorithms on AWS Lambda, achieving sub-second (<1s) allocation time with optimized caching and comprehensive testing.

**Tech Stack:** Python, AWS Lambda, Genetic Algorithms, Caching  
**Status:** Production at Avantcab  
**Performance:** <1s allocation time for all services

## ✈️ Flight Delay Prediction System

Created a two-stage prediction system: a classifier to detect delayed flights and an XGBoost regressor to predict delay duration, minimizing bias and improving scheduling accuracy.

**Tech Stack:** Python, XGBoost, Machine Learning, AWS  
**Status:** Production at Avantcab  
**Features:** Bias minimization, improved scheduling accuracy

---

*Interested in collaborating on AI/ML projects? [Get in touch](#about)!*