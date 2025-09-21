---
title: "From Taxi Allocation to LLM Validation: My Journey in AI Engineering"
authors:
  - nilmonfort
categories:
  - AI Engineering
date: 2025-01-15
description: Reflecting on my journey from developing high-performance taxi allocation algorithms to building LLM validation systems, and the lessons learned along the way.
draft: false
slug: from-taxi-allocation-to-llm-validation-my-journey-in-ai-engineering
tags:
  - ai-engineering
  - career
  - algorithms
  - validation
image: ../images/ai-post-card.png
---

# From Taxi Allocation to LLM Validation: My Journey in AI Engineering

Looking back at my journey from developing taxi allocation algorithms to building LLM validation systems, I've learned that AI engineering is as much about solving real-world problems as it is about understanding the latest models and frameworks.

<!-- more -->

## The Beginning: Optimization Algorithms

My first major AI project was developing a high-performance taxi allocation algorithm at Avantcab. The challenge was simple: allocate taxis to customers in under 1 second while minimizing wait times and maximizing efficiency.

### The Technical Challenge

```python
class TaxiAllocator:
    def __init__(self):
        self.genetic_algorithm = GeneticOptimizer()
        self.greedy_algorithm = GreedyOptimizer()
        self.heuristic_algorithm = HeuristicOptimizer()
    
    def allocate(self, customers: List[Customer], taxis: List[Taxi]) -> List[Allocation]:
        # Try multiple approaches and select the best
        genetic_result = self.genetic_algorithm.optimize(customers, taxis)
        greedy_result = self.greedy_algorithm.optimize(customers, taxis)
        heuristic_result = self.heuristic_algorithm.optimize(customers, taxis)
        
        return self.select_best_allocation([genetic_result, greedy_result, heuristic_result])
```

### Key Lessons Learned

1. **Performance Matters** - Sub-second response times were non-negotiable
2. **Caching is Critical** - Redis caching reduced computation time by 80%
3. **Testing is Essential** - Comprehensive unit and integration tests prevented production issues
4. **Algorithms Over Models** - Sometimes traditional algorithms outperform ML models

## The Evolution: Machine Learning

From optimization, I moved to predictive modeling with flight delay prediction. This introduced me to the world of machine learning and the importance of bias reduction.

### Two-Stage Approach

```python
class FlightDelayPredictor:
    def __init__(self):
        self.classifier = XGBClassifier()  # Is flight delayed?
        self.regressor = XGBRegressor()    # How long is the delay?
    
    def predict(self, flight_data: FlightData) -> DelayPrediction:
        # Stage 1: Classification
        is_delayed = self.classifier.predict(flight_data)
        
        if is_delayed:
            # Stage 2: Regression
            delay_duration = self.regressor.predict(flight_data)
            return DelayPrediction(delayed=True, duration=delay_duration)
        
        return DelayPrediction(delayed=False, duration=0)
```

### Bias Reduction Techniques

- **Feature Engineering** - Removed temporal and geographical biases
- **Cross-Validation** - Stratified sampling across airlines and routes
- **Fairness Metrics** - Monitored prediction accuracy across different groups
- **Regular Retraining** - Updated models monthly to account for seasonal changes

## The Present: LLM Engineering

Now at Inditex, I'm working on the cutting edge of AI with RAG systems and LLM validation. The challenges are different but the principles remain the same.

### AI Truth Guard: LLM Validation

```python
class LLMValidator:
    def __init__(self):
        self.precision_metric = PrecisionCalculator()
        self.recall_metric = RecallCalculator()
        self.tool_validator = ToolSelectionValidator()
    
    async def validate(self, query: str, response: str, expected_tools: List[str]) -> ValidationResult:
        # Measure precision and recall
        precision = await self.precision_metric.calculate(query, response)
        recall = await self.recall_metric.calculate(query, response)
        
        # Validate tool selection
        tool_accuracy = await self.tool_validator.validate(response, expected_tools)
        
        return ValidationResult(
            precision=precision,
            recall=recall,
            tool_accuracy=tool_accuracy,
            overall_score=self.calculate_overall_score(precision, recall, tool_accuracy)
        )
```

## The Journey: Key Insights

### 1. Problem-Solving First, Technology Second

Whether it's genetic algorithms or transformer models, the goal is always solving a real problem. The technology is just a means to an end.

### 2. Performance is Non-Negotiable

From taxi allocation (<1s) to LLM validation (streaming), performance requirements shape the entire architecture.

### 3. Testing and Validation are Critical

- **Unit Tests** - For individual components
- **Integration Tests** - For system interactions
- **Performance Tests** - For latency and throughput
- **Bias Tests** - For fairness and accuracy

### 4. Architecture Matters

Clean architecture principles apply to AI systems just as much as traditional software:

```python
# Hexagonal Architecture for AI Systems
class AIService:
    def __init__(self, 
                 model_provider: ModelProvider,
                 data_store: DataStore,
                 validator: Validator):
        self.model_provider = model_provider
        self.data_store = data_store
        self.validator = validator
    
    async def process(self, input_data: InputData) -> OutputData:
        # Core business logic
        processed_data = await self.model_provider.process(input_data)
        validated_result = await self.validator.validate(processed_data)
        await self.data_store.store(validated_result)
        return validated_result
```

## The Future: What's Next?

The field is evolving rapidly, but some principles remain constant:

- **Focus on real problems** - Not just the latest models
- **Measure everything** - Performance, accuracy, bias, cost
- **Build for scale** - From day one
- **Stay curious** - The field changes fast, but fundamentals matter

## Resources That Shaped My Journey

- **Books**: "Hands-On Machine Learning" by Aurélien Géron
- **Courses**: DeepLearning.AI Specializations on Coursera
- **Practice**: Kaggle competitions and real-world projects
- **Community**: AI/ML meetups and conferences

*What's your AI engineering journey been like? I'd love to hear about the challenges you've faced and lessons you've learned.*

---

*The path from traditional algorithms to modern AI isn't linear, but each step builds on the previous one. Focus on solving problems, and the technology will follow.*
