# OtterForm 🦦

**Build beautiful forms in seconds with AI.**

OtterForm is an open-source, AI-powered form builder that allows you to generate forms through natural language conversation. It features a polished, Typeform-style runner, real-time analytics, and a seamless dashboard for managing your forms.

**Live Demo:** [otterform.xyz](https://otterform.xyz)

## Features

### 🤖 AI Form Builder
- **Conversational Interface**: Chat with the AI to build and modify your forms.
- **Real-time Preview**: See your form evolve instantly as you chat.
- **Smart Schema Generation**: Automatically detects field types, options, and validation rules.
- **Chat Persistence**: Your conversation history is saved, allowing you to iterate over time.

### 🏃 Premium Form Runner
- **One-Question-at-a-Time**: Focus-driven interface similar to Typeform.
- **Keyboard Navigation**: Navigate with Enter and A/B/C keys for rapid data entry.
- **Smooth Animations**: Polished transitions and micro-interactions.
- **Mobile Responsive**: Works perfectly on all devices.

### 📊 Dashboard & Analytics
- **Form Management**: Create, edit, and delete forms.
- **Analytics**: Track views, starts, submissions, and completion rates.
- **Drop-off Analysis**: See where users are leaving your form.
- **Response Management**: View detailed responses in a modal or export to CSV.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database & Backend**: [Convex](https://convex.dev/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Styling**: Tailwind CSS, Framer Motion, GSAP
- **AI**: OpenAI (via Convex Actions)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Convex Account
- Clerk Account
- OpenAI API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/otter-form.git
    cd otter-form
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file:
    ```env
    # Convex
    CONVEX_DEPLOYMENT=dev:your-deployment-name
    NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

    # Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...

    # OpenAI (Set in Convex Dashboard or here if configured)
    OPENAI_API_KEY=sk-...
    ```

4.  **Run Convex**
    ```bash
    npx convex dev
    ```

5.  **Run the App**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: React components (Builder, Runner, Dashboard).
- `convex/`: Backend functions (Queries, Mutations, Actions) and schema.
- `public/`: Static assets (images, fonts).

## License

MIT

---

Built with ❤️ by [Your Name]
