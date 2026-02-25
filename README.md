🍽️ Chuks Kitchen Backend API

A robust backend system for a food ordering platform that allows users to browse food items, manage carts, place orders, and rate meals. The system is designed using clean architecture principles with proper validation, error handling, and scalability considerations.

📌 System Overview

This system provides RESTful APIs that support the full lifecycle of a food ordering experience.

End-to-End Workflow

Users register and verify their account.

Users browse available food items.

Users add food items to their cart.

Users update cart quantities as needed.

Users place an order from the cart.

Orders transition through payment states.

Users can rate food items after ordering.

The backend ensures data integrity, consistency, and secure operations through layered validation and database constraints.

🔄 Flow Explanation
👤 User Registration & Authentication Flow

User submits registration details.

System validates required fields and uniqueness (email/phone).

User record is created with verification status set to false.

OTP is generated and sent to the user.

User verifies OTP.

Account becomes active for login.

Why this design?

Prevents fake or invalid accounts

Enables secure onboarding

Supports future authentication extensions

🛒 Cart Management Flow

User selects a food item.

System checks food availability.

System retrieves existing cart or creates one automatically.

Item is added or quantity updated.

Cart total is recalculated.

Why this design?

Ensures every user always has a cart

Prevents duplicate cart entries

Maintains accurate pricing

📦 Order Creation Flow

User initiates checkout.

System verifies cart is not empty.

Order is created using a snapshot of cart items.

Order status set to PENDING.

Payment status updated separately.

Cart may be cleared after successful order creation.

Why this design?

Protects historical order data

Ensures pricing consistency even if food prices change later

Supports external payment integration

⭐ Rating Flow

User submits rating for a food item.

System validates rating range (1–5).

System verifies food exists.

Rating is stored using upsert:

New rating created OR

Existing rating updated

Average rating recalculated when queried.

Why this design?

Prevents duplicate ratings per user

Maintains clean feedback data

Supports dynamic average calculation

⚠️ Edge Case Handling & Failure Management

The system includes comprehensive safeguards against invalid input, inconsistent states, and unexpected behavior.

🧾 Input Validation & Data Integrity
Missing Required Fields

Requests missing required data return 400 Bad Request.

Prevents unnecessary database operations.

Invalid IDs

IDs are validated and converted to numeric values.

Non-existent resources return 404 Not Found.

👤 User & Authentication Edge Cases
Duplicate Registration

Email and phone fields are unique.

Duplicate attempts return an error.

Unverified Accounts

Login is blocked until OTP verification is complete.

Expired OTP

OTPs include expiration timestamps.

Expired tokens are rejected.

🛒 Cart Edge Cases
Adding Unavailable Food

Items marked unavailable cannot be added.

Invalid Quantity

Quantities less than or equal to zero are rejected.

Duplicate Cart Items

Existing cart items are updated instead of duplicated.

User Without Cart

System automatically creates a cart if none exists.

📦 Order Edge Cases
Checkout with Empty Cart

Order creation is blocked.

Cancelling Completed Orders

Only orders with PENDING status can be cancelled.

Price Changes After Order

Order items store price snapshots.

Historical orders remain accurate even if food prices change.

⭐ Rating Edge Cases
Invalid Rating Value

Only values between 1 and 5 are accepted.

Rating Non-existent Food

Request rejected with 404 Not Found.

Multiple Ratings by Same User

Upsert prevents duplicate entries.

Existing rating is updated.

🧱 System-Level Protections

Centralized error handling middleware

Consistent API error responses

Database foreign key constraints

Composite unique constraints where required

Async error capture using middleware

📐 Assumptions

Due to incomplete product specifications, the following assumptions were made:

Single cart per user

Payment handled externally

No inventory quantity tracking

Ratings allowed without purchase verification

Authentication uses basic token-based logic

Delivery logistics not included

📈 Scalability Considerations
For ~100 Users

Single server deployment sufficient

Relational database with standard indexing

Minimal caching required

For 10,000+ Users

The system could evolve to include:

Performance Enhancements

Database indexing optimization

Query optimization

Read replicas for heavy traffic

Connection pooling

Infrastructure Scaling

Load-balanced application servers

Horizontal scaling

Cloud deployment

Caching Strategy

Redis for frequently accessed data

Cached food listings

Cached average ratings

Asynchronous Processing

Background jobs for notifications

Queue systems for heavy tasks

🗂️ Data Model Overview
Key Entities
User

Stores authentication and profile data

One-to-one relationship with Cart

One-to-many relationship with Orders and Ratings

Food Item

Represents menu items

Can be rated by many users

Can appear in many carts and orders

Cart

Belongs to one user

Contains multiple cart items

Order

Created from cart contents

Contains multiple order items

Tracks payment and status

Rating

Links a user to a food item

Composite uniqueness ensures one rating per user per food

🔗 Relationship Summary

User → Cart (1:1)

User → Orders (1:N)

User → Ratings (1:N)

Food → Ratings (1:N)

Cart → CartItems (1:N)

Order → OrderItems (1:N)

🚀 Running the Project
Requirements

Node.js (v18 or higher recommended)

Package manager (npm or yarn)

Database (PostgreSQL/MySQL supported by Prisma)

Setup Steps
# Clone repository
git clone <repository-url>

# Navigate to project folder
cd chuks-kitchen-backend

# Install dependencies
npm install

# Configure environment variables
Create a .env file with database connection and other configs

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev

Server will start on:

http://localhost:PORT
📦 API Output Format
Success Response
{
  "status": "success",
  "data": { ... }
}
Error Response
{
  "status": "error",
  "message": "Description of error"
}
🎯 Project Objectives

This project demonstrates the ability to:

Design backend systems from product requirements

Implement clean API architecture

Handle complex flows and state transitions

Manage edge cases effectively

Model relational data

Build scalable backend solutions

Communicate technical design clearly
