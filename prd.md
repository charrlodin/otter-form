
You are an expert full-stack engineer and product architect.

Build a production-ready, open-source web application called **OtterForm**.

## High-Level Product Description

OtterForm is an AI-assisted form builder.

Instead of dragging form fields around manually, users describe what they want in plain English (like chatting with ChatGPT), and the system:

- Generates a full form (questions, types, validation)
- Assigns it a unique public URL
- Renders it in a clean, Typeform-like layout for respondents
- Tracks views, starts, completions, and responses
- Allows the creator to edit questions dynamically **without changing the share link**
- Supports security features: password protection, optional expiry, and file uploads

OtterForm is:

- Web-based
- Open-source
- Free to use in its core
- AI is **BYOK (Bring Your Own Key)** – the app uses a generic LLM interface and expects the deployer to provide API keys via environment variables.

---

## Tech Stack

Use:

- **Next.js 14+** (App Router, TypeScript)
- **Tailwind CSS** for styling
- **Convex** for backend data and business logic
- **Clerk** for authentication (form owners / dashboards)
- **BYOK LLM integration**:
  - Use environment variables for the model provider and API key (e.g. OpenAI, Anthropic, etc.)
  - Example env:
    - `LLM_PROVIDER` (e.g. "openai")
    - `LLM_API_KEY`
  - The app itself should not hard-code any paid model; it just calls a generic LLM client that reads env config.

---

## Core Concepts

### Entities

Define at least these core entities in Convex:

1. **User**
   - `id` (Clerk user ID)
   - Basic profile fields if needed (email, name, createdAt)

2. **Form**
   - `_id`
   - `ownerId` (User id or null if anonymous mode is ever allowed)
   - `title`
   - `description`
   - `slug` or short public id for URL (e.g. `formOtter.com/f/abcd123`)
   - `schema` (JSON describing questions, types, validation, order)
   - `aiPromptContext` (the original natural language brief from the user)
   - `isActive` (boolean)
   - `requiresPassword` (boolean)
   - `passwordHash` (nullable)
   - `expiresAt` (nullable; if set, form cannot be submitted after this date)
   - `createdAt`
   - `updatedAt`

3. **FormResponse**
   - `_id`
   - `formId`
   - `submittedAt`
   - `answers` (JSON blob keyed by question id)
   - `metadata` (optional: user agent, ipHash, etc.)

4. **FormStats / View Events**
   - Either a separate collection for events, or aggregate fields on the Form:
     - `viewCount`
     - `startCount`
     - `submissionCount`

5. **FileUpload**
   - `_id`
   - `formId`
   - `responseId` (nullable until finalised)
   - `fieldId` (question id that requested the file)
   - `storageKey` (path in object storage)
   - `fileName`
   - `fileSize`
   - `mimeType`
   - `createdAt`

---

## AI / LLM Integration (BYOK)

- Implement a thin abstraction layer for the LLM:

  - `lib/llmClient.ts` or similar, with something like:

    - `generateFormStructure(prompt: string): Promise<FormSchema>`
    - `updateFormStructure(existingSchema, instruction: string): Promise<FormSchema>`

