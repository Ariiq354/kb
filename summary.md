# Project Summary

## Tech Stack

- Next.js
- PostgreSQL
- Drizzle ORM
- Better Auth


## User Profile

Table:

- `user_profile`

Each user can have only one profile.

The profile contains personal information used for the Ta'aruf feature, including:

- Personal identity
- Birth date
- Address
- Gender
- Family information
- Education
- Occupation
- Physical information
- Religion
- Income
- Hobbies
- Instagram
- Partner criteria
- Profile photo
- Personal description

A user is considered eligible to join the matchmaking feature after completing their profile.

---

## Ta'aruf System

This project does **not** implement Tinder-like matching.

Users manually choose another participant to begin a Ta'aruf process.

The process is managed by administrators.

Tables:

- `taaruf_proses`
- `taaruf_proses_logs`

## Ta'aruf Status

- PENDING
- APPROVED
- PROFILE_EXCHANGE
- TAARUF
- REJECTED
- CANCELLED
- MARRIED

Every status change should create a new record inside `taaruf_proses_logs`.

---

## Matchmaking Rules

A participant should only appear inside "Cari Jodoh" when:

- They have completed their profile.
- They are not the current user.
- They match required criteria (for example opposite gender).
- They currently have fewer than **3 active Ta'aruf processes**.

The active process count should always be calculated from the database.

Never store an active process counter.

---

## Commercial System

The platform sells three kinds of products.

- Bootcamp
- Ebook
- Course

Every purchasable item starts from the `produk` table.

Product types:

- BOOTCAMP
- EBOOK
- COURSE

---

## Product

Table:

`produk`

Contains common information:

- title
- price
- cover image
- product type
- active status

Specific product information is stored in separate tables.

---

## Bootcamp

Table:

`bootcamp`

Contains:

- description
- ONLINE / OFFLINE / HYBRID
- venue
- event schedule
- speaker
- Google Maps link
- Meeting link

Rules:

ONLINE:
- Uses meetingLink.

OFFLINE:
- Uses tempat and optional googleMapLink.

HYBRID:
- Uses both.

---

## Ebook

Table:

`ebook`

Contains:

- description
- PDF URL

Users may access the PDF only after payment has been verified.

---

## Course

Tables:

- course
- course_section
- course_lesson
- course_progress

Hierarchy:

Course

→ Sections

→ Lessons

Each lesson contains:

- title
- video URL
- duration
- order

User learning progress is stored inside `course_progress`.

---

## Purchase Flow

All purchases use the `orders` table.

Flow:

Select Product

↓

Create Order (Generate Unique Kode in the price random between 1-500 that added to the price so admin can check manually)

↓

PENDING_PAYMENT


↓

WAITING_VERIFICATION

↓

Admin verifies payment

↓

PAID

↓

User receives access to the purchased product.

---

## Orders

Table:

`orders`

Contains:

- buyer
- product
- applied discount
- original price
- discount percentage
- final price
- order status

Order Status:

- PENDING_PAYMENT
- WAITING_VERIFICATION
- PAID

Historical prices should always come from the order record.

Never recalculate prices from the current product price or discount.

---

## Discount System

Table:

`diskon`

Contains:

- coupon code
- percentage discount
- expiration date
- usage limit
- usage count
- active status

The application should validate:

- coupon exists
- active
- not expired
- usage limit not exceeded

Increase `jumlahDipakai` only after a successful paid order.

---

## Design Principles

- Keep the MVP simple.
- Better Auth manages authentication only.
- User profile stores all matchmaking information.
- Admin controls the entire Ta'aruf process.
- All products share one product table.
- Product-specific data belongs in separate tables.
- Manual bank transfer is the only payment method.
- Users gain access only after admin verification.
- Business logic should live in the application layer, not inside the database.
- The schema should remain easy to extend without major structural changes.
