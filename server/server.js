import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import bookingRoutes from './routes/bookingRoutes.js';

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// In server.js, update CORS:
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
  })
);

// ===== Routes =====
import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';
import userRoutes from './routes/userRoutes.js';


app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);


// Test Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Car Rental API is working',
    endpoints: {
      auth: '/api/auth',
      cars: '/api/cars'
      
    }
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});



const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`Server running on PORT: ${PORT}`)
    );
  } catch (error) {
    console.error('Server failed to start because MongoDB is unavailable.');
    process.exit(1);
  }
};

startServer();
