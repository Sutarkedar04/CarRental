import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import bookingRoutes from './routes/bookingRoutes.js';
import helmet from 'helmet';
import morgan from 'morgan';



// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// In server.js, update CORS:
const allowedOrigins = [
  "http://localhost:5173",
  "https://car-rental-ashen-gamma.vercel.app",
  "https://car-rental-git-main-kedar-sutar.vercel.app",
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests (Postman, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (process.env.NODE_ENV !== 'production') {
        console.log("Blocked Origin:", origin);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
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
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', err.message);
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, error: 'Invalid ID format' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, error: err.message });
  }

  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Server Error' : err.message,
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