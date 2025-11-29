export interface LLMConfig {
    apiKey: string;
    baseURL?: string;
    model: string;
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
        const error = await response.text();
        throw new Error(`LLM API Error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}
