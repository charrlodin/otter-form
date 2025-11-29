import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  forms: defineTable({
    ownerId: v.string(), // Clerk user ID
    title: v.string(),
    description: v.optional(v.string()),
    slug: v.string(),
    schema: v.any(), // JSON object for form fields
    aiPromptContext: v.optional(v.string()),
    isActive: v.boolean(),
    requiresPassword: v.boolean(),
    passwordHash: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    settings: v.optional(v.any()), // Extra settings
    generationSettings: v.optional(v.any()), // AI model info
    createdAt: v.number(),
    updatedAt: v.number(),
    viewCount: v.number(),
    startCount: v.number(),
    submissionCount: v.number(),
    chatHistory: v.optional(v.array(v.object({
      role: v.union(v.literal("user"), v.literal("assistant")),
      content: v.string(),
    }))),
  })
    .index("by_owner", ["ownerId"])
    .index("by_slug", ["slug"]),

  responses: defineTable({
    formId: v.id("forms"),
    answers: v.any(), // JSON object keyed by field ID
    metadata: v.optional(v.any()), // User agent, etc.
    submittedAt: v.number(),
  }).index("by_form", ["formId"]),

  file_uploads: defineTable({
    formId: v.id("forms"),
    responseId: v.optional(v.id("responses")),
    fieldId: v.string(),
    storageKey: v.string(),
    fileName: v.string(),
    fileSize: v.number(),
    mimeType: v.string(),
    createdAt: v.number(),
  }).index("by_form", ["formId"]),
});
