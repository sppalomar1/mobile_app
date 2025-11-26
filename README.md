Online Canteen Ordering App

A mobile application built using React Native (Expo) and Supabase that allows students and canteen administrators to efficiently manage canteen orders.
The system provides separate features for Admin and Customer with full CRUD operations, authentication, and media upload.

⭐ Group Members:
| Role       | Name                        |
| ---------- | --------------------------- |
| **Leader** | **Shiela Marie B. Palomar** |
| **Member** | **Novem Kilakiga**          |

📱 Project Overview

The Online Canteen Ordering App automates canteen reservation and ordering.
It includes two user roles:
👨‍🍳 Admin Features

Admins can:

➕ Add new menu items

📝 Edit existing menu items

❌ Delete menu items

📸 Upload menu item images via Supabase Storage

🧑‍💼 Customer Features

Customers can:

🍽️ View available menu items

🛒 Order items

📋 View their order history

💳 Checkout

🧾 View receipt after successful order

🧩 General App Features

🔐 User Authentication (Sign Up / Login using Supabase Auth)

📘 CRUD Operations (Menu items, orders, and notes)

🖼️ Media Upload (Images & videos for menu items)

⚡ Real-time database operations via Supabase

📂 Project Structure:
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

🛠️ Tech Stack:
| Technology              | Purpose                     |
| ----------------------- | --------------------------- |
| **React Native (Expo)** | Mobile UI development       |
| **Expo Router**         | Navigation / screen routing |
| **Supabase Auth**       | User login & signup         |
| **Supabase Database**   | Storing users, menu, orders |
| **Supabase Storage**    | Storing menu images / media |
| **EAS Build**           | APK generation              |

