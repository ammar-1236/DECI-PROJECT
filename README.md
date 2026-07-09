# E-Commerce REST API Backend Engine

[cite_start]A robust, MVC-structured RESTful API built with Node.js, Express.js, and MongoDB using Mongoose[cite: 2, 3]. [cite_start]This backend handles core data validation [cite: 17, 19, 53, 54, 95][cite_start], dynamic product filtering [cite: 59][cite_start], server-calculated shopping carts [cite: 74, 77, 79][cite_start], and real-time inventory-managed checkouts[cite: 89, 90].

---

## 🚀 Core Technical Features

* [cite_start]**Centralized Operational Error Handling**: Transformed Mongoose validation [cite: 53, 54][cite_start], casting [cite: 55][cite_start], and unique index duplication keys [cite: 56] into predictable client API responses.
* [cite_start]**Async Error Isolation**: Leverages an implicit promise-wrapping utility (`asyncHandler`) to eliminate repetitive `try-catch` blocks across all controllers[cite: 50, 58].
* [cite_start]**NoSQL Query Injection Security**: Uses `express-mongo-sanitize` middleware to strip query modifiers from incoming request payloads[cite: 2, 8].
* [cite_start]**Advanced Query Strings Pipeline**: Supports multi-parameter combined filtering strings for matching categories, price limits, stock flags, and regex search constraints.
* [cite_start]**Atomic Checkout Validation**: Checks individual item inventory volumes [cite: 89][cite_start], snapshotting unit values directly inside an immutable orders table[cite: 84, 90].

---

## 📋 Environment Configurations Table

| Variable Key | Required Type | Functional Purpose | Representative Value Sample |
| :--- | :--- | :--- | :--- |
| `PORT` | Number | [cite_start]Defines the local network interface port listener [cite: 4, 11] | `5000` |
| `NODE_ENV` | String | [cite_start]Sets runtime constraints configuration mode  | `development` |
| `MONGO_URI` | String | Connection string pointing to the active MongoDB instance [cite: 4, 14] | `mongodb://127.0.0.1:27017/ecommerce` |

---

## 📂 Architecture Project Directory Layout

```text
DECI-PROJECT/
├── config/
│   └── connectDB.js          # Establishes connection instance to the MongoDB engine
├── db/
│   └── connect.js            # Alternate internal Mongoose configuration setup module [cite: 3, 13]
├── controllers/
│   ├── cartController.js     # Manages cart state array loops and server pricing updates [cite: 3, 70]
│   ├── categoryController.js # Handles category resource lifecycle records [cite: 3, 33]
│   ├── orderController.js    # Manages transactional checkouts and stock drops [cite: 3, 86]
│   └── productController.js  # Performs complex filter matching logic for items [cite: 3, 57]
├── middleware/
│   └── errorHandler.js       # Global operational error parsing mapping transformer [cite: 3, 51]
├── models/
│   ├── cart.model.js         # Schema constraints mapping for client checkout carts [cite: 3, 69]
│   ├── category.model.js     # Schema blueprint template for item collection labels [cite: 3, 16]
│   ├── order.model.js        # Immutable data structure tracking complete receipts [cite: 3, 83]
│   └── product.model.js      # Relational entity containing price tags and stock numbers [cite: 3, 18]
├── routes/
│   ├── cartRoutes.js         # Endpoint bindings mapping under /api/cart [cite: 3, 81]
│   ├── categoryRoutes.js     # Endpoint triggers mapping under /api/categories [cite: 3, 46]
│   ├── orderRoutes.js        # Endpoint bindings mapping under /api/orders [cite: 3, 96]
│   └── productRoutes.js      # Endpoint bindings mapping under /api/products [cite: 3, 66]
├── utils/
│   ├── AppError.js           # Structural model subclassing standard Node errors [cite: 3, 48]
│   └── asyncHandler.js       # Runtime express pipeline error exception capture utility [cite: 3, 50]
├── .env                      # Local server secrets (ignored by Git) [cite: 5]
├── .env.example              # Blueprint format for public reference tracking 
├── .gitignore                # Filter rules matching folders hidden from public repo push lines [cite: 5]
├── app.js                    # Core app file hosting routing and basic middleware bindings [cite: 6, 7]
├── package.json              # App dependencies listing alongside developer script lines [cite: 1, 12]
└── seed.js                   # Automation script injecting fake database categories and products [cite: 12, 21]