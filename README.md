Food Ordering API Documentation
1. System Overview

The Food Ordering API is a backend system designed to simulate a simple food delivery platform. It allows users to register, authenticate, browse food items, manage a shopping cart, place orders, and submit ratings for foods. Admin functionality is simulated via a header (x-admin: true) for operations like creating, updating, or deleting foods, and updating payment status.

Key Features:

User registration, OTP verification, and OTP-based login

Food CRUD operations with rating calculation

Cart management (add, update, remove, clear items)

Order management (create, cancel, view, update payment status)

Rating system (submit/update rating, get all ratings for a food)

Error handling and validation throughout

Architecture Overview:

Controllers: Handle HTTP requests/responses

Services: Contain business logic and validation

Prisma ORM: Handles database interactions

Middleware: Error handling (asyncHandler), admin simulation (simulateAdmin), and validation

2. Flow Explanation
2.1 User Authentication Flow

Registration

Endpoint: POST /users/register

Validates email and phone uniqueness

Generates OTP and stores in DB

Returns success message

OTP Verification

Endpoint: POST /users/verify-otp

Validates OTP and expiration

Marks user as verified

Login

Endpoint: POST /users/login

Generates OTP for login

Ensures user is verified

Edge Case Handling:

Duplicate email/phone → returns 400 error

Expired or invalid OTP → returns 400 error

Unverified user login → blocked

2.2 Food Management Flow

Get All Foods

Endpoint: GET /foods

Returns all available foods with average rating

Get Food by ID

Endpoint: GET /foods/:id

Returns food details with ratings

Admin Actions

Create Food: POST /foods with x-admin: true

Update Food: PUT /foods/:id with x-admin: true

Delete Food: DELETE /foods/:id with x-admin: true

Edge Case Handling:

Invalid ID → returns 400 error

Food not found → returns 404 error

Missing required fields (name, price) → returns 400 error

Name or price invalid → returns 400 error

2.3 Cart Management Flow

Add Item to Cart

Endpoint: POST /cart/add

Validates food existence and availability

Increases quantity if item already in cart

View Cart

Endpoint: GET /cart/:userId

Returns all items in user cart with food details

Update Cart Item

Endpoint: PUT /cart/update

Updates quantity (≥1)

Remove Item

Endpoint: DELETE /cart/remove

Deletes a specific item from cart

Clear Cart

Endpoint: DELETE /cart/clear/:userId

Removes all items

Edge Case Handling:

Food not available → 400 error

Cart item not found → 404 error

Invalid quantity → 400 error

Empty cart → 400 when creating order

2.4 Order Management Flow

Create Order from Cart

Endpoint: POST /orders

Validates cart and item availability

Calculates total amount

Clears cart after order creation

Get Orders

Endpoint: GET /orders?userId=<id> (optional)

Returns all orders or user-specific orders

Get Order by ID

Endpoint: GET /orders/:id

Cancel Order

Endpoint: PUT /orders/:id/cancel

Only allows cancellation if order is not COMPLETED or CANCELLED

Update Payment Status (Admin simulation)

Endpoint: PUT /orders/:id/payment with x-admin: true

Validates status (PENDING, PAID, FAILED)

Edge Case Handling:

Empty cart → 400 error

Item unavailable during order → 400 error

Cancelling completed or already cancelled order → 400 error

Invalid order ID → 400 error

Order not found → 404 error

2.5 Rating Management Flow

Add/Update Rating

Endpoint: POST /ratings

Upserts rating per user per food

Validates rating value between 1–5

Get Ratings

Endpoint: GET /ratings/:foodId

Returns all ratings with user info and average rating

Edge Case Handling:

Invalid food ID → 400 error

Rating outside 1–5 → 400 error

Food not found → 404 error

3. Assumptions

Users are uniquely identified by email.

Admin access is simulated via x-admin: true.

OTPs are sent via console (simulation for assignment).

Cart is auto-created if missing.

Images for foods are optional; Cloudinary integration is placeholder.

Ratings are single per user per food.

4. Scalability Thoughts

Current design: Works efficiently for hundreds of users.

Future improvements for 10,000+ users:

Add pagination to GET /foods and GET /ratings/:foodId.

Cache frequently accessed food items.

Queue email/SMS OTP sending for high load.

Shard cart and order tables in the database.

Separate microservices for orders, payments, and notifications.

5. Data Modeling
5.1 Entity Relationship Diagram (ERD)
User (1) ──< Cart >──< CartItem >──> Food
User (1) ──< Order >──< OrderItem >──> Food
User (1) ──< Rating >──> Food
5.2 Table Overview
Entity	Key Fields	Relationships
User	id, name, email, phone, role	1:M → Orders, Ratings, Cart
Food	id, name, price, isAvailable	1:M → Ratings, OrderItems, CartItems
Cart	id, userId	1:M → CartItems
CartItem	id, cartId, foodId, quantity	M:1 → Cart, M:1 → Food
Order	id, userId, totalAmount, status	1:M → OrderItems
OrderItem	id, orderId, foodId, quantity, price	M:1 → Order, M:1 → Food
Rating	id, userId, foodId, value, comment	M:1 → User, M:1 → Food
