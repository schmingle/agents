import { google } from "@ai-sdk/google";

export abstract class Agent {
	get model() {
		return google("gemini-2.0-flash-001");
	}

	abstract get system(): string;
}
