# Setup

Get a Gemini API key:

https://ai.google.dev/gemini-api/docs/api-key

Run this in your terminal:

```
npm install
echo "GEMINI_API_KEY=YOUR_API_KEY" > .env
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

```
npm run general -- "What is the capital of France?"
```

Tool-calling agent

```
npm run tools -- "How's the weather in Paris?"
```

Routing agent
```
npm run router -- "Write a comedy story about cats and dogs in under 100 words"
```
