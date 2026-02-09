export interface ParseResult {
    valid: boolean;
    errors: string[];
    suggestions: string[];
}

const EARS_PATTERNS = [
    /^(while|when|where|if)\s.+,\s(the|calculate)\s.+\s(shall)\s.+/i,
    /^the\s.+\sshall\s.+/i
];

export const parseEARS = (line: string): ParseResult => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("-")) return { valid: true, errors: [], suggestions: [] };

    const match = EARS_PATTERNS.some(p => p.test(trimmed));
    if (match) {
        return { valid: true, errors: [], suggestions: [] };
    } else {
        return {
            valid: false,
            errors: ["Line does not match EARS template pattern."],
            suggestions: [
                "Use 'When <trigger>, the <system> shall <action>'",
                "Use 'While <precondition>, the <system> shall <action>'",
                "Use 'The <system> shall <action>'"
            ]
        };
    }
};
