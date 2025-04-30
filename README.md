# 📚 PeerTutor

**PeerTutor** is a web-based platform designed to connect students with peer tutors for academic support. Built using **Vue.js** and **Vuetify** for a responsive and user-friendly interface, and powered by **Supabase** as the backend/database service, PeerTutor simplifies session booking, tutor management, and feedback collection.

## 🚀 Features

- 🔍 **Browse Tutors** – Students can view tutor profiles, availability, and subjects offered.  
- 📅 **Book Sessions** – Easy-to-use booking interface to schedule one-on-one sessions.  
- 🌟 **Rate & Review** – Students can leave feedback after sessions to help others choose quality tutors.  
- 👨‍🏫 **Tutor Management** – Tutors can manage their profiles and set availability.  
- 🛠 **Admin/Backend** – Data is handled securely via Supabase (PostgreSQL-based).

## 🛠 Tech Stack

- **Frontend:** Vue.js + Vuetify  
- **Backend:** Supabase (auth, database, API)  
- **Database Tables:** `Tutors`, `Bookings`, `Reviews`, `Users`

## 📂 Project Structure
/src
  /components
  /views
  /services
  App.vue
  main.js

## 🔐 Authentication

Supabase handles user authentication for both students and tutors, ensuring secure login and session management.

## 🧪 Future Improvements

- Real-time chat or messaging between students and tutors  
- Notification system for upcoming bookings  
- Advanced search and filter for tutor listings

## 📎 Getting Started

# Install dependencies
npm install

# Run the app locally
npm run serve
