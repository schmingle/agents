# Intro

This repo contains examples to accompany my article on how to build agents from scratch. Give it a read if you haven't already!

- [How to build an agent from scratch - Part 1](https://testinprod.substack.com/p/a-practical-look-at-developing-agents)
- [How to build an agent from scratch - Part 2](https://open.substack.com/pub/testinprod/p/how-to-build-an-agent-from-scratch)

# Setup

Get a Gemini API key:

https://ai.google.dev/gemini-api/docs/api-key

Run this in your terminal (in the project root):

```
npm install
echo "GOOGLE_GENERATIVE_AI_API_KEY=YOUR_API_KEY" > .env
```

If you want to use a different provider, just check out the [Vercel docs](https://ai-sdk.dev/docs/introduction) for the env var name you need to set and update the code with the model you want.

```
import { google } from "@ai-sdk/google"; // Edit this

export abstract class Agent {
  ...
  get model() {
    return google("gemini-2.0-flash-lite"); // Edit this
  }
```

# Run Examples

General agent
- message stream processing

```
npm run general -- "What is the capital of France?"
```

Tool-calling agent
- has multiple tools it can call (i.e. external knowledge)

```
npm run tools -- "How's the weather in Paris?"
```

Chat agent
- streams responses (i.e. real-time)
- loads prior history (i.e. stateful)

```
npm run chat -- "Suggest some activities for this weekend"
```

Routing agent
- routes to multiple agents (i.e. coordinated basic)

```
npm run router -- "Write a comedy story about cats and dogs in under 100 words"
```

Coordinated agent
- coordinator agent using multiple agents (i.e. coordinated advanced)

```
npm run coordinated -- "How should I plan for the thunderstorm predicted this weekend?"
```
