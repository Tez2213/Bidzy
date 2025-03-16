# Bidzy - Real-Time Logistics Bidding Platform

Bidzy is a cutting-edge logistics marketplace designed to transform the shipping industry through real-time competitive bidding. Our platform connects shippers with carriers in a dynamic marketplace that ensures both parties maximize their economic potential.

<p align="center">
  <strong>Where shipping meets real-time deals—fast, fair, and frictionless</strong>
</p>

## 🌟 Project Description & Inspiration

The logistics market is fundamentally broken—opaque pricing, poor fleet utilization, and missed opportunities are bleeding value from both sides. Inspired by the dynamics of financial markets and the efficiency of real-time trading platforms, Bidzy introduces a high-frequency bidding system that flips the script:

- **For Shippers**: Lock in the best rates through live, competitive auctions
- **For Carriers**: Increase fleet efficiency and maximize profit margins by securing more jobs at optimal rates
- **For the Market**: Create transparency that ensures fair pricing and better decision-making for all parties

## 📌 Problem Statement  

The logistics and shipping industry faces several critical challenges:  

- **High Shipping Costs**: Businesses struggle with unpredictable and inflated shipping rates due to a lack of transparent competition.  
- **Empty Trucks & Wasted Capacity**: Carriers operate with inefficient routes and underutilized fleets.
- **Manual & Delayed Bidding**: Traditional bidding processes are slow and inefficient, often requiring manual intervention, leading to shipping delays.  
- **Lack of Trust & Security**: Existing shipping platforms lack a decentralized verification system, resulting in trust issues and potential fraud.  
- **Limited AI Assistance**: Users rarely receive real-time guidance for cost estimation, bidding strategies, or logistics planning.  

## 💡 Solution  

**Bidzy** is a **real-time logistics bidding platform** designed to enhance cost efficiency, transparency, and automation in the shipping industry.  

### 🔥 Key Features  

#### **Smart Bidding System**  
- Shippers post shipping requests with detailed requirements
- Carriers bid in real-time, ensuring competitive pricing
- Live updates show market movements as they happen

#### **AI-Powered Price Estimator**  
- Uses machine learning to provide **intelligent cost estimations** before bidding starts
- Analyzes historical data to suggest optimal price ranges for both parties

#### **Blockchain-Powered Transactions**  
- Implements **smart contracts** for **secure, transparent, and tamper-proof transactions**
- Reduces fraud and increases trust between parties

#### **Automated Carrier Matching**  
- AI-driven algorithms recommend the best carriers based on cost, reliability, and past performance
- Intelligent route optimization for better fleet utilization

#### **Interactive Dashboard**  
- Real-time tracking system for bids, shipments, and analytics
- Provides insights into bid history and success rates

#### **AI Chatbot Assistance**  
- Industry-specific AI chatbot for real-time shipping queries, bidding tips, and logistics insights

### The Impact

By streamlining the logistics process, Bidzy aims to:
- Reduce overall shipping costs for businesses
- Increase fleet utilization and profit margins for carriers
- Provide transparency and trust in the logistics chain
- Empower both shippers and carriers with real-time data and analytics
- Create a more efficient and environmentally sustainable logistics ecosystem

## 🛠 Tech Stack

### Core Technologies
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.x
- **Runtime**: Node.js 18+

### Frontend Architecture
- **State Management**: React Hooks, Context API
- **UI Components**: Shadcn/ui, Custom components
- **Styling**: Tailwind CSS 3.x

### Backend & Infrastructure
- **Real-time communication**: Socket.IO for bidding events and notifications
- **Authentication**: NextAuth.js for secure user management
- **Database**: Prisma ORM with PostgreSQL for data persistence
- **Deployment**: Vercel for the main application and Railway for dedicated socket server

### AI & Blockchain
- **AI Chatbot**: Coze-powered chatbot trained on industry-specific data
- **AI Price Calculator**: Intelligent price estimation based on real-time market data
- **Smart Contracts**: Secure and transparent transactions built with Solidity
- **Decentralized Ledger**: For managing bids and ensuring trust between parties

## 🚀 Getting Started

### Prerequisites
- [Node.js 18+](https://nodejs.org/)
- npm or yarn installed

### Setup Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Tez2213/Bidzy.git
   cd bidzy
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create a .env.local File:**
   Create a file named .env.local in the project root and add the following:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-here
   DATABASE_URL=your-database-url
   NEXT_PUBLIC_SOCKET_URL="https://socket-production-de8b.up.railway.app/"
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open the Application:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```plaintext
bidzy/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React Components
│   │   ├── sections/        # Page Sections
│   │   └── ui/              # Reusable UI Components
│   ├── lib/                 # Utility functions
│   ├── server/              # API routes and server-side functions
│   └── styles/              # Global styles
├── public/                  # Static assets
└── types/                   # TypeScript definitions
```

## 🎯 MVP Features

1. **AI-Driven Dynamic Pricing**
   - Intelligent cost estimation before bidding starts
   - Price suggestions based on historical data

2. **Real-Time Bidding Wars**
   - Live bidding interface with instant updates
   - Countdown timers and bid notifications

3. **Smart Escrow System**
   - Funds are only released upon job completion
   - Secure payment processing

4. **Blockchain Contracts**
   - Immutable and fraud-proof agreements
   - Transparent transaction history

## 🧪 Challenges We Faced

Building Bidzy wasn't without obstacles:

- **CORS configuration**: Setting up proper cross-origin resource sharing between the main app and socket server proved challenging when deploying to production.
- **Race conditions**: Managing concurrent bids required careful state management to prevent conflicts.
- **Real-time data sync**: Ensuring all users see the same bid information simultaneously across devices.
- **Performance optimization**: Reducing unnecessary re-renders during high-frequency bid updates.

## 📈 Scalability

- **Global Expansion**: Scales across regions, tapping into the $8 trillion logistics market.
- **Revenue Boost**: AI and blockchain reduce costs, increase transactions, and drive profits.
- **Versatile Model**: The platform adapts to multiple industries beyond shipping, ensuring long-term growth.

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

1. Fork the repository.
2. Create your feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a pull request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Useful Links

- **Live Site**: https://bidzy.vercel.app/
- **GitHub Repository**: https://github.com/Tez2213/Bidzy
  
- **Architecture Diagrams**:
  - **Frontend Diagram**: https://tinyurl.com/2s3sssty
  - **Backend Diagram**: https://tinyurl.com/mwx2ekrh
  - **APIs Diagram**: https://tinyurl.com/3u6twph4

## 👥 Team BurgerOS

- Aaditya Singhal
- Aditya Singh
- Anant Singhal
- Tejasvi Kesarwani
- Kunal Singh
