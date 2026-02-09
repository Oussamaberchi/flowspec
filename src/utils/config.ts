export interface SpecFlowConfig {
    apiKey?: string;
    theme?: string;
    aiModel?: string;
}

export const defaultConfig: SpecFlowConfig = {
    theme: "default",
    aiModel: "gemini-3-pro"
};
