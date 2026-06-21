A row in the Live Activity Timeline — the agent's chain-of-work, streamed. Each agent has its own icon + accent color on the left rule.

```jsx
<AgentTimelineRow agent="orchestrator" label="Planning 5 steps…" status="ok" time="0.4s" />
<AgentTimelineRow agent="search" label="semantic search 'craftsman, cafés' … 41 hits" status="ok" />
<AgentTimelineRow agent="market" label="Pulling comps & Zestimate deltas…" status="running" model="Groq · llama-3.3" cost="$0.012" />
```

Agents: orchestrator / search / market / finance / concierge. Needs `@keyframes az-spin` in the page for the running spinner.
