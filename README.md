# Know Before You Rent 🏠

### Lagos Tenant Insight Platform

A full-stack web application that helps people in Lagos, Nigeria make informed rental decisions using real tenant experiences.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)
- Google Maps API key (for map features)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/know-before-you-rent"
JWT_SECRET="your-super-secret-jwt-key"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"   # for AI summaries (optional)
```

### 3. Set Up Database

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to MongoDB
```

### 4. Run Development Server

```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## 🗺️ Google Maps Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable: **Maps JavaScript API** and **Geocoding API**
3. Create an API key and add it to `.env`

---

## 🤖 AI Summaries (Optional)

Add your Anthropic API key to `.env`:

```env
ANTHROPIC_API_KEY="sk-ant-..."
```

Visit a property detail page and click **"Generate AI Summary"**.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/register/     # POST - Register user
│   │   ├── auth/login/        # POST - Login, DELETE - Logout
│   │   ├── auth/me/           # GET - Current user
│   │   ├── properties/        # GET, POST
│   │   ├── properties/[id]/   # GET, DELETE
│   │   ├── reviews/           # GET, POST
│   │   ├── reviews/[propertyId]/ # GET
│   │   ├── summary/[propertyId]/ # GET - AI Summary
│   │   └── heatmap/           # GET - Heatmap data
│   ├── (pages)/
│   │   ├── page.tsx           # Home
│   │   ├── login/             # Login
│   │   ├── register/          # Register
│   │   ├── properties/        # Property list
│   │   ├── properties/[id]/   # Property detail
│   │   ├── post-property/     # Add property
│   │   ├── post-review/       # Add review
│   │   ├── dashboard/         # User dashboard
│   │   └── map/               # Map view
│   └── globals.css
├── components/
│   ├── AuthProvider.tsx        # Auth context
│   ├── Navbar.tsx
│   ├── GoogleMap.tsx
│   ├── PropertyCard.tsx
│   └── ReviewCard.tsx
├── lib/
│   ├── prisma.ts              # Prisma singleton
│   └── auth.ts                # JWT utilities
└── types/
    └── index.ts               # TypeScript types
```

---

## 🔑 Review Categories

| Category             | Type        |
| -------------------- | ----------- |
| GOOD_ELECTRICITY     | ✅ Positive |
| BAD_ELECTRICITY      | ❌ Negative |
| GOOD_WATER           | ✅ Positive |
| BAD_WATER            | ❌ Negative |
| GOOD_LANDLORD        | ✅ Positive |
| BAD_LANDLORD         | ❌ Negative |
| UNFAIR_RENT_INCREASE | ❌ Negative |
| POOR_SANITATION      | ❌ Negative |
| BAD_ROAD             | ❌ Negative |
| POOR_NETWORK         | ❌ Negative |
| OTHER                | 💬 Neutral  |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB
- **ORM**: Prisma v6
- **Auth**: JWT + bcrypt
- **Maps**: Google Maps JavaScript API
- **AI**: Anthropic Claude (optional)
- **Styling**: Custom CSS (dark theme)

---

## 📦 Build for Production

```bash
npm run build
npm start
```

---

## 🗺️ Lagos Area Coordinates Reference

| Area            | Lat    | Lng    |
| --------------- | ------ | ------ |
| Lekki Phase 1   | 6.4281 | 3.4219 |
| Victoria Island | 6.4281 | 3.4219 |
| Yaba            | 6.5059 | 3.3760 |
| Surulere        | 6.4983 | 3.3563 |
| Ikeja           | 6.5954 | 3.3353 |
| Ajah            | 6.4698 | 3.5852 |
| Ikorodu         | 6.6194 | 3.5061 |
| Festac          | 6.4633 | 3.2806 |
# KnowBeforeYouRent
