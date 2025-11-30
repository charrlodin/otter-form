"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { chatCompletion, LLMError } from "./lib/llm";
import { FormSchema } from "./types";
import { api } from "./_generated/api";

const SYSTEM_PROMPT = `
You are an expert form builder AI. Your goal is to help the user create the perfect form.
You should act as a consultant: ask probing questions to understand their specific needs, audience, and goals before generating the full form.
Don't just immediately generate a schema unless the user's request is very simple or they explicitly ask for it.

When you do generate or update the form, you must strictly follow this TypeScript interface for the schema:

type FormFieldType = "short_text" | "long_text" | "email" | "multiple_choice" | "checkbox" | "dropdown" | "number" | "rating" | "file_upload";

interface FormField {
  id: string; // unique generic id like "field_1", "field_2"
  label: string;
  type: FormFieldType;
  required: boolean;
  options?: string[]; // required for multiple_choice, dropdown, checkbox
  placeholder?: string;
  helpText?: string;
  maxRating?: number; // for rating, default to 5 or 10 based on user request
}

interface FormSchema {
  title: string;
  description?: string;
  fields: FormField[];
}

You must ALWAYS return a JSON object with this structure:
{
  "message": "Your conversational response to the user...",
  "schema": { ...FormSchema object... } // OPTIONAL: Only include this if you are creating or updating the form.
}

IMPORTANT RULES:
1. Unless the user explicitly asks NOT to, ALWAYS include a "Name" (short_text) and "Email" (email) field at the beginning of the form.
2. Do not include markdown formatting like \`\`\`json. Return ONLY the raw JSON object.
`;

export const generateFormSchema = action({
    args: {
        prompt: v.string(),
        currentSchema: v.optional(v.any()), // For refinement
        formId: v.id("forms"),
        apiKey: v.optional(v.string()),
        model: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }

        // 1. Get Config (User provided > Env fallback)
        const apiKey = args.apiKey || process.env.LLM_API_KEY;
        const baseURL = process.env.LLM_BASE_URL || "https://openrouter.ai/api/v1"; // Default to OpenRouter if not set
        const model = args.model || process.env.LLM_MODEL || "openai/gpt-4o";

        if (!apiKey) {
            throw new Error("API Key is required. Please configure it in the settings.");
        }

        // 2. Construct Messages
        const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
            { role: "system", content: SYSTEM_PROMPT },
        ];

        if (args.currentSchema) {
            messages.push({
                role: "assistant",
                content: JSON.stringify({
                    message: "Here is the current form schema.",
                    schema: args.currentSchema
                }),
            });
            messages.push({
                role: "user",
                content: `Refine the form or answer my question: ${args.prompt}`,
            });
        } else {
            messages.push({
                role: "user",
                content: `I want to build a form. ${args.prompt}`,
            });
        }

        // 3. Call LLM
        try {
            const jsonString = await chatCompletion(messages, { apiKey, baseURL, model });
            const response = JSON.parse(jsonString);

            // 4. Update Form in DB via Mutation IF schema is present
            if (response.schema) {
                await ctx.runMutation(api.forms.updateForm, {
                    formId: args.formId,
                    updates: {
                        schema: response.schema,
                        title: response.schema.title,
                        description: response.schema.description,
                    },
                });
            }

            return {
                message: response.message,
                schema: response.schema
            };
        } catch (error) {
            console.error("AI Generation Failed:", error);
            if (error instanceof LLMError) {
                throw new Error(error.userMessage);
            }
            throw new Error("Failed to generate response. Please try again.");
        }
    },
});
