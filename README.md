Chuks Kitchen API 🍽️
Project Overview

Chuks Kitchen is a backend API for a food ordering system. It allows users to:

Register and login using OTP verification

Browse available foods

Add foods to a cart, update quantities, or remove items

Place orders directly from their cart

Rate food items after ordering

Admins (simulated) can manage foods and update payment status

The backend is built using Node.js, Express, Prisma ORM, and PostgreSQL. All APIs follow REST principles.

System Architecture
User ↔ API Server (Express) ↔ Database (PostgreSQL via Prisma)

User: Interacts via frontend or Postman.

API Server: Handles routes for Users, Foods, Cart, Orders, Ratings.

Database: Stores users, foods, carts, orders, and ratings.

Flows
1. User Registration & Login

User submits name, email, phone.

System checks for duplicate email or phone.

OTP generated → stored in database with 5-min expiration.

User verifies OTP → account marked as verified.

User can login → a new OTP is sent for authentication.

Decisions:

OTP ensures secure login without password.

Duplicate checks prevent conflicts.

2. Food Management

GET /api/foods: Returns all available foods.

POST /api/foods: Admin can add food (simulated).

PUT /api/foods/:id: Admin updates food info.

DELETE /api/foods/:id: Admin removes food.

Decisions:

Only verified admins can manage foods.

Optional image upload handled via Cloudinary.

3. Cart Management

User adds food to cart (POST /api/cart/add).

System checks if food exists & is available.

If item exists in cart → quantity updated; else → new item added.

User can view cart, update quantities, remove items, or clear cart.

Decisions:

getOrCreateCart ensures each user always has a cart.

Prevents quantity <= 0.

4. Orders

User places order (POST /api/orders).

System calculates total based on cart items and food prices.

Creates order, saves snapshot of food price, clears cart.

Users can view orders, cancel pending orders.

Admin can update payment status (PENDING, PAID, FAILED).

Decisions:

Snapshot prices ensure order reflects exact purchase amount.

Only pending orders can be cancelled.

5. Ratings

Users can rate foods (POST /api/ratings) after ordering.

System supports upsert → user can update previous rating.

Ratings include value (1–5) and optional comment.

Average rating computed for each food.

Decisions:

Enforces 1–5 scale.

Users cannot rate non-existent foods.

Edge Case Handling
Scenario	Handling
Add unavailable food to cart	Returns Food unavailable error
Quantity <= 0	Returns Quantity must be at least 1 error
Duplicate email or phone	Returns Email/Phone already registered
Login without verification	Returns Please verify your account first
Cancel completed/cancelled order	Returns Cannot cancel error
Invalid IDs (food, cart, order)	Returns Not found error
OTP expired	Returns OTP has expired error
Assumptions

OTP is simulated via console logs (no real SMS/email).

Admin endpoints are simulated (no real authentication).

Each user can have only one cart at a time.

Price changes after order do not affect past orders (snapshot taken).

Scalability Thoughts

Users grow from 100 → 10,000+

Add database indexes for frequent queries.

Introduce Redis caching for GET endpoints.

Implement pagination for listing foods and orders.

Use queue system for sending OTP emails at scale.

Data Model
Entities

User – id, name, email, phone, isVerified, role

Food – id, name, price, description, imageUrl, isAvailable

Cart – id, userId, items

Order – id, userId, totalAmount, status, paymentStatus, items

Rating – id, userId, foodId, value, comment

Relationships

User → Cart: One-to-One

Cart → CartItem → Food: Many-to-Many with quantity

User → Order: One-to-Many

Order → OrderItem → Food: Many-to-Many with quantity & price snapshot

User → Rating → Food: One-to-Many (user can update rating)

(Optional ERD diagram can be attached as PNG in repo)

Technical Setup

Clone repo:

git clone https://github.com/realmike-osa/chuks-kitchen.git

Install dependencies:

npm install

Create .env with database URL:

DATABASE_URL="postgresql://username:password@localhost:5432/chukskitchen"

Run Prisma migrations:

npx prisma migrate dev --name init

Start server:

npm run dev

API runs at http://localhost:5000

Test APIs via Postman or integrate with a frontend.

Repository

GitHub URL: https://github.com/realmike-osa/chuks-kitchen

All code, flow diagrams, and README included.
