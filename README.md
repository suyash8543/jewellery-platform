# Swarna Mahal Jewellers - Premium Retail E-Commerce Platform

A production-ready, high-converting digital showroom platform engineered for Indian retail jewellery businesses, featuring **real-time dynamic weight-based gold pricing**, an **interactive bullion rate calculator**, **bespoke design sample uploads**, and a **non-technical shop owner administrative dashboard**.

Built with **ASP.NET Core 9 Web API (C#)**, **React 18 + Vite + Tailwind CSS**, **MongoDB Cloud (Atlas)**, and **Supabase Cloud**.

---

## 🌟 Core Highlights & Architectural Features

### 1. Dynamic Weight-Based Pricing Engine
- **Formula:** $\text{Bullion Value} = \text{Net Gold Weight (g)} \times \text{Live Purity Rate (24K, 22K, 18K, 14K)}$
- **Craftsmanship:** Dynamic Making charges calculated as either `% of bullion value` or `Fixed ₹/gram`.
- **Special Festive Offers:** The shop owner can set an optional **Offer Price** (fixed festive promotional price) or discount on making charges.
- **Transparent Price Breakdown:** Customers can click *"View Price Breakup"* on any product card or detail page to see pure gold value vs making charges vs festive savings.

### 2. "Check Current Gold Price" Hub & Calculator
- Header ticker displaying real-time 22K (916), 24K pure gold, and 999 silver rates per gram.
- Dedicated `/gold-rates` page with live market cards, 7-day festive trends, and an interactive **Gold Value Calculator** where customers enter weight in grams to calculate instant INR value.
- Hallmarking & HUID education guide building trust.

### 3. "Send Us Your Design Sample" (Bespoke Karigari Orders)
- Solves the common customer habit of bringing Pinterest, Instagram, or wedding magazine photos.
- Dedicated `/custom-sample` portal:
  1. Uploads reference photo/screenshot (stored in cloud storage / `wwwroot/uploads`).
  2. Selects metal/purity (22K Yellow Gold, 18K Diamond, Rose Gold, Silver).
  3. Enters target weight (grams) and budget range (₹).
  4. Saves request in database and auto-generates a one-click **WhatsApp message** with the photo link directly to the jeweller.

### 4. "Close-the-Deal" Demo Catalog Strategy & 1-Click Handover
- Seeded with curated, high-resolution royalty-free jewellery photography from Unsplash/Pexels (royal bridal chokers, temple haar, 22K gold kadas, solitaire rings, 24K gold coins) to dazzle the client during your pitch.
- **1-Click Demo Removal:** When the client agreement is signed, the shop owner clicks **[🗑️ Clear Demo Products]** in the Admin Dashboard to clear all demo items in one second and begin adding real showroom stock.

---

## 🚀 Quick Start Guide

### Prerequisites
- **.NET 9 SDK** (`dotnet --version`)
- **Node.js v18+ & npm** (`node -v`, `npm -v`)

### Step 1: Run the ASP.NET Core 9 Backend API
```bash
cd d:\coding\jewellery-platform\backend
dotnet run
```
- The API will start on: **`http://localhost:5083`**
- Swagger Documentation is available at: **`http://localhost:5083/swagger`**
- Initial demo products and default site settings will automatically seed upon first launch.

### Step 2: Run the React 18 Frontend
In a separate terminal:
```bash
cd d:\coding\jewellery-platform\frontend
npm run dev
```
- The storefront will start at: **`http://localhost:5173`**
- API calls to `/api/...` and `/uploads/...` are automatically proxied to the backend on port `5083`.

---

## ☁️ Cloud Services Configuration

### 1. MongoDB Atlas (Cloud Database)
Open `backend/appsettings.json` and replace the placeholder connection string:
```json
"MongoDb": {
  "ConnectionString": "mongodb+srv://<your-username>:<your-password>@cluster0.mongodb.net/?retryWrites=true&w=majority",
  "DatabaseName": "SwarnaMahalJewellery"
}
```
*Note: If no connection string is provided, the backend operates in resilient, in-memory cached repository mode so everything runs seamlessly during your client demonstration.*

### 2. Supabase Cloud (Storage & Auth)
Add your Supabase credentials in `backend/appsettings.json`:
```json
"Supabase": {
  "Url": "https://<your-project-ref>.supabase.co",
  "AnonKey": "<your-anon-public-key>",
  "StorageBucket": "jewellery-media"
}
```

---

## 🔐 Store Owner Admin Dashboard

Access the admin dashboard at: **`http://localhost:5173/admin`**

- **Default Username:** `admin`
- **Default Password:** `DiwaliGold2026!`

### Admin Capabilities:
1. **Product Inventory:** Add new jewellery items with weights (gross/net in grams), purity (22K, 24K, 18K), making charges, and optional festive offer prices.
2. **Daily Gold Rates:** Adjust today's 24K and 22K rates with 1 click; all storefront prices instantly recalculate.
3. **Custom Sample Requests Inbox:** Review customer-uploaded photos, weights, and budgets, and reply directly on WhatsApp.
4. **1-Click Demo Handover:** Click the banner button to remove all demo products once your client signs the contract.
