import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new form
export const createForm = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        schema: v.any(),
        aiPromptContext: v.optional(v.string()),
        generationSettings: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }

        // Generate a simple slug (in production, use a better ID generator)
        const slug = Math.random().toString(36).substring(2, 10);

        const formId = await ctx.db.insert("forms", {
            ownerId: identity.subject,
            title: args.title,
            description: args.description,
            slug,
            schema: args.schema,
            aiPromptContext: args.aiPromptContext,
            isActive: true,
            requiresPassword: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            viewCount: 0,
            startCount: 0,
            submissionCount: 0,
            generationSettings: args.generationSettings,
        });

        return { formId, slug };
    },
});

// Get a form by ID (for dashboard)
export const getForm = query({
    args: { formId: v.id("forms") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }

        const form = await ctx.db.get(args.formId);
        if (!form) return null;

        if (form.ownerId !== identity.subject) {
            throw new Error("Unauthorized");
        }

        return form;
    },
});

// Get all forms for the current user
export const getMyForms = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }

        return await ctx.db
            .query("forms")
            .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
            .order("desc")
            .collect();
    },
});

// Get public form by slug
export const getFormBySlug = query({
    args: { slug: v.string(), password: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const form = await ctx.db
            .query("forms")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();

        if (!form) return null;

        // If password is required
        if (form.requiresPassword) {
            if (form.passwordHash !== args.password) {
                return {
                    ...form,
                    schema: null, // Hide schema
                    isLocked: true
                };
            }
        }

        return { ...form, isLocked: false };
    },
});

// Update form settings/schema
export const updateForm = mutation({
    args: {
        formId: v.id("forms"),
        updates: v.object({
            title: v.optional(v.string()),
            description: v.optional(v.string()),
            schema: v.optional(v.any()),
            isActive: v.optional(v.boolean()),
            requiresPassword: v.optional(v.boolean()),
            passwordHash: v.optional(v.string()),
            expiresAt: v.optional(v.number()),

            generationSettings: v.optional(v.any()),
            chatHistory: v.optional(v.array(v.object({
                role: v.union(v.literal("user"), v.literal("assistant")),
                content: v.string(),
            }))),
        }),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }

        const form = await ctx.db.get(args.formId);
        if (!form || form.ownerId !== identity.subject) {
            throw new Error("Unauthorized");
        }

        await ctx.db.patch(args.formId, {
            ...args.updates,
            updatedAt: Date.now(),
        });
    },
});

export const incrementViewCount = mutation({
    args: { formId: v.id("forms") },
    handler: async (ctx, args) => {
        const form = await ctx.db.get(args.formId);
        if (!form) return;

        await ctx.db.patch(args.formId, {
            viewCount: (form.viewCount || 0) + 1,
        });
    },
});

export const deleteForm = mutation({
    args: { formId: v.id("forms") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const form = await ctx.db.get(args.formId);
        if (!form || form.ownerId !== identity.subject) {
            throw new Error("Unauthorized");
        }

        // Delete all responses associated with this form
        const responses = await ctx.db
            .query("responses")
            .withIndex("by_form", (q) => q.eq("formId", args.formId))
            .collect();

        for (const response of responses) {
            await ctx.db.delete(response._id);
        }

        // Delete the form itself
        await ctx.db.delete(args.formId);
    },
});
