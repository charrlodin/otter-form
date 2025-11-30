export interface LLMConfig {
    apiKey: string;
    baseURL?: string;
    model: string;
}

export class LLMError extends Error {
    code: number;
    userMessage: string;

    constructor(code: number, userMessage: string, originalMessage: string) {
        super(originalMessage);
        this.name = "LLMError";
        this.code = code;
        this.userMessage = userMessage;
    }
}

function parseOpenRouterError(status: number, errorText: string): LLMError {
    let errorData: { error?: { message?: string; code?: number } } = {};
    try {
        errorData = JSON.parse(errorText);
    } catch {
        // Not JSON, use raw text
    }

    const originalMessage = errorData?.error?.message || errorText;

    switch (status) {
        case 401:
            return new LLMError(
                401,
                "Invalid API key. Please check your OpenRouter API key in the settings and make sure it's correct.",
                originalMessage
            );
        case 402:
            return new LLMError(
                402,
                "Insufficient credits on your OpenRouter account. Please add credits at https://openrouter.ai/settings/credits to continue using AI features.",
                originalMessage
            );
        case 403:
            return new LLMError(
                403,
                "Access denied. Your API key may not have permission to use this model, or the model may require additional verification.",
                originalMessage
            );
        case 429:
            return new LLMError(
                429,
                "Rate limit exceeded. Please wait a moment and try again, or upgrade your OpenRouter plan for higher limits.",
                originalMessage
            );
        case 400:
            if (originalMessage.toLowerCase().includes("model")) {
                return new LLMError(
                    400,
                    `Model not available: The selected model may not exist or is temporarily unavailable. Try selecting a different model in settings.`,
                    originalMessage
                );
            }
            return new LLMError(
                400,
                "Invalid request. Please check your settings and try again.",
                originalMessage
            );
        case 500:
        case 502:
        case 503:
        case 504:
            return new LLMError(
                status,
                "The AI service is temporarily unavailable. Please try again in a few moments.",
                originalMessage
            );
        default:
            return new LLMError(
                status,
                `An unexpected error occurred (Error ${status}). Please try again or contact support if the issue persists.`,
                originalMessage
            );
    }
}

export async function chatCompletion(
    messages: { role: "system" | "user" | "assistant"; content: string }[],
    config: LLMConfig
) {
    const url = `${config.baseURL || "https://api.openai.com/v1"}/chat/completions`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiKey}`,
            // OpenRouter specific headers (optional but good practice)
            "HTTP-Referer": "https://otterform.com",
            "X-Title": "OtterForm",
        },
        body: JSON.stringify({
            model: config.model,
            messages,
            response_format: { type: "json_object" }, // Force JSON mode
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw parseOpenRouterError(response.status, errorText);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}
