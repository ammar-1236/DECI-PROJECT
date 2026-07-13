# DECI E-Commerce REST API

A RESTful backend API for a simple e-commerce platform. It manages product categories and products, a shopping cart with server-side price and stock validation, and customer orders.

**Tech Stack:** Node.js, Express.js, MongoDB, Mongoose

## Features

- **Categories API** — full CRUD for product categories
- **Products API** — full CRUD, with filtering (category, price range, stock, search) and category-existence validation
- **Cart API** — add, update, and remove items with automatic price snapshotting and stock checks
- **Orders API** — checkout from the cart, plus order history and lookup
- Centralized error handling for validation errors, invalid IDs, duplicate keys, and unexpected server errors
- Request sanitization against NoSQL injection (`express-mongo-sanitize`)

## Prerequisites

- **Node.js** v18 or higher
- **MongoDB** — running locally, or a connection string from MongoDB Atlas
- **npm** (bundled with Node.js)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ammar-1236/DECI-PROJECT.git
   cd DECI-PROJECT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example file and fill in your own values:
   ```bash
   cp .env.example .env
   ```
   See the [Environment Variables](#environment-variables) table below.

4. **Seed the database**

   Clears any existing Categories/Products/Orders and inserts sample data.
   ```bash
   npm run seed
   ```

5. **Run the server**
   ```bash
   npm run dev
   ```
   Or, without auto-restart:
   ```bash
   npm start
   ```

   The API will be available at `http://localhost:5000/api`.

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the Express server listens on | `5000` |
| `NODE_ENV` | Application environment | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/deci-ecommerce` |

## API Endpoints

All routes are prefixed with `/api`. Every response follows the shape:
```json
{ "status": "success" | "error", "message": "...", "data": ... }
```

### Categories

| Method | URL | Description |
|---|---|---|
| `GET` | `/api/categories` | Get all categories |
| `GET` | `/api/categories/:id` | Get a single category by ID |
| `POST` | `/api/categories` | Create a new category |
| `PATCH` | `/api/categories/:id` | Update a category |
| `DELETE` | `/api/categories/:id` | Delete a category |

### Products

| Method | URL | Description |
|---|---|---|
| `GET` | `/api/products` | Get all products. Supports `?category=`, `?minPrice=`, `?maxPrice=`, `?inStock=true`, `?search=` — all optional and combinable |
| `GET` | `/api/products/:id` | Get a single product, with its category populated |
| `POST` | `/api/products` | Create a new product (validates that the category exists) |
| `PATCH` | `/api/products/:id` | Update a product |
| `DELETE` | `/api/products/:id` | Delete a product |

### Cart

| Method | URL | Description |
|---|---|---|
| `GET` | `/api/cart` | Get the current cart, with product details populated |
| `POST` | `/api/cart` | Add an item to the cart (body: `{ product, quantity }`). Increases quantity if the item is already in the cart; price is always read from the database |
| `PATCH` | `/api/cart/items/:productId` | Update the quantity of an item |
| `DELETE` | `/api/cart/items/:productId` | Remove a single item from the cart |
| `DELETE` | `/api/cart` | Clear the entire cart |

### Orders

| Method | URL | Description |
|---|---|---|
| `POST` | `/api/orders` | Create an order from the current cart (checkout) |
| `GET` | `/api/orders` | Get all orders |
| `GET` | `/api/orders/:id` | Get a single order by ID |
| `PATCH` | `/api/orders/:id` | Update an order |
| `DELETE` | `/api/orders/:id` | Delete an order |

## Project Structure

```
DECI-PROJECT/
├── app.js                  # Express app: middleware, routes, error handler
├── server.js               # Entry point: connects to the DB and starts the server
├── seed.js                 # Seeds the database with sample categories & products
├── .env.example             # Template listing required environment variables
├── .gitignore                # Excludes node_modules/ and .env from git
│
├── db/
│   └── connectDB.js        # MongoDB connection logic
│
├── models/                 # Mongoose schemas
│   ├── category.model.js
│   ├── product.model.js
│   ├── cart.model.js
│   └── order.model.js
│
├── controllers/            # Request handlers / business logic
│   ├── categoryController.js
│   ├── productController.js
│   ├── cartController.js
│   └── orderController.js
│
├── routes/                 # Express routers mapping URLs to controllers
│   ├── categoryRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
│
├── middleware/
│   └── errorHandler.js     # Central error handler (validation, cast, duplicate-key, AppError, generic)
│
├── utils/
│   ├── AppError.js         # Custom operational error class
│   └── asyncHandler.js     # Wraps async route handlers to forward errors to next()
│
└── postman/
    └── DECI-E-Commerce-API.postman_collection.json   # Postman collection for manual API testing
```

**Folder purposes:**

- **`db/`** — the MongoDB connection setup
- **`models/`** — Mongoose schema definitions for each collection (Category, Product, Cart, Order)
- **`controllers/`** — the logic for each endpoint: querying the database, validating input, and building responses
- **`routes/`** — maps HTTP methods and URLs to the correct controller functions
- **`middleware/`** — cross-cutting request logic, currently the centralized error handler
- **`utils/`** — small reusable helpers: `AppError` for structured errors, `asyncHandler` to avoid repetitive try/catch blocks
- **`postman/`** — exported Postman collection for manually testing every endpoint