---
title: "Building Production-Ready RAG Systems with Hexagonal Architecture"
authors:
  - nilmonfort
categories:
  - AI Engineering
date: 2025-01-01
description: Lessons learned from building a multi-tenant RAG platform at Inditex, covering hexagonal architecture, vector stores, and LLM integration patterns.
draft: false
slug: building-production-ready-rag-systems-with-hexagonal-architecture
tags:
  - rag
  - llm
  - architecture
  - production
image: ../images/post-card.png
---

# Building Production-Ready RAG Systems with Hexagonal Architecture

Building production-ready RAG (Retrieval-Augmented Generation) systems requires more than just connecting a vector database to an LLM. After leading the development of a multi-tenant RAG platform at Inditex, I've learned valuable lessons about architecture, scalability, and reliability.

<!-- more -->

## The Challenge

When we started building our RAG platform, we needed to serve 60+ unstructured documents across multiple departments while maintaining high performance and reliability. The system had to support:

- Multi-tenant vector stores
- Hybrid dense+lexical search
- Pluggable LLM providers
- Real-time conversational assistants
- End-to-end validation and monitoring

## Why Hexagonal Architecture?

Traditional monolithic approaches don't scale well for RAG systems. We chose hexagonal architecture because:

- **Testability** - Easy to mock external dependencies (vector stores, LLMs)
- **Flexibility** - Swap providers without changing core logic
- **Maintainability** - Clear separation of concerns
- **Scalability** - Independent scaling of components

## Key Components

### 1. Vector Store Abstraction

```python
class VectorStore(ABC):
    @abstractmethod
    async def search(self, query: str, filters: Dict) -> List[Document]:
        pass
    
    @abstractmethod
    async def upsert(self, documents: List[Document]) -> None:
        pass
```

### 2. LLM Provider Interface

```python
class LLMProvider(ABC):
    @abstractmethod
    async def generate(self, prompt: str, context: str) -> str:
        pass
    
    @abstractmethod
    async def embed(self, text: str) -> List[float]:
        pass
```

### 3. RAG Service Core

The core RAG service orchestrates the retrieval and generation process:

```python
class RAGService:
    def __init__(self, vector_store: VectorStore, llm: LLMProvider):
        self.vector_store = vector_store
        self.llm = llm
    
    async def query(self, question: str, tenant_id: str) -> str:
        # Retrieve relevant documents
        docs = await self.vector_store.search(question, {"tenant_id": tenant_id})
        
        # Generate response with context
        context = "\n".join([doc.content for doc in docs])
        return await self.llm.generate(question, context)
```

## Lessons Learned

### 1. Hybrid Search is Essential

Pure semantic search often misses important keywords. Combining dense vectors with lexical search (BM25) significantly improves recall:

```python
def hybrid_search(query: str, dense_results: List[Doc], lexical_results: List[Doc]):
    # Combine and re-rank results
    combined = merge_results(dense_results, lexical_results)
    return rerank(combined, query)
```

### 2. Validation is Critical

We built AI Truth Guard to validate LLM responses:
- Precision and recall measurement
- Tool selection validation
- Streaming results over SSE
- Async workflow execution

### 3. Multi-tenancy Requires Careful Design

Each tenant needs isolated vector stores and configurations:

```python
class TenantConfig:
    vector_store_config: Dict
    llm_provider: str
    embedding_model: str
    max_tokens: int
```

## Performance Optimizations

- **Caching** - Redis for frequent queries
- **Async Processing** - Celery for background tasks
- **Connection Pooling** - Efficient database connections
- **Batch Operations** - Bulk document processing

## Monitoring and Observability

- **Metrics** - Query latency, accuracy, token usage
- **Logging** - Structured logging with correlation IDs
- **Tracing** - Distributed tracing for complex workflows
- **Alerting** - Proactive issue detection

## Next Steps

The RAG platform is now serving multiple departments with high reliability. Future improvements include:

- Advanced reranking models
- Multi-modal document support
- Real-time learning from user feedback
- Cross-tenant knowledge sharing

*What challenges have you faced building RAG systems? I'd love to hear about your experiences.*