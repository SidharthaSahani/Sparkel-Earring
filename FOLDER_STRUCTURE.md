# 🌟 Sparkel Earring - Complete Project Folder Structure

## 📁 Backend Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── config.js
│   │   ├── database.js
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── categoryController.js
│   │   ├── couponController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   ├── reviewController.js
│   │   ├── userController.js
│   │   └── wishlistController.js
│   │
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── rateLimiter.js
│   │   ├── roleMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── validationMiddleware.js
│   │
│   ├── models/
│   │   ├── Address.js
│   │   ├── Admin.js
│   │   ├── Cart.js
│   │   ├── Category.js
│   │   ├── Coupon.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── Review.js
│   │   ├── User.js
│   │   └── Wishlist.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── couponRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── userRoutes.js
│   │   └── wishlistRoutes.js
│   │
│   ├── utils/
│   │   ├── cloudinary.js
│   │   ├── errorHandler.js
│   │   ├── generateToken.js
│   │   ├── logger.js
│   │   ├── sendEmail.js
│   │   └── validators.js
│   │
│   └── server.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 📁 Frontend Structure
```
frontend/
├── public/
│   └── index.css
│
├── src/
│   ├── admin/
│   │   ├── AdminCoupons.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminLoginPage.tsx
│   │   ├── AdminOrders.tsx
│   │   ├── AdminProducts.tsx
│   │   └── AdminUsers.tsx
│   │
│   ├── api/
│   │   ├── adminApi.ts
│   │   ├── api.ts
│   │   ├── authApi.ts
│   │   ├── axios.ts
│   │   ├── cartApi.ts
│   │   ├── orderApi.ts
│   │   ├── productApi.ts
│   │   ├── reviewApi.ts
│   │   ├── userApi.ts
│   │   └── wishlistApi.ts
│   │
│   ├── components/
│   │   ├── AddressCard.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── Carousel.tsx
│   │   ├── CartItem.tsx
│   │   ├── Footer.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Modal.tsx
│   │   ├── Navbar.tsx
│   │   ├── OrderCard.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductFilter.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ReviewCard.tsx
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── WishlistContext.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   └── useWishlist.ts
│   │
│   ├── pages/
│   │   ├── AboutPage.tsx
│   │   ├── AdminLoginPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── FAQPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── OrdersPage.tsx
│   │   ├── PrivacyPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ShopPage.tsx
│   │   ├── TermsPage.tsx
│   │   └── WishlistPage.tsx
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── index.css
│   │
│   ├── types/
│   │   ├── index.ts
│   │   └── types.ts
│   │
│   ├── utils/
│   │   ├── cloudinaryUpload.ts
│   │   ├── formatters.ts
│   │   └── toastService.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

## ✅ Key Features

### Backend Features:
- **Authentication System**: Complete user and admin authentication
- **Database Models**: User, Admin, Product, Category, Order, Cart, Wishlist, Review, Coupon, Address
- **RESTful API**: Well-structured routes for all entities
- **Security**: Middleware for authentication, authorization, and validation
- **File Upload**: Cloudinary integration for image handling
- **Email Service**: Order confirmations and notifications

### Frontend Features:
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **State Management**: Context API for authentication, cart, and wishlist
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Admin Panel**: Separate admin interface with dashboard and management tools
- **E-commerce Functions**: Complete shopping cart, wishlist, and order management
- **Image Handling**: Cloudinary integration for product images

### Architecture:
- **Modular Structure**: Clean separation of concerns with dedicated directories
- **Scalable Design**: Easy to extend with new features and functionality
- **Best Practices**: Following industry standards for code organization
- **Type Safety**: Full TypeScript support for enhanced development experience

This folder structure supports a complete e-commerce jewelry platform with separate admin and user interfaces, comprehensive product management, and modern development practices.