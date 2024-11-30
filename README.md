# 🛠️ Comprehensive Guide to Setting Up a SvelteKit Project 🚀

📄 This document provides a guide for setting up a 🏗️ project using 🛠️ SvelteKit with 🌬️ Tailwind CSS, integrating 🧩 ShadCN components, and using 📦 Convex as the 🗄️ management system. It offers a detailed walkthrough for 👨‍💻 developers to correctly set up a robust and scalable project, outlining key command line 📝 essential for the setup.

## ⚙️ Project Setup Commands

The following 📝 will guide you through the initial stages of setting up your 🛠️ SvelteKit project.

This includes creating the project, configuring necessary 🛠️ tools and plugins, initializing version control, and pushing the project to a remote 🌐 GitHub 📦.

Each 📝 is explained for clarity, ensuring even those less familiar with the 💻 stack can follow along effectively.

### 1️⃣ Create a New 🛠️ SvelteKit Project

To start a new 🛠️ SvelteKit project, use the following 📝:

```sh
bunx sv create [name]
```

or

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
Next we will setup Convex.
Do not forget to create `convex.json` and configure the `functions` path.
Do not forget to add the the generated `src/convex/_generated` folder to `.gitignore`.
Afterwards, run `bun add convex convex-svelte` to install the Convex dependencies. Then run `bunx convex dev` to set up and log in to your GitHub account.

```sh
alien@Alex-MacBook-Air fileclusterUI % bunx convex dev
? What would you like to configure? create a new project
? Project name: fileclusterUI
✔ Created project fileclusterui, manage it at https://dashboard.convex.dev/t/alexander-strasser/fileclusterui
✔ Provisioned a dev deployment and saved its name as CONVEX_DEPLOYMENT to .env.local
✔ URL as PUBLIC_CONVEX_URL to .env.local

Write your Convex functions in convex/
Give us feedback at https://convex.dev/community or support@convex.dev

✔ 17:09:32 Convex functions ready! (3.39s)
```

Run the following command in the terminal to create sample data:

```sh
echo '{"text": "Buy groceries", "isCompleted": true}
{"text": "Go for a swim", "isCompleted": true}
{"text": "Integrate Convex", "isCompleted": false}' > sampleData.jsonl
```

Run the following command in the terminal to import the sample data:

```sh
bunx convex import --table tasks sampleData.jsonl
```

create a `.env` file and copy `PUBLIC_CONVEX_URL` from `.env.local`

after this whole ordeal with the commit history and making convex work. which should all have been super easy. but i made it hard on my self.
lets go back to normal functionality. also i should have started with commiting the vitest setup. and then added convex. i added now some math functions in the lib folder. to show insource testing which is a neat feature of vitest. i will make a branch which i use to create patches for the project. and then merge them into the main branch. for example what i found is usually first write the change you want to make in the read me file commit that then implement that change. also fixes should be chronologically directly after the commit that introduced the bug. but thats wishful thinking. but in the other branch i can try to sort the non conflicting changes as to make the commit history more semantically and topically ordered and cohesive/coherent. I discovered that bun test uses Bun's native test runner (which only runs .test.ts files) while bun run test uses Vitest (which runs both regular and in-source tests). buns native test runner does not respect the vitest configuration.
now we are trying to get convex' native testing to work.
we will have two different enviroments defined in the configuration.
next one has to add a svelte component to the project.
afterwards one has to test that component via the testing libary for svelte.
okay from now on i will only write in that one kind of speech. because of the lotr meme.
next one has to add shadcn components to the project.
one has to do it with cli.
one hast to do this before executing the cli. it may not be able to install dependencies probably.

alien@MacBookAir fileclusterUI % bun add bits-ui@next
[0.07ms] ".env.local", ".env"
bun add v1.1.37 (8ca0eb83)

installed bits-ui@1.0.0-next.64

it could add the the dev dependencies to the project.

┌ shadcn-svelte v1.0.0-next.4
│
◇ Which style would you like to use?
│ Default
│
◇ Which base color would you like to use?
│ Zinc
│
◇ Where is your global CSS file? (this file will be overwritten)
│ src/app.css
│
◇ Where is your Tailwind config located? (this file will be overwritten)
│ tailwind.config.ts
│
◇ Configure the import alias for components:
│ $lib/components
│
◇ Configure the import alias for utils:
│ $lib/utils
│
◇ Configure the import alias for hooks:
│ $lib/hooks
│
◇ Configure the import alias for ui:
┌ shadcn-svelte v1.0.0-next.4
│
◇ Components to install:
│ button
│
◇ Ready to install components and dependencies?
│ Yes
│
◇ button installed at src/lib/components/ui/button
│
◇ Config file components.json updated
│
└ Success! Component installation completed.

one now has to test that component via the testing libary for svelte.s

one now has to add an article component to the project.
which uses the tailwind typography plugin.
tests for article component.

one now has to add a tag toggle component to the project.
which uses the shadcn toggle and toggle group component.
tests for tag toggle component.

one now has to add a simple carousel component to the project.
tests for carousel component.
one should not forget to install the embla-carousel-svelte dependency before.

one now has to add a filecard to the project.
tests for filecard component.
one should not forget to add the shadcn components before.
