Chuks Kitchen API – Documentation
Project Overview

Chuks Kitchen API is a backend system for a food ordering platform. It allows users to register, verify via OTP, log in, browse available food items, manage their cart, place orders, and rate food items. The system enforces role-based access (Customer vs Admin simulation) and ensures secure, reliable handling of all requests.

Key Features:

User authentication with OTP verification.

Food management (CRUD) for Admin-simulated users.

Cart management for adding, updating, removing, and clearing items.

Order management with status tracking and payment simulation.

Rating system allowing users to rate and comment on food items.

System Flow & Architecture

Below are the main system flows. Each flow includes a description of decision points and how edge cases are handled.

1. User Authentication Flow

Description: Handles user registration, OTP verification, and login.

[User submits registration] 
        │
        ▼
[Check for duplicate email/phone] → Error: 409 Conflict
        │
        ▼
[Generate OTP] → Set expiration (5 minutes)
        │
        ▼
[Save user as CUSTOMER, isVerified = false]
        │
        ▼
[OTP sent (simulated)]

Edge Cases Handled:

Duplicate email or phone → returns 409 Conflict.

OTP expiration → cannot verify after 5 minutes.

Login attempts without verification → returns 403 Forbidden.


2. Food Management Flow (Admin Simulation)

Description: Admin-simulated users manage food items (create, update, delete, view).

[Admin request to create/update/delete food]
        │
        ▼
[Check x-admin header]
        │
        └─> Error: 403 Forbidden if not admin
        │
        ▼
[Validate input: name, price, availability]
        │
        └─> Error: 400 Bad Request if invalid
        │
        ▼
[Perform DB operation]
        │
        └─> Error: 404 Not Found if food ID invalid
        ▼
[Return success response with food data]

3. Cart Management Flow

Description: Users can add items to their cart, update quantity, remove items, and clear the cart.

[User action: add/update/remove/clear cart]
        │
        ▼
[Check if cart exists] → Create if not
        │
        ▼
[Check food availability]
        │
        └─> Error: 404 Not Found or 400 Unavailable
        │
        ▼
[Update DB: cart items]
        │
        ▼
[Return updated cart/item response]

Edge Cases Handled:

Adding unavailable food → 400 error.

Quantity <= 0 → 400 error.

Removing non-existent item → 404 error

4. Order Management Flow

Description: Users place orders from cart, view orders, cancel, and update payment status (admin simulation).

[User places order]
        │
        ▼
[Fetch user cart]
        │
        └─> Error: 400 if cart empty
        │
        ▼
[Check availability of each food item]
        │
        └─> Error: 400 if any item unavailable
        │
        ▼
[Calculate total amount]
        ▼
[Create order and snapshot item prices]
        ▼
[Clear cart]
        ▼
[Return order confirmation]

5. Rating Management Flow

Description: Users can submit or update ratings for food items, and view ratings.

[User submits rating]
        │
        ▼
[Validate rating value (1-5)]
        │
        └─> Error: 400 Bad Request if invalid
        │
        ▼
[Check food existence]
        │
        └─> Error: 404 Not Found if food missing
        │
        ▼
[Upsert rating in DB]
        ▼
[Return updated rating info]

Edge Cases Handled:

Rating outside 1-5 → 400 error.

Food does not exist → 404 error.

Assumptions

Users cannot self-assign Admin role; x-admin header simulates admin actions.

OTP verification is required before login.

Payment processing is simulated; no real payment gateway integration.

Cart items can be added even if stock is not tracked beyond availability.


<!-- Data Modeling (ERD / Table Structure) -->

Entities:

User: id, name, email, phone, role, OTP, isVerified

Food: id, name, description, price, availability

Cart & CartItem: userId, foodId, quantity

Order & OrderItem: userId, totalAmount, status, paymentStatus, food snapshot

Rating: userId, foodId, value, comment

User ───< Cart ───< CartItem >─── Food
User ───< Order ───< OrderItem >─── Food
User ───< Rating >─── Food

Scalability Considerations

Database Indexing: Frequently queried fields such as email, foodId, userId, and createdAt are indexed to improve query performance, especially for user searches, order retrieval, and rating lookups.

Pagination:

Implemented on endpoints that return lists (e.g., foods, orders, ratings).

This avoids returning huge datasets at once, reducing server load and response time.

Example: /foods?page=1&limit=20 → fetches 20 foods per page.

Orders and ratings endpoints also support page and limit query parameters for efficient data retrieval.

Caching: Popular foods, top-rated items, and frequently accessed ratings are cached (e.g., Redis) to minimize database hits and improve response times for heavy-read endpoints.

Horizontal Scaling: Backend can scale horizontally using load balancers to distribute traffic if user requests grow from 100 → 10,000+ concurrently.

Async Tasks: Time-consuming operations such as sending OTP emails or SMS messages are offloaded to asynchronous task queues to prevent blocking API responses.