# 🚗 CarRental

A full-stack car rental platform built with the MERN stack, supporting three user roles: **Customers**, **Dealers**, and **Admins / Super Admins**.

---

## ✨ Features

### Customer
- Browse, search, and filter cars by type, brand, city, and date range
- Real-time availability — booked date ranges are disabled on the booking calendar
- Book cars for specific date ranges with live price calculation
- View, cancel, and print booking confirmations
- Manage profile and driver license information

### Dealer
- Apply as a dealer (subject to admin approval)
- Full CRUD on own car listings (make, model, year, type, transmission, fuel, seats, mileage, pricing, deposit, location, features)
- View and accept/decline incoming bookings for owned vehicles
- Cannot list cars until an admin verifies the account
- Dedicated dealer dashboard and bookings view

### Admin / Super Admin
- Dashboard with revenue, booking, user, and fleet stats
- Manage all bookings (view, edit status, delete)
- Manage all cars (create, edit, toggle availability, soft-delete)
- Manage users (edit, verify, suspend/reactivate, delete)
- Approve or reject dealer applications
- **Super Admin only**: create admin accounts, change roles, assign departments

### Platform
- JWT-based authentication (Bearer header + httpOnly cookie fallback)
- Session verification on app load with graceful network-error handling
- Role-based route protection via a single unified `RequireRole` guard
- Forgot / reset password via email (Nodemailer + SMTP)
- Rate limiting on auth endpoints
- Helmet security headers + Morgan request logging
- Toast notifications
- Responsive UI (Tailwind CSS v4)
- Animated landing page (GSAP + Lottie)

---

## 🛠️ Tech Stack

### Frontend
| Package | Purpose |
|---|---|
| React 18 + Vite | UI framework + bundler |
| React Router v6 | Client-side routing |
| Tailwind CSS v4 | Utility-first styling |
| GSAP + Framer Motion | Landing-page animations |
| Lottie (`lottie-react`) | Hero animation |
| `react-datepicker` | Booking calendar |
| `react-hot-toast` | Toast notifications |
| `react-icons` | Icon set |
| Axios | HTTP client |

### Backend
| Package | Purpose |
|---|---|
| Node.js + Express 5 | HTTP server |
| MongoDB + Mongoose | Database + ODM |
| `jsonwebtoken` | JWT auth |
| `bcryptjs` | Password hashing |
| `cookie-parser` | httpOnly cookie support |
| `nodemailer` | Password reset emails |
| `helmet` | Security headers |
| `morgan` | Request logging |
| `express-rate-limit` | Brute-force protection |
| `express-validator` | Request validation |
| `razorpay` | Payment gateway (planned) |
| `validator` | Email/input validation |

---

## 📁 Project Structure

```
premiumcarrental/
├── carRental/                          # React (Vite) frontend
│   ├── public/
│   │   └── Car1.png … Car5.png
│   └── src/
│       ├── assets/
│       │   └── animations/
│       │       └── car-insurance-loading.json
│       ├── components/
│       │   ├── Navbar.jsx              # scroll-aware navbar
│       │   ├── Footer.jsx
│       │   ├── HeroSection.jsx         # Lottie hero
│       │   ├── Carcategoryshowcase.jsx # GSAP carousel
│       │   └── RequireRole.jsx         # unified route guard
│       ├── context/
│       │   └── AuthContext.jsx         # auth state + session verify
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── CarsPage.jsx
│       │   ├── CarDetailsPage.jsx
│       │   ├── ProfilePage.jsx
│       │   ├── auth/
│       │   │   ├── SignInPage.jsx
│       │   │   ├── SignUp.jsx
│       │   │   ├── AdminSignUp.jsx     # (see note in Troubleshooting)
│       │   │   ├── ForgotPasswordPage.jsx
│       │   │   └── ResetPasswordPage.jsx
│       │   ├── user/
│       │   │   ├── UserDashboard.jsx
│       │   │   ├── UserBookings.jsx
│       │   │   └── UserBookingDetails.jsx
│       │   ├── dealer/
│       │   │   ├── DealerDashboard.jsx
│       │   │   └── DealerBookings.jsx
│       │   └── admin/
│       │       ├── AdminDashboard.jsx
│       │       ├── BookingsManagement.jsx
│       │       ├── CarsManagement.jsx
│       │       ├── UsersManagement.jsx
│       │       ├── DealerApprovals.jsx
│       │       └── AdminBookingDetail.jsx
│       ├── providers/
│       │   └── ToastProvider.jsx
│       ├── services/
│       │   ├── api.js                  # axios instance + interceptors
│       │   └── authService.js
│       ├── utils/
│       │   └── toast.js
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
└── server/                             # Express backend
    ├── config/
    │   └── mongodb.js
    ├── controllers/
    │   ├── authController.js
    │   ├── bookingController.js
    │   ├── carController.js
    │   └── userController.js
    ├── middleware/
    │   └── userAuth.js                 # userAuth, adminAuth, superAdminAuth, dealerAuth, dealerOrAdminAuth
    ├── models/
    │   ├── userModel.js                # includes pre-save bcrypt hook
    │   ├── carModel.js
    │   ├── bookingModel.js
    │   └── paymentModel.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── bookingRoutes.js
    │   ├── carRoutes.js
    │   └── userRoutes.js
    ├── scripts/
    │   └── createSuperAdmin.js
    ├── utils/
    │   └── helpers.js                  # generateToken
    ├── .env
    └── server.js
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16+ ([download](https://nodejs.org))
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier
- **SMTP credentials** — optional, only for password reset emails
- **Git**

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/CarRental.git
cd CarRental
```

### 2. Install dependencies

```bash
# Frontend
cd carRental
npm install

# Backend
cd ../server
npm install
```

### 3. Configure environment variables

Create **`server/.env`**:

```env
# Server
NODE_ENV=development
PORT=4000

# Database
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/carrental
# or local:
# MONGODB_URI=mongodb://localhost:27017/carrental

# Auth
JWT_SECRET=change_me_to_a_long_random_string
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:5173

# Optional — for password reset emails
# If missing, /auth/forgot-password returns 503 gracefully
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=you@example.com
SMTP_PASS=your_smtp_password
SMTP_FROM="CarRental <no-reply@example.com>"

# Optional — enables self-service admin signup at /admin/signup
# If missing, admin accounts can only be created by a super admin
# ADMIN_SIGNUP_CODE=a_long_random_string
```

Create **`carRental/.env`**:

```env
VITE_API_URL=http://localhost:4000/api
```

### 4. Seed the first super admin (one-time)

```bash
cd server
node scripts/createSuperAdmin.js
```

This creates:

| Field | Value |
|---|---|
| Email | `superadmin@carrental.com` |
| Password | `SuperSecurePass123!` |
| Role | `super_admin` |
| Department | `Management` |

> ⚠️ **Change this password immediately after first login.**
> Running the script twice is safe — it detects the existing super admin and exits.

### 5. Run the app

Open two terminals:

```bash
# Terminal 1 — Backend
cd server
npm run server        # runs with nodemon
# or: npm start
```

```bash
# Terminal 2 — Frontend
cd carRental
npm run dev
```

- Frontend → http://localhost:5173
- Backend → http://localhost:4000
- API root → http://localhost:4000/api

---

## 🔑 Roles & Permissions

### How login works

**All roles use the same `/signin` page.** After successful authentication, the frontend redirects by `user.role`:

| Role | Redirects to |
|---|---|
| `customer` | `/dashboard` |
| `dealer` | `/dealer/dashboard` |
| `admin` | `/admin/dashboard` |
| `super_admin` | `/admin/dashboard` |

### How each role is created

| Role | Created by |
|---|---|
| `customer` | Self-registration at `/signup` |
| `dealer` | Self-registration at `/signup` (dealer tab) → admin approval required |
| `admin` | Super admin via `/admin/users → "Create New Admin"` |
| `super_admin` | **Only** via `scripts/createSuperAdmin.js` (one-time bootstrap) |

### Permission matrix

| Capability | Customer | Dealer | Admin | Super Admin |
|---|:-:|:-:|:-:|:-:|
| Browse & book cars | ✅ | ✅ | ✅ | ✅ |
| Manage own bookings | ✅ | ✅ | ✅ | ✅ |
| List / edit own cars | ❌ | ✅ | ✅ | ✅ |
| Accept / decline dealer bookings | ❌ | ✅ | ✅ | ✅ |
| Approve dealer applications | ❌ | ❌ | ✅ | ✅ |
| Manage all cars | ❌ | ❌ | ✅ | ✅ |
| View all bookings | ❌ | ❌ | ✅ | ✅ |
| Edit customer profile fields | ❌ | ❌ | ✅ | ✅ |
| Verify / suspend customers | ❌ | ❌ | ✅ | ✅ |
| Suspend another admin | ❌ | ❌ | ❌ | ✅ |
| Delete users | ❌ | ❌ | ✅ (customers only) | ✅ |
| Create admin accounts | ❌ | ❌ | ❌ | ✅ |
| Change user roles | ❌ | ❌ | ❌ | ✅ |
| Assign departments | ❌ | ❌ | ❌ | ✅ |
| Promote to `super_admin` | ❌ | ❌ | ❌ | ❌ (blocked by design) |

---

## 🔌 API Reference

### Auth — `/api/auth`

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/register` | Public | Register customer or dealer |
| POST | `/login` | Public | Sign in (all roles) |
| POST | `/logout` | Public | Clear auth cookie |
| GET | `/me` | JWT | Current user profile |
| PUT | `/profile` | JWT | Update own profile |
| POST | `/forgot-password` | Public | Send reset link |
| POST | `/reset-password/:token` | Public | Reset password with token |
| GET | `/check-admin` | JWT | Admin role check |
| POST | `/create-admin` | Super Admin | Create new admin |
| GET | `/admins` | Super Admin | List all admins |
| DELETE | `/admins/:id` | Super Admin | Remove an admin |
| GET | `/dealers/pending` | Admin | List pending dealer applications |
| PATCH | `/dealers/:id/verify` | Admin | Approve / reject dealer |

### Cars — `/api/cars`

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/` | Public | List cars (filters: `search`, `type`, `location`, `startDate`, `endDate`, `sort`, `page`, `limit`) |
| GET | `/:id` | Public | Single car details |
| GET | `/:id/unavailable-dates` | Public | Booked date ranges |
| GET | `/:id/availability` | Public | Availability check for a date range |
| GET | `/popular` | Public | Most-booked cars |
| GET | `/featured` | Public | Premium / featured cars |
| POST | `/` | Dealer / Admin | Create car |
| PUT | `/:id` | Owner / Admin | Update car |
| DELETE | `/:id` | Owner / Admin | Soft-delete car |
| GET | `/mine` | Verified Dealer | Dealer's own cars |
| GET | `/admin/all` | Admin | All cars (`?includeDeleted=true` to include soft-deleted) |

### Bookings — `/api/bookings`

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/` | JWT | Create booking |
| GET | `/my-bookings` | JWT | Current user's bookings |
| GET | `/:id` | Owner / Admin | Booking details |
| PUT | `/:id/cancel` | Owner / Admin | Cancel booking |
| GET | `/dealer` | Verified Dealer | Dealer's incoming bookings |
| PUT | `/:id/dealer-decision` | Verified Dealer | Accept / decline booking |
| GET | `/` | Admin | All bookings |
| PUT | `/:id/status` | Admin | Update booking status |

### Users — `/api/users`

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/` | Admin | List all users |
| GET | `/:id` | Admin | Get user by ID |
| PUT | `/:id` | Admin | Update user |
| DELETE | `/:id` | Admin | Delete user |

**Field-level access on `PUT /api/users/:id`:**

| Field | Regular Admin | Super Admin |
|---|:-:|:-:|
| `name`, `email`, `phone` | ✅ | ✅ |
| `isVerified` | ✅ | ✅ |
| `isSuspended` | ✅ (non-admins only) | ✅ |
| `role` | ❌ | ✅ |
| `department` | ❌ | ✅ |

---

## 🧪 Testing the Full Flow

Follow this sequence after `createSuperAdmin.js` has run.

### Test 1 — Customer registration & booking
1. Go to `/signup` → register a customer
2. Browse `/cars`, pick a car, choose a date range, book it
3. Verify the booking appears on `/bookings`
4. Try booking the **same dates** as another user — calendar should block them

### Test 2 — Dealer onboarding
1. Log out. Go to `/signup` → switch to the **dealer** tab
2. Register with business name + city
3. You're redirected to `/dealer/dashboard` with an "Awaiting approval" screen
4. You **cannot** add cars yet

### Test 3 — Admin approves the dealer
1. Log in as `superadmin@carrental.com`
2. Go to `/admin/dealers`
3. Click **Approve** on the pending dealer
4. Log out, log back in as the dealer
5. You can now add cars from `/dealer/dashboard`

### Test 4 — Super admin creates a new admin
1. Still logged in as super admin
2. Go to `/admin/users` → click **Create New Admin**
3. Fill in name, email, password, phone, department
4. Submit → new admin appears in the list with role "Administrator"
5. Log out and back in as the new admin
6. Confirm the admin lands on `/admin/dashboard`

### Test 5 — Regular admin edits a customer
1. Logged in as the new admin
2. `/admin/users` → edit a customer
3. You **can** edit: name, email, phone
4. You **can** toggle: verify, suspend
5. You **cannot** edit: role, department (fields are disabled/greyed out)
6. Save → success toast, list refreshes

### Test 6 — Admin cannot escalate privileges
1. Same session
2. Try editing another **admin** → you cannot suspend them (button hidden)
3. Try editing the **super admin** → 403 "Cannot modify a Super Admin account"

### Test 7 — Refresh persistence
1. Log in as any role
2. Hit F5
3. **You stay logged in.**
4. DevTools → Network → `GET /api/auth/me` returns 200

### Test 8 — Suspended user is locked out
1. Super admin suspends a customer
2. Log in as that customer — 403 "Account suspended"
3. Any existing token returns 403 on the next authenticated request

---

## 🐛 Troubleshooting

### Refresh logs me out
**Cause**: `AuthContext.getStoredUser()` requires both `localStorage.user` **and** `localStorage.token`. If either is missing (or `GET /auth/me` fails with a non-auth error), the session is cleared.

**Check in DevTools → Application → Local Storage:**
- Both `user` and `token` present? If not, `authService.login` isn't storing them
- In DevTools → Network, look for `GET /api/auth/me`:
  - **200** → session valid
  - **401** → token expired or invalid
  - **403** → account suspended
  - **Not present at all** → `authService.getMe` is missing or threw a sync error

**Fix**: ensure `authService.js` exports a `getMe` method:
```js
getMe: async () => {
  const response = await api.get('/auth/me');
  return response.data;
},
```

And that `AuthContext.verifySession` only clears state on `401`/`403`, not on network errors.

### Refresh logs me out even when the backend is down
Same cause. `verifySession` should treat network errors as transient and keep the cached user. Only clear on explicit `401`/`403`.

### Admin login doesn't redirect to `/admin/dashboard`
The redirect depends on `user.role`. Check:
1. `localStorage.user.role === 'admin'` or `'super_admin'`
2. `SignInPage.jsx`'s redirect effect handles both admin roles
3. The backend login response includes `user.role`

### `/admin/signup` silently creates a customer
The public `register` endpoint only accepts `customer` and `dealer` roles. Sending `role: 'admin'` is silently downgraded.

**Options**:
- **Delete** the route + `AdminSignUp.jsx` + the "Need admin access?" link — admins are created only by super admins via the UI
- **Or** implement server-side validation for a `ADMIN_SIGNUP_CODE` env var

Right now, the second option is not implemented — use the UI flow.

### Dealer cannot add cars
- Confirm `dealerStatus === 'verified'` on the dealer user
- Confirm the `DealerRoute` guard isn't blocking (it shows a pending screen for unverified dealers)
- Check `server/.env → JWT_SECRET` matches between sessions

### Password reset link doesn't send
- `SMTP_*` env vars must all be set
- If missing, `/auth/forgot-password` returns **503** with `"Password reset email is not configured yet."`
- Test SMTP credentials with a tool like [Mailtrap](https://mailtrap.io) in dev

### CORS blocked when deploying
Update `server.js → allowedOrigins` with your production frontend URL. Add to `.env`:
```env
CLIENT_URL=https://your-frontend.vercel.app
```

Make sure `NODE_ENV=production` and `sameSite: 'none'` cookies use HTTPS.

### Helmet blocks cross-origin cookies
If you see cookies silently dropped in production:
```js
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginEmbedderPolicy: false,
}));
app.set('trust proxy', 1); // when behind Render / Railway / Vercel
```

---

## 🧱 Architecture Notes

### Authentication
- **Bearer token** stored in `localStorage`, sent on every request via `api.js` interceptor
- **httpOnly cookie** also set on login as a fallback
- Backend `userAuth` middleware checks the header **first**, then the cookie
- On app load, `AuthContext.verifySession` hits `GET /auth/me` to revalidate — catches suspended/deleted accounts and role changes

### Route guards
A single `RequireRole` component handles all protected routes:
```jsx
<RequireRole>                     {/* any authenticated user */}    </RequireRole>
<RequireRole role="admin">        {/* admin or super_admin */}     </RequireRole>
<RequireRole role="super_admin">  {/* super_admin only */}         </RequireRole>
<RequireRole role="dealer">       {/* verified dealers only */}    </RequireRole>
```

### Password hashing
Hashed **once**, in a `userSchema.pre('save')` hook:
```js
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```
**No controller or script hashes passwords manually.** If you add a new code path that writes `user.password`, just assign the plain value — the hook handles it.

### Booking integrity
`POST /api/bookings` atomically reserves the date range using MongoDB's `findOneAndUpdate` with a compound `$not: { $elemMatch: ... }` guard. If two users race for the same dates, only one succeeds.

### Session verification
`GET /api/auth/me` re-fetches the user from MongoDB on every app load. This means:
- ✅ Suspended accounts are kicked out on next refresh
- ✅ Deleted accounts lose access immediately
- ✅ Role changes made by an admin take effect on the user's next request

---

## 🗺️ Roadmap

- [ ] Payment gateway integration (Razorpay is already a dependency)
- [ ] Email + SMS notifications for booking confirmations
- [ ] Ratings and reviews for cars and dealers
- [ ] Multi-image upload for car listings
- [ ] Admin analytics export (CSV / PDF)
- [ ] Real-time booking updates via WebSocket
- [ ] Migrate to TypeScript
- [ ] Unit + integration tests (Jest + Supertest)
- [ ] Move to cookie-only auth to eliminate `localStorage` XSS risk
- [ ] Consolidate duplicate `formatDate` / `formatCurrency` helpers into a shared `utils` module
- [ ] Extract role/status strings into a `constants.js`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

### Code style
- Frontend: React functional components + hooks, Tailwind utility classes
- Backend: ESM modules, controllers + routes split, Mongoose models
- Avoid inline styles except for dynamic values

---

## 👤 Author

**Kedar** — MERN Stack Developer

---

## 📄 License

MIT