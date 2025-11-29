📱 Online Canteen Ordering App

A mobile application built using React Native (Expo) and Supabase that allows students and canteen administrators to manage menu items, process orders, and streamline canteen operations.
The app supports two user roles: Admin and Customer, each with its own features and screens.

👥 Group Members
Role	Name
Leader	Shiela Marie B. Palomar
Member	Novem Kilakiga
Member	JV Tyrone J. Medellada
Member	Khyte Louie Mortel
Member	John Benidict Oro
Member	Megue Alarcio

📌 Project Overview
The Online Canteen Ordering App automates canteen ordering.
Admins can manage menu items and view orders, while customers can browse items and place orders easily.

👨‍🍳 Admin Features
Admins can:

➕ Add menu items

📝 Edit menu items

❌ Delete menu items

📸 Upload menu images (Supabase Storage)

📦 View customer orders

✔️ Update order status

🧑‍💼 Customer Features

Customers can:

🍽️ View menu items

🛒 Place orders

📋 View order history

🧾 View receipt

💳 Checkout

🧩 General App Features

🔐 User Authentication (Supabase Auth)

📘 Full CRUD Operations

🖼️ Media Upload (Images for menu items)

⚡ Supabase backend for database & storage

🗂️ File-based routing using Expo Router

📂 Project Structure
app/
 ├── admin/
 │   ├── _layout.tsx
 │   ├── addMenuItem.tsx
 │   ├── editMenuItem.tsx
 │   ├── adminOrders.tsx
 │   └── menu.tsx
 ├── customer/
 │   ├── menu.tsx
 │   ├── order.tsx
 │   ├── checkout.tsx
 │   ├── receipt.tsx
 │   └── orders.tsx
 ├── notes.tsx
 ├── login.tsx
 ├── signup.tsx
 ├── index.tsx
 └── _layout.tsx

🛠️ Tech Stack
| Technology          | Purpose                |
| ------------------- | ---------------------- |
| React Native (Expo) | Mobile UI development  |
| Expo Router         | Navigation and routing |
| Supabase Auth       | User authentication    |
| Supabase Database   | Menu & order storage   |
| Supabase Storage    | Image upload           |
| EAS Build           | APK generation         |

🔧 Supabase Configuration

The Supabase URL and Anon Key are stored in:
supabaseClient.ts

Supabase public anon keys are safe to use in client-side apps.

▶️ How to Run the App
1️⃣ Install Dependencies
npm install

2️⃣ Start the App
npx expo start

Open the app in:
Expo Go

Android Emulator
iOS Simulator

Development Build
📦 APK Build Instructions

To generate your APK:
eas build -p android --profile preview

