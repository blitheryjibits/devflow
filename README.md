"Based on your requirements for an 
**open-source LLM harness**, 
support for a **wide range of models**, 
**dynamic agentic workflows** with agent-swapping based on quotas, 
and built-in **token/spending limits**, here is the best recommendation for 2026.

### 🏆 Top Recommendation: LangGraph (with LangChain Ecosystem)
For complex, dynamic agentic workflows where agents need to swap out seamlessly based on runtime conditions (like quotas), **LangGraph** (built on top of LangChain) stands out as the leading open-source harness in 2026. 

While frameworks like CrewAI and AutoGen are great for static multi-agent teams, LangGraph provides the low-level cyclic graph control necessary for dynamic routing and conditional agent hand-offs.
### Key Features Matching Your Requirements
#### 1. Dynamic Agentic Workflows & Swapping
LangGraph models agent workflows as state machines (graphs). You can define conditional edges that evaluate the current state (e.g., token usage, API limits, or task completion) and dynamically route the task to a completely different agent.

```py
from langgraph.graph import StateGraph, END 
# Define the state containing usage metrics
class AgentState(dict):
 messages: list
     token_count: int
         budget_spent: float
         
         def should_swap_agent(state: AgentState):
             # Check if budget or token quota is met
                 if state["budget_spent"] > 0.50 or state["token_count"] > 10000:
                         return "budget_exhausted_agent"
                             return "standard_agent"
                             
                             workflow = StateGraph(AgentState)
                             workflow.add_conditional_edges("router", should_swap_agent, {
                                    "standard_agent": "worker_agent_a",
                                "budget_exhausted_agent": "lightweight_agent_b"
                                })
```
#### 2. Broad Model Support\nThrough the LangChain ecosystem, LangGraph is model-agnostic. You can instantly swap out underlying models from providers like OpenAI, Anthropic, Google (Gemini), Mistral, or local open-source weights running via Ollama or vLLM using a unified interface:
```py
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
# Easily swap models within your agents
cheap_model = ChatOpenAI(model="gpt-4o-mini")
premium_model = ChatAnthropic(model="claude-3-5-sonnet")

```

#### 3. Token & Spending Limits
While LLM harnesses manage the execution flow, budget and token limits are typically enforced via **LLM Gateways** or callback handlers integrated into the harness. 
In 2026, the best practice is to pair LangGraph with an open-source proxy/gateway like **LiteLLM Proxy** or use LangChain's built-in `get_openai_callback()` / custom tracking handlers to halt execution when spending caps are reached.\n\n---\n\n### Alternative Options to Consider
*   **CrewAI (Enterprise/Open Source):** Better out-of-the-box templates for role-playing multi-agent teams, but less flexible than LangGraph if you need deeply customized, dynamic runtime agent-swapping based on strict financial quotas.
*   **Semantic Kernel (Microsoft):** Excellent enterprise backing and robust telemetry/budget tracking, but historically leans heavier toward structured C#/Python enterprise apps rather than fluid, cyclic agent graphs.

                             ### Summary
                             To build your dynamic, multi-model, budget-constrained agentic workflow, use **LangGraph** for the orchestration harness, paired with **LiteLLM** to centrally enforce strict token and spending limits across your wide range of models."