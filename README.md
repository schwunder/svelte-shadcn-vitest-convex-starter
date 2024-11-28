# 🛠️ Comprehensive Guide to Setting Up a SvelteKit Project 🚀

📄 This document provides a guide for setting up a 🏗️ project using 🛠️ SvelteKit with 🌬️ Tailwind CSS, integrating 🧩 ShadCN components, and using 📦 Convex as the 🗄️ management system. It offers a detailed walkthrough for 👨‍💻 developers to correctly set up a robust and scalable project, outlining key command line 📝 essential for the setup.

## ⚙️ Project Setup Commands

The following 📝 will guide you through the initial stages of setting up your 🛠️ SvelteKit project.

This includes creating the project, configuring necessary 🛠️ tools and plugins, initializing version control, and pushing the project to a remote 🌐 GitHub 📦.

Each 📝 is explained for clarity, ensuring even those less familiar with the 💻 stack can follow along effectively.

### 1️⃣ Create a New 🛠️ SvelteKit Project

To start a new 🛠️ SvelteKit project, use the following 📝:

```sh
npx sv create [name]
```

Upon executing this 📝, you will be presented with the 🛠️ Svelte CLI setup interface, which will guide you through a series of prompts to customize your project:

````
┌ 👋 Welcome to the 🛠️ Svelte CLI (v0.6.4)

◇ Select the 🧩 you desire:
  - 🛠️ SvelteKit minimal

  You can choose the minimal 🧩 to start with a clean and simple setup, making it easier to extend based on your specific project requirements.

◇ ➕ type 🔍 with TypeScript?
  - ✅ Yes, using TypeScript syntax

  Enabling TypeScript is highly recommended for larger projects as it adds type safety, thereby reducing runtime 🐞 and enhancing maintainability. This setup uses TypeScript syntax to provide type annotations throughout your code.

◆ Project successfully created ✅

After completing these steps, your initial project setup will be ready. You should see a basic project structure, including folders like `src` for your components, `public` for static assets, and configuration files for SvelteKit, Tailwind CSS, and other tools.

◇ Choose the additional 🛠️ to include in your project: (🔽🔼 / ␣)
  - ✨ prettier, eslint, vitest, 🌬️ tailwindcss

  Adding these 🛠️ ensures a standardized and efficient workflow. ✨ Prettier helps in maintaining code style consistency, 🛡️ ESLint assists in identifying problematic patterns in JavaScript code, 🧪 Vitest provides a robust testing environment, and 🌬️ Tailwind CSS simplifies styling by offering utility-first CSS classes.

◇ 🌬️ Tailwind CSS: Select desired plugins:
  - 🖋️ typography, 📝 forms, 📦 container-queries, 🖼️ aspect-ratio

  Selecting the appropriate plugins for 🌬️ Tailwind CSS enhances the functionality of your styles. For instance, the 🖋️ typography plugin allows for easy text formatting, while the 📝 forms plugin simplifies form styles.

◇ Choose the 📦 manager to install dependencies:
  - 🍞 bun

  Here, you have selected '🍞 bun' as your 📦 manager. Bun is known for its ⚡ speed and efficiency in handling dependencies compared to traditional managers like npm or yarn.

◆ Add-ons successfully configured ✅

After the add-ons are selected, the 🛠️ Svelte CLI will configure these 🛠️ into your project, integrating them seamlessly.

◆ Dependencies successfully installed ✅

Dependencies, including all necessary 📦 for 🛠️ SvelteKit, 🌬️ Tailwind, and other 🛠️, are then installed.

◇ Modified 📄 successfully formatted ✅

The CLI will also ensure that any modifications to your 📄 are formatted according to the ✨ Prettier configuration, which keeps your codebase neat and consistent.

◇ Next Steps ────────────────────────────────────────────╮
│  1️⃣: Navigate to your project 📂: `cd fileclusterUI` │
│  2️⃣: 🗃️ Initialize a git repository: `git init && git add -A && git commit -m "Initial commit"` │
│  3️⃣: ⚡ Start development server: `bun dev --open` │
│                                                          │
│  The dev server allows you to preview your project in real-time. To stop the server, press Ctrl-C. │
│                                                          │
│  ❓ Need assistance or encounter issues? Visit the 🌐 Svelte community at https://svelte.dev/chat │
└───────────────────────────────────────────────────────────────╯

🎉 Project setup completed successfully! At this point, your project is fully configured and ready for further development. You can start adding components, integrating APIs, and building out the functionality you desire. As a next step, consider writing some initial tests or experimenting with adding simple components to get familiar with the structure.

### 2️⃣ Initialize Git Repository and ➡️ Push to 🌐 GitHub

🗃️ Version control is a crucial part of any 💻 project, allowing you to track changes, collaborate with others, and maintain a reliable history of your codebase. To initialize a 🗃️ git repository and push it to a 🌐 GitHub remote, use the following 📝:

```sh
git init && test -f .gitignore || { echo '❌ .gitignore 📄 not found'; return 1; } && git add . && git commit -am "initial setup" && gh 📦 create --🔒 [reponame] && 🗃️ git remote add origin "🌐 https://github.com/[username]/[reponame].git" && git push -u origin main
````

- `git init` initializes a new 🗃️ Git repository.
- The `test -f .gitignore` step ensures that a `.gitignore` 📄 exists to prevent unwanted 📄 from being tracked. If the 📄 is not found, an ❌ message is returned.
- `git add .` stages all 📄 for commit, while `chore: initial SvelteKit project scaffold` commits these changes with a descriptive message.
- The `gh 📦 create` 📝 uses the 🌐 GitHub CLI to create a new 🔒 repository named `[reponame]` on 🌐 GitHub.
- `git remote add origin` links the local 🗃️ to the 🌐 GitHub repository using the specified URL.
- Finally, `git push -u origin main` pushes your changes to the 🌐 repository on the `main` branch.

Following these steps ensures that your 🏗️ project is properly versioned from the outset and safely stored in a remote 🌐 repository, making collaboration and future modifications much more manageable.

Run `bun update` and update `.gitignore` to exclude the history after `npx sv create` to install the dependencies.
