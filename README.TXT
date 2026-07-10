# E-Commerce REST API

## GitHub Repository

Repository Link:
https://github.com/ammar-1236/DECI-PROJECT.git
---

## Project Description

This project is a RESTful E-Commerce API developed using Node.js, Express.js, and MongoDB. It provides a backend system for managing categories, products, shopping carts, and customer orders. The application follows REST architecture and implements CRUD operations, centralized error handling, data validation, and secure database communication.

---

## Features

- Categories Management
  - Create Category
  - Get All Categories
  - Get Category by ID
  - Update Category
  - Delete Category

- Products Management
  - Create Product
  - Get All Products
  - Get Product by ID
  - Update Product
  - Delete Product

- Shopping Cart
  - Add Product to Cart
  - View Cart
  - Update Cart Item Quantity
  - Remove Item from Cart

- Orders
  - Create Order from Cart
  - View All Orders
  - View Order by ID
  - Update Order Status
  - Delete Order

---

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- express-mongo-sanitize
- Nodemon

---

## Project Structure

```
DECI/
│
├── config/
│   └── connectDB.js
│
├── controllers/
│   ├── categoryController.js
│   ├── productController.js
│   ├── cartController.js
│   └── orderController.js
│
├── middleware/
│   └── errorHandler.js
│
├── models/
│   ├── category.model.js
│   ├── product.model.js
│   ├── cart.model.js
│   └── order.model.js
│
├── routes/
│   ├── categoryRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
│
├── utils/
│   ├── AppError.js
│   └── asyncHandler.js
│
├── app.js
├── server.js
├── seed.js
├── .env.example
├── package.json
└── README.md
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git
```

### 2. Navigate to the project

```bash
cd <YOUR_REPOSITORY_NAME>
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### 5. Seed the database

```bash
node seed.js
```

### 6. Start the development server

```bash
npm run dev
```

---

## API Endpoints

### Categories

| Method | Endpoint |
|---------|----------|
| GET | /api/categories |
| GET | /api/categories/:id |
| POST | /api/categories |
| PATCH | /api/categories/:id |
| DELETE | /api/categories/:id |

### Products

| Method | Endpoint |
|---------|----------|
| GET | /api/products |
| GET | /api/products/:id |
| POST | /api/products |
| PATCH | /api/products/:id |
| DELETE | /api/products/:id |

### Cart

| Method | Endpoint |
|---------|----------|
| GET | /api/cart |
| POST | /api/cart |
| PATCH | /api/cart/:id |
| DELETE | /api/cart/:id |

### Orders

| Method | Endpoint |
|---------|----------|
| GET | /api/orders |
| GET | /api/orders/:id |
| POST | /api/orders |
| PATCH | /api/orders/:id |
| DELETE | /api/orders/:id |

---

## Error Handling

The API uses centralized error handling to provide consistent JSON responses.

Example:

```json
{
  "status": "error",
  "message": "Resource not found"
}
```

---

## Security

- MongoDB query sanitization using `express-mongo-sanitize`
- Input validation with Mongoose
- Centralized error handling
- Async error handling using a custom `asyncHandler`

---

## Testing

All API endpoints were tested using Postman.

---

## Author

**Ammar Mahmoud**

DECI Backend Development Project