// Configuration file for the application

const config = {
  port: process.env.PORT || 5000,
  database: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/earing',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_default_jwt_secret_key_here',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  },
  environment: process.env.NODE_ENV || 'development'
};

module.exports = config;