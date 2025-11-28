import { defaultApiEndpoint } from './globals.js';

export const fetchModels = async (apiKey, apiEndpoint = defaultApiEndpoint) => {
    const baseUrl = apiEndpoint.replace(/\/+$/, '');
    const response = await fetch(`${baseUrl}/v1/models`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
        },
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
};

export const fetchResponse = async (apiKey, model, messages, maxTokens, apiEndpoint = defaultApiEndpoint) => {
    const baseUrl = apiEndpoint.replace(/\/+$/, '');
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model,
            messages: messages,
            ...(maxTokens > 0 ? { 'max_tokens': parseInt(maxTokens) } : {})
        }),
    });

    if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(`API request failed: ${response.status}, Detail: ${errorDetail}`);
    }


    const responseData = await response.json();
    return responseData.choices[0].message.content;
}