- `FormSchema` should be a strongly-typed JSON shape, for example:

  ```ts
  type FormFieldType = "short_text" | "long_text" | "email" | "multiple_choice" | "checkbox" | "dropdown" | "file_upload" | "number" | "rating";

  interface FormField {
    id: string;
    label: string;
    type: FormFieldType;
    required: boolean;
    options?: string[];           // for multiple_choice, dropdown, checkbox
    placeholder?: string;
    helpText?: string;
  }

  interface FormSchema {
    title: string;
    description?: string;
    fields: FormField[];
  }

	•	The LLM is responsible for returning a valid FormSchema based on the user description and any editing instructions.
	•	The model should be configurable via env:
	•	LLM_PROVIDER (e.g. “openai”)
	•	LLM_API_KEY
	•	LLM_MODEL (e.g. “gpt-4o-mini” or any other string)
	•	Assume the deployer must supply these values. If they are missing, the app should gracefully show a message in the UI:
“AI form generation is not configured. Please set LLM_API_KEY and related env vars.”
	•	Never log or expose the raw API key on the client. Calls to the LLM should happen server-side (e.g. in Route Handlers or Convex functions).

⸻

App Flow

1. Auth & Dashboard (form owners)

Use Clerk:
	•	Set up Clerk provider in app/layout.tsx and middleware.
	•	Require authentication for:
	•	Accessing /dashboard
	•	Creating and managing forms
	•	Viewing responses

2. Creating a Form (Chat-based Builder)

Route: /dashboard and /dashboard/forms/[id]

Workflow:
	1.	User logs in and lands on /dashboard.
	•	They see a list of their existing forms (title, createdAt, response count).
	2.	They click “Create New Form”.
	•	Redirect to /dashboard/new or open a modal.
	3.	At the top, show a chat-style interface:
	•	System prompts user:
“Describe the form you want to build. Who is it for, and what information do you need to collect?”
	•	User types something like:
“I want a feedback form for my SaaS. It should collect name, email, role, satisfaction from 1–5, and an open comment.”
	4.	On submit:
	•	Call a backend API (Next.js Route Handler or Convex action) that:
	•	Builds an LLM prompt with clear instructions:
	•	“You are a form builder assistant. Return a JSON object matching FormSchema…”
	•	Calls the LLM using the BYOK credentials.
	•	Validates and parses the result into FormSchema.
	•	Creates a Form record in Convex with:
	•	ownerId
	•	schema (JSON)
	•	title (from schema)
	•	aiPromptContext (original user description)
	•	isActive = true
	•	expiresAt = null by default
	5.	Show a live preview panel of the generated form next to the chat (or below on mobile):
	•	Render fields from FormSchema.
	•	Allow in-place editing (e.g. click a field to edit label, required toggle, options).
	6.	Provide chat-based refinement:
	•	Example: user types:
“Make the tone more friendly and add a question about how they discovered us.”
	•	Backend:
	•	Sends existing FormSchema + the user instruction to the LLM.
	•	LLM returns updated FormSchema.
	•	Update the form in Convex.
	•	Re-render preview.

3. Form Settings & Sharing

In the Form edit page (/dashboard/forms/[id]), include:
	•	Basic settings:
	•	Form title
	•	Description
	•	Slug / public URL (readonly, generated)
	•	Status: active / inactive
	•	Expiry:
	•	No expiry (default)
	•	Specific date/time (e.g. datepicker)
	•	Max responses:
	•	Unlimited (default)
	•	Or integer cap (e.g. 100 responses)
	•	Security:
	•	Toggle: “Password protect this form”
	•	If enabled, show password input and store passwordHash in Convex.
	•	Optional future feature: encryption mode.
	•	File upload toggle:
	•	Allow file upload fields in schema.
	•	For any file_upload field, ensure storage + size limits are respected.
	•	Sharing:
	•	Show the public link (e.g. https://yourdomain.com/f/{slugOrId})
	•	“Copy link” button.

When the form is saved, update metadata in Convex.

4. Public Form View (Respondents)

Route: /f/[slugOrId]

Behavior:
	•	When a visitor opens this URL:
	•	Fetch form via Convex getPublicForm:
	•	Check isActive
	•	Check expiresAt (if set)
	•	If expired or inactive → show “This form is no longer accepting responses.”
	•	If requiresPassword:
	•	Ask for password first:
	•	On submit, validate via Convex mutation (compare hash).
	•	Set a session cookie or local state so they don’t need to re-enter password on every page refresh.
	•	Track viewCount:
	•	On first load, increment viewCount for that form.
	•	Show the form in a Typeform-like, single-column layout:
	•	Step-by-step or single-page (your choice, but at least mobile-friendly).
	•	Support all field types from FormSchema.
	•	When visitor focuses on first field or starts typing:
	•	Optionally increment startCount (only once per session / IP for that visit).
	•	On submit:
	•	Validate required fields.
	•	For any file upload fields:
	•	Upload files to S3-compatible storage first.
	•	Store FileUpload records with responseId (once created).
	•	Create FormResponse entry in Convex.
	•	After submission:
	•	Show a thank-you screen:
	•	Optionally use a form-defined “Thank you message” if in schema.
	•	Increment submissionCount.

5. Responses & Analytics (Creator Dashboard)

In /dashboard/forms/[id], add:
	•	Summary panel:
	•	Views
	•	Starts
	•	Submissions
	•	Completion rate = submissions / starts
	•	CreatedAt, ExpiresAt
	•	Responses tab:
	•	Table view:
	•	One row per response
	•	Columns:
	•	Submission date/time
	•	Possibly a summary (e.g. first answer, rating)
	•	Row click opens response detail:
	•	All answers, field by field
	•	Links to download any uploaded files
	•	Export:
	•	“Export CSV” button
	•	Backend builds CSV from FormResponse answers.

⸻

File Uploads
	•	Use an S3-compatible storage, same as Owlghost style:
	•	Env vars:
	•	STORAGE_ENDPOINT
	•	STORAGE_REGION
	•	STORAGE_BUCKET
	•	STORAGE_ACCESS_KEY
	•	STORAGE_SECRET_KEY
	•	For file_upload fields:
	•	Use a similar pre-signed URL flow:
	•	Convex generates a pre-signed upload URL for each file.
	•	Client uploads file directly from browser.
	•	After successful upload, store FileUpload record with storageKey and assign to a response on final submit.
	•	Just like before, don’t stream large files directly through the Next.js server.

⸻

Convex Functions Summary

Implement these categories of functions:

For Forms
	•	createFormFromDescription({ description })
	•	Auth required.
	•	Calls LLM to generate FormSchema.
	•	Creates Form in Convex.
	•	Returns form id + schema.
	•	refineFormWithInstruction({ formId, instruction })
	•	Auth required.
	•	Grabs existing FormSchema.
	•	Calls LLM with “update” prompt.
	•	Stores new FormSchema.
	•	Returns updated schema.
	•	updateFormSettings({ formId, updates })
	•	Auth required, owner only.
	•	Updates title, expiry, password, etc.
	•	getUserForms()
	•	List of forms for current user with summary stats.
	•	getFormForOwner({ formId })
	•	Detailed form config + stats + maybe some aggregated response info.

For Public Respondents
	•	getPublicForm({ slugOrId })
	•	Returns public-safe form schema + metadata (no sensitive internals).
	•	Marks a view (with simple dedupe logic if needed).
	•	verifyFormPassword({ formId, password })
	•	Check hash.
	•	Used by public form page.
	•	submitFormResponse({ formId, answers, fileRefs })
	•	Validate that form is active & not expired.
	•	Save FormResponse.
	•	Link any FileUpload entries.
	•	Increment submission count.

For Analytics
	•	incrementViewCount({ formId })
	•	incrementStartCount({ formId })
	•	getFormResponses({ formId, pagination })
	•	exportFormResponsesCsv({ formId }) (return a CSV-generating URL or raw CSV)

⸻

UI & Styling (Tailwind)

Goals:
	•	Clean, modern, focus on readability.
	•	Two main experiences:
	1.	Builder / dashboard UI
	2.	Public form filling UI

Builder UI
	•	Left panel: Chat + settings
	•	Right panel: Live form preview
	•	Responsive: on mobile, stack chat above preview.

Public Form UI
	•	Centered, single-column layout.
	•	Progress indicator (e.g. “Question 2 of 5”) is optional but nice.
	•	Big, friendly buttons / inputs.
	•	File upload fields clearly marked.

Colors:
	•	Soft background
	•	Accent color for primary buttons
	•	Use Tailwind with sensible defaults.

⸻

BYOK Details
	•	Do not hard-code any model vendor beyond an interface.
	•	Use env variables:
	•	LLM_PROVIDER (e.g. “openai”)
	•	LLM_API_KEY
	•	LLM_MODEL
	•	Implement at least one provider (e.g. OpenAI) as an example:
	•	If LLM_PROVIDER = "openai", use their REST API.
	•	If future contributors want Anthropic, they can add a branch.
	•	If no LLM_API_KEY is present, disable the chat-creation features and show a warning in the UI.

⸻

Non-Functional Requirements
	•	Use TypeScript everywhere (Next.js + Convex + utilities).
	•	Handle error states:
	•	LLM failure → show graceful error, allow retry.
	•	Invalid schema from LLM → fall back with a user-visible error message.
	•	Ensure no sensitive secrets (API keys, password hashes) ever leak to the client.
	•	Make the whole repository open-source with a permissive license (MIT or Apache 2.0).
	•	Include a solid README explaining:
	•	What FormOtter is
	•	Features
	•	BYOK requirement for AI
	•	Setup steps:
	•	npm install
	•	Configure Clerk
	•	Configure Convex
	•	Configure storage
	•	Set LLM_* env vars
	•	How to deploy to Vercel + Convex.

⸻

Deliverables

Produce:
	1.	A Next.js App Router project with:
	•	/dashboard, /dashboard/forms/[id], /f/[slugOrId], etc.
	2.	Convex schema and functions for forms, responses, stats, and file uploads.
	3.	LLM integration layer that uses BYOK (env-configured).
	4.	Tailwind-styled UI for:
	•	Chat-based form creation
	•	Live preview
	•	Public form experience
	•	Responses dashboard
	5.	Documentation & config for open-source deployment.

Make the architecture clean, composable, and easy to evolve.

---
