import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const submitResponse = mutation({
    args: {
        formId: v.id("forms"),
        answers: v.any(), // JSON object of answers
        metadata: v.optional(v.any()), // Browser info, etc.
    },
    handler: async (ctx, args) => {
        const form = await ctx.db.get(args.formId);
        if (!form) {
            throw new Error("Form not found");
        }

        if (!form.isActive) {
            throw new Error("Form is no longer active");
        }

        // Record the response
        const responseId = await ctx.db.insert("responses", {
            formId: args.formId,
            answers: args.answers,
            metadata: args.metadata,
            submittedAt: Date.now(),
        });

        // Update form stats
        await ctx.db.patch(args.formId, {
            submissionCount: (form.submissionCount || 0) + 1,
        });

        return responseId;
    },
});
