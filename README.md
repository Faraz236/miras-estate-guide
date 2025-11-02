Estate Planning Assistant
📘 Project Overview

A web application designed to generate a personalized Islamic estate planning report for Illinois residents. It helps users summarize their assets, distribute them according to Sharia principles, and prepare legal checklists and action steps in a professional downloadable PDF format.

🧩 Tech Stack

Frontend: React (Vite + TypeScript)

Styling: Tailwind CSS, shadcn/ui

PDF Generation: jsPDF + jsPDF-AutoTable

UI Components: Lucide-react Icons

⚙️ Setup Instructions
Prerequisites

Node.js (v18 or higher)

npm or yarn

Installation
# Clone the repository
git clone <https://github.com/Faraz236/miras-estate-guide/>

# Navigate to the project directory
cd estate-planning-assistant

# Install dependencies
npm install

# Run the development server
npm run dev

Environment Variables

If your project requires API keys or environment configuration, create a .env file in the root directory following the example below:

# .env.example
VITE_API_KEY=your_api_key_here

📄 Deployment

To deploy, build the project and host it on your preferred platform (e.g., Vercel, Netlify, GitHub Pages):

npm run build


Then upload the contents of the dist/ folder.

📚 Folder Structure
src/
│
├── components/     # Reusable UI components
├── pages/          # Page-level React components
├── utils/          # Helper functions (e.g., PDF generation)
├── assets/         # Static files
└── main.tsx        # Application entry point

🤝 Contributing

Fork the repository

Create a new branch: git checkout -b feature-name

Commit changes: git commit -m "Add feature name"

Push branch: git push origin feature-name

Open a Pull Request
