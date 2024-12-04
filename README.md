# Svelte - Shadcn - Convex - Vi - Test - Bun Template ⚙️

This project template is designed to help developers of all levels efficiently build web applications using modern technologies such as TypeScript, testing frameworks, and data management solutions.

## Key Features 🚀

### Framework

- **SvelteKit with TypeScript**: ⚡️ Optimized for streamlined workflow, performance, and type safety, ensuring a robust development experience.

### Package Manager

- **Bun**: 🥜 A fast and efficient dependency manager that outperforms traditional tools like npm and Yarn. [Bun Documentation](https://bun.sh/docs)

### Code Quality Tools

- **Prettier**: 📏 Ensures consistent code formatting to improve readability and maintainability.
- **ESLint**: ✉️ Provides static code analysis to help maintain high code quality.

### Module Aliasing

- 📝 Simplifies imports using aliases, such as `$ui: 'src/lib/components/ui'`, making the codebase easier to navigate and manage.

### Testing Framework 💻

- **Vitest**: ✅ Comprehensive unit and integration testing for validating critical logic and API interactions. [Vitest Documentation](https://vitest.dev/)
- **Svelte Component Testing**: 🔖 Uses the Svelte Testing Library to validate UI components effectively. [Svelte Testing Library Documentation](https://testing-library.com/docs/svelte-testing-library/intro/)

### Data Management 📋

- **Convex**: 🚀 Provides a serverless backend for scalable data integration. [Convex Quickstart Guide](https://docs.convex.dev/quickstart/svelte)

### Styling 🌱

- **TailwindCSS v3**: 🛍️ A utility-first CSS framework for consistent, responsive, and easily maintainable styling. [TailwindCSS Installation Guide](https://tailwindcss.com/docs/installation)

### UI Components 🛠️

- **ShadCN Components**: 💄 Pre-built components such as buttons, modals, and cards that expedite UI development. [ShadCN-Svelte Documentation](https://shadcn.dev/docs/svelte)

### Schema Validation 🔨

- **Zod**: 🏦 Ensures type-safe schema validation to maintain data integrity throughout the application.

### Server-Side Functionality 🛡️

- 🔒 Supports secure server-side operations, including API key management and user authentication.
- 🛠 Modular routing for improved scalability and organization.

## Setup Instructions 🔧

### Add OpenAI API Key 🛡️

If your application uses AI-driven features, add your OpenAI API key to the `.env` file.

### Install Dependencies 🚀

To install project dependencies, run:

```bash
bun install
```

### Start Convex Environment 💻

To start the Convex development environment, run:

```bash
bun x convex dev
```

1. Log in with your GitHub credentials if prompted.
2. Move `PUBLIC_CONVEX_URL` from `.env.local` to `.env`.

### Initialize Database (Optional) 💾

To initialize the database with sample data, run:

The sample data includes tasks for a to-do list application, useful for experimenting with querying, updating, and managing tasks.

```bash
echo '{"text": "Buy groceries", "isCompleted": true}
{"text": "Go for a swim", "isCompleted": true}
{"text": "Integrate Convex", "isCompleted": false}' > sampleData.jsonl

bun x convex import --table tasks sampleData.jsonl
```

### ShadCN Theme 🌱

Replace your existing `@layer base` in your `app.css` with the code copied from the [ShadCN theming page](https://next.shadcn-svelte.com/themes):

```css
@layer base {
	/* ...copied variables... */
}
```

### Start Development Server 🚀

To start the development server and open the application in your browser, run:

```bash
bun dev --open
```

## Adding a ShadCN Component 🛠️

To add a new UI component using the ShadCN CLI, run:

```bash
bun x shadcn-svelte@next add
```

For example, you can add a card component to display grouped content, such as product details or user profiles.
