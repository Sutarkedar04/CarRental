# CarRental

A full-stack car rental web application built with the MERN stack, allowing users to browse available cars, check real-time availability, and book rentals for specific date ranges.

## Features

- **Browse & Search** – View available cars with details like model, price, and specifications
- **Smart Date Booking** – Integrated `react-datepicker` with an unavailable-dates feature that automatically blocks out date ranges already booked for a given car, preventing double bookings
- **Role-Based Access** – Separate flows for Users, Dealers, and Admins/Super Admins
- **User Authentication** – Sign up, sign in, forgot/reset password
- **Booking Management** – Users can view and manage their reservations; dealers manage their own bookings
- **Admin Dashboard** – Manage cars, bookings, users, and dealer approvals
- **Responsive UI** – Works across desktop and mobile screen sizes

## Tech Stack

**Frontend** (`carRental/`)
- React (Vite)
- react-datepicker (booking calendar with disabled date ranges)
- Tailwind CSS / PostCSS

**Backend** (`server/`)
- Node.js
- Express.js
- MongoDB (Mongoose)

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

\`\`\`bash
git clone <repo-url>
cd premiumcarrental

cd carRental
npm install

cd ../server
npm install
\`\`\`

### Environment Variables

Create a `.env` file in `server/`:

\`\`\`
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
\`\`\`

Create a `.env` file in `carRental/src/`:

\`\`\`
VITE_API_BASE_URL=your_backend_api_url
\`\`\`

### Running Locally

\`\`\`bash
# Start backend
cd server
npm start

# Start frontend (in a separate terminal)
cd carRental
npm run dev
\`\`\`

## Project Structure

\`\`\`
premiumcarrental/
├── carRental/            # React (Vite) frontend
│   └── src/
│       ├── components/   # Route guards, Navbar, Footer, etc.
│       ├── pages/        # User, Admin, Dealer, Auth pages
│       ├── context/       # AuthContext
│       └── services/      # API + auth service calls
├── server/               # Express backend
│   ├── controllers/       # Route logic
│   ├── models/             # Mongoose schemas (User, Car, Booking, Payment)
│   ├── routes/              # API routes
│   └── middleware/          # Auth middleware
└── README.md
\`\`\`

## Roles

- **User** – Browse, book, and manage rentals
- **Dealer** – Manage their own car listings and bookings (subject to admin approval)
- **Admin / Super Admin** – Manage users, dealers, cars, and bookings platform-wide

## Future Improvements

- Payment gateway integration
- Email notifications for booking confirmations
- Ratings/reviews for dealers

## Author

Kedar — MERN Stack Developer
