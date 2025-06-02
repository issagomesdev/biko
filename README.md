# 🛠️ Biko — Social platform for service providers and seekers

![Next.js](https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=next.js) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

![Preview do site](https://biko.byissa.tech/midia/preview.png)


![Status](https://img.shields.io/badge/status-in_development-yellow) 

<p align="center">
  <a href="#about">About</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#technologies">Technologies</a> •
  <a href="#structure">Structure</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#related-projects">Related Projects</a>
</p>

**Biko** is a platform that connects clients to informal service providers, working like a social network where users can register, share their work, and interact through posts, likes and comments.

This codebase handles the **Frontend** experience, developed in **Next.js** + **TypeScript** to create a clean and engaging interface.

🔗 The backend API developed with Laravel is available [here](https://github.com/issagomesdev/biko-api).

<h2 id="about"> 📌 About</h2>

This project was developed as the final assignment for the Laboratory of Innovative Enterprises course in the Analysis and Systems Development (ADS) program at UNINASSAU. It aims to provide a practical solution connecting informal service providers with potential clients through a social platform, demonstrating the application of software development skills and innovative business concepts learned throughout the course.

💻 You can try the live version at [biko.byissa.tech](https://biko.byissa.tech/)

<h2 id="roadmap"> 🚧 Roadmap</h2>

### ✅ Implemented

- User registration and authentication (login, logout)
- Timeline-style publication of user content
- Likes and comments for interaction
- Post classification by category and user type (client or provider)
- Filtering of posts by category, user type, location, and sorting (latest or most popular)
- Logged-in user profile editing, including activity categories

### 🔄 Planned

- Public user profiles with posts and basic interaction history
- Service reviews from both clients and providers
- Real-time notifications
- Private messaging/chat system
- Post saving/bookmarking
- Report system for inappropriate content

<h2 id="technologies"> 🧪 Technologies</h2>

This project was built using the following technologies and tools:

- [Next.js](https://nextjs.org/) — React-based framework for building fast web applications
- [TypeScript](https://www.typescriptlang.org/) — Strongly typed language for scalable code
- [CSS Modules](https://github.com/css-modules/css-modules) — Scoped and modular CSS styling
- [IBGE API](https://servicodados.ibge.gov.br/api/docs/) — For location data (states and cities)

<h2 id="structure"> 📁 Structure</h2>

Overview of the main folders and files in the project:

```txt
📂 components/                      # Reusable UI components
 ┣ 📄 Feed.tsx                      # Main feed with publications
 ┣ 📄 Sidebar.tsx                   # Sidebar menu with filters
 ┗ 📂 ultils/                       # UI helpers (modals, selectors, options)
   ┣ 📄 CategorySelector.tsx
   ┣ 📄 ModalConfirm.tsx
   ┗ 📄 Options.tsx

📂 models/                          # TypeScript interfaces for data models
 ┣ 📄 User.ts
 ┣ 📄 Category.ts
 ┣ 📄 Publication.ts
 ┣ 📄 Comment.ts
 ┣ 📄 Like.ts
 ┣ 📄 Chat.ts
 ┣ 📄 State.ts
 ┗ 📄 City.ts

📂 pages/                           # Application routes (Next.js routing)
 ┣ 📄 index.tsx                    # Home / Feed
 ┣ 📄 login.tsx
 ┣ 📄 register.tsx
 ┣ 📄 edit-perfil.tsx             # Profile edit page
 ┣ 📄 notifications.tsx
 ┣ 📄 chat.tsx
 ┣ 📂 profile/
 ┃ ┗ 📄 [id].tsx                  # Public profile page
 ┣ 📂 posts/
 ┃ ┗ 📄 [id].tsx                  # Post details page
 ┣ 📄 search.tsx
 ┣ 📄 _app.tsx                    # Root app wrapper
 ┗ 📄 _document.tsx               # Custom document structure

📂 public/
 ┗ 📂 midia/                       # Static media assets
   ┣ 📄 background.jpg
   ┗ 📄 icon.png

📂 services/                        # API service handlers (axios)
 ┣ 📄 authService.ts
 ┣ 📄 userService.ts
 ┣ 📄 publicationService.ts
 ┣ 📄 categoryService.ts
 ┗ 📄 ibgeService.ts

📂 styles/                          # CSS Modules and global styles
 ┣ 📄 styles.css                   # Global styles
 ┣ 📂 ultils/
 ┃ ┣ 📄 categorySelector.module.css
 ┃ ┣ 📄 confirmModal.module.css
 ┃ ┣ 📄 options.module.css
 ┃ ┗ 📄 publications.module.css
 ┣ 📄 feed.module.css
 ┣ 📄 form.module.css
 ┣ 📄 home.module.css
 ┣ 📄 perfil.module.css
 ┣ 📄 profile.module.css
 ┣ 📄 chat.module.css
 ┗ 📄 search.module.css

📂 utils/                           # Utility functions and axios instance
 ┣ 📄 api.ts                       # Axios base config
 ┗ 📄 auth.ts                      # Token storage and validation

📄 .env.local                       # Environment variables (API URL)
📄 package.json                     # Dependencies and scripts
📄 tsconfig.json                    # TypeScript config
📄 next.config.mjs                  # Next.js configuration
```

<h2 id="getting-started">▶️ Getting Started</h2>

### Requirements

- Node.js >= 16.x
- npm >= 8.x or yarn >= 1.x
- Backend API running (Laravel API)

### Installation

```bash
# Clone the repository
git clone https://github.com/issagomesdev/biko.git

cd biko

# Install dependencies
npm install
# or
yarn install

# Create a `.env.local` file and add the following environment variable:
NEXT_PUBLIC_API_URL=your_api_url_here
# Make sure the backend API is running and accessible at the URL set in NEXT_PUBLIC_API_URL.

# Run the development server
npm run dev
# ou
yarn dev
```
<h2 id="related-projects">🔗 Related Projects</h2>

🧱 Backend (Laravel API) repository [here](https://github.com/issagomesdev/biko-api)