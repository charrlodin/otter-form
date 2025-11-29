import { v } from "convex/values";
import { query } from "./_generated/server";

export const getFormResponses = query({
    args: { formId: v.id("forms") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }

        const form = await ctx.db.get(args.formId);
        if (!form || form.ownerId !== identity.subject) {
            throw new Error("Unauthorized");
        }

        const responses = await ctx.db
            .query("responses")
            .withIndex("by_form", (q) => q.eq("formId", args.formId))
            .order("desc")
            .collect();

        return responses;
    },
});

export const getFormStats = query({
    args: { formId: v.id("forms") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }

        const form = await ctx.db.get(args.formId);
        if (!form || form.ownerId !== identity.subject) {
            throw new Error("Unauthorized");
        }

        const responses = await ctx.db
            .query("responses")
            .withIndex("by_form", (q) => q.eq("formId", args.formId))
            .collect();

        const submissionCount = responses.length;
        const viewCount = form.viewCount || 0;
        const completionRate = viewCount > 0 ? (submissionCount / viewCount) * 100 : 0;

        return {
            viewCount,
            submissionCount,
            completionRate: Math.round(completionRate * 10) / 10, // Round to 1 decimal
        };
    },
});
