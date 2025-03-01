# Bidzy - Modern Logistics Bidding Platform

A sophisticated logistics and shipping bidding platform built with Next.js 14, enabling real-time shipping requests and bidding management.

## ✨ Key Features

- **Smart Bidding System**: Create and manage shipping requests
- **Interactive Dashboard**: Track active bids, success rates, and analytics
- **Dual Role Support**: 
  - Shippers can post shipping requests
  - Carriers can bid on available shipments
- **Profile Management**: Detailed user profiles with bid history
- **Price Calculator**: Estimate shipping costs
- **Responsive Design**: Seamless experience across all devices
- **Modern UI/UX**: Dark theme with fluid animations
- **AI Chatbot**: Industry-specific chatbot for user assistance
- **Blockchain Integration**: Smart contracts for secure transactions

## Site Link 

- https://bidzy.vercel.app/

## Architecture Diagrams

- **Frontend Diagram**: https://tinyurl.com/2s3sssty
- **Backend Diagram**: https://tinyurl.com/mwx2ekrh
- **APIs Diagram**: https://tinyurl.com/3u6twph4

## 🛠️ Tech Stack

### Core Technologies
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.x
- **Runtime**: Node.js 18+

### Frontend Architecture
- **State Management**: 
  - React Hooks
  - Context API
- **UI Components**:
  - Shadcn/ui (Core components)
  - Custom components
- **Styling**: 
  - Tailwind CSS 3.x
  - CSS Modules
  - CSS Variables

### Design & Interactions
- **Animations**: Framer Motion
- **Icons**: Tabler Icons
- **Theme**: Custom dark theme
- **Layouts**:
  - Responsive grid system
  - Fluid typography
  - Mobile-first approach

### Performance Optimizations
- **Image Optimization**: Next.js Image Component
- **Code Splitting**: Dynamic imports
- **Font Optimization**: Next/font with Google Fonts
- **Bundle Size**: Optimized with webpack

### AI & Machine Learning
- **AI Chatbot**: Coze AI chatbot for user assistance
  - Trained on industry-specific data
  - Provides deep insights and support
- **AI-based Price Calculator**: Intelligent price estimation

### Blockchain Integration
- **Smart Contracts**: Built with Solidity
  - Secure and transparent transactions
  - Decentralized ledger for bid management

### Development Environment
- **Package Manager**: npm/yarn
- **Code Quality**:
  - ESLint
  - Prettier
  - TypeScript strict mode
- **Version Control**: Git
- **IDE Support**: VS Code with recommended extensions

## 🚀 Getting Started

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/bidzy.git
cd bidzy
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Run development server:**
```bash
npm run dev
# or
yarn dev
```

4. **Open browser:**
Navigate to `http://localhost:3000`

## 📁 Project Structure

```plaintext
bidzy/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React Components
│   │   ├── sections/       # Page Sections
│   │   └── ui/            # Reusable UI Components
│   ├── lib/               # Utility functions
│   └── styles/            # Global styles
├── public/                 # Static assets
└── types/                 # TypeScript definitions
```

## 🎯 Core Features

1. **Shipping Request Management**
   - Create detailed shipping requests
   - Set budget and timeline
   - Upload package details

2. **Bidding System**
   - Real-time bid submissions
   - Bid comparison tools
   - Auto-notifications

3. **User Dashboard**
   - Activity tracking
   - Success rate analytics
   - Bid history

4. **Profile System**
   - User verification
   - Rating system
   - Transaction history

5. **AI Chatbot**
   - Industry-specific assistance
   - Deep insights and support

6. **Blockchain Integration**
   - Secure smart contracts
   - Decentralized ledger

## 🔧 Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing  

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
