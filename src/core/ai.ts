export interface AIModel {
    name: string;
    generate(prompt: string): Promise<string>;
}

export class MockAI implements AIModel {
    name: string;
    constructor(name: string) {
        this.name = name;
    }

    async generate(prompt: string): Promise<string> {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(`[${this.name}] Generated response based on: ${prompt.substring(0, 50)}...`);
            }, 1000);
        });
    }
}

export const getAIModel = (task: "init" | "parse" | "design" | "implement" | "verify" | "secure"): AIModel => {
    switch (task) {
        case "init": return new MockAI("Gemini 3 Pro");
        case "parse": return new MockAI("GLM 4.7");
        case "design": return new MockAI("Kimi K2.5");
        case "implement": return new MockAI("Smart Routing"); // simplified
        case "verify": return new MockAI("Minimax M2.1");
        case "secure": return new MockAI("Gemini 3 Pro");
        default: return new MockAI("Generic AI");
    }
};
