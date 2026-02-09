# 🧾 AI-Powered Expense Tracker

A production-ready full-stack web application that helps users track expenses, visualize spending patterns, and gain intelligent insights using natural language queries.

🔗 **Live Demo:** https://my-next-expense-prisma.vercel.app/

---

## 🚀 Features

- Secure authentication using **NextAuth** (Email/Password + Google OAuth)
- Protected routes for dashboard, analytics, and settings
- Interactive expense dashboard with:
  - Daily & monthly spending summaries
  - Category-wise breakdowns
  - Trend comparisons across months
- **AI-powered natural language insights**
  - Ask questions like *“How much did I spend on dining last month?”*
  - Get AI-generated summaries and trends using OpenAI APIs
- Dedicated **AI Insights** page with:
  - Top spending categories
  - Recurring subscription detection
  - Smart saving recommendations
- Expense analytics with charts and filters
- User profile management with image upload, update, and delete
- Fully responsive UI optimized for desktop and mobile

---

## 🧠 Tech Stack

**Frontend**
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

**Backend**
- Node.js
- Next.js API Routes
- Prisma ORM

**Database**
- MongoDB

**AI & Automation**
- OpenAI APIs
- Prompt design for user-facing AI interactions

**Auth & Media**
- NextAuth
- Cloudinary

**Deployment**
- Vercel

---

## 🏗 Architecture & Best Practices

- Server-side rendering and dynamic routing using Next.js App Router
- Secure API routes with session validation
- Modular, scalable component structure
- Type-safe database access with Prisma
- Clean separation of UI, business logic, and data layers
- Production-ready environment configuration

---

## 📦 Setup & Run Locally

```bash
# Clone the repository
git clone https://github.com/harishreyya/expense_tracker.git

# Install dependencies
npm install

# Set environment variables
# (NextAuth, MongoDB, OpenAI, Cloudinary)

# Run the development server
npm run dev
