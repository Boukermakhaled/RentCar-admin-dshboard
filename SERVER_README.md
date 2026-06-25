# ShowroomBack API (Endpoints)

Base URL (by `server.js`):

- `SERVER_URL/api`

Static files:
- Images are served from: `GET /uploads/*` (Express static middleware)

> Note: Admin routes in `routes/AdminRoute.js` are currently **not protected** because `AdminRoute.use(isAuthenticated, isAdmin)` is commented out.

---

## Cars (Public)

### List cars
- **GET** `/api/cars`
- Query params:
  - `lim` (number, optional, default `12`)
  - `page` (number, optional, default `1`)
  - `search` (string, optional; matches `cars.brand` or `cars.model` via `ILIKE`)
  - `brand` (string, optional; if `"Any"` it’s ignored)
  - `available` (boolean, optional)
- Response: `{ totalRows, totalPages, currentPage, cars }`

### Get car by id
- **GET** `/api/cars/:id`
- Path params:
  - `id`
- Response: `{ car }`

---

## Authentication (Admin)

The auth routes are defined in `routes/authRoute.js` as:
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

However, in `server.js` the mounting line is commented out:
- `// app.use("/api/auth", authRouter);`

So these endpoints are **NOT currently active** unless you uncomment that line.

### Login
- **POST** `/api/auth/login`
- Body:
  - `username`, `password`
- Response: `{ accessToken }`
- Sets `refreshToken` cookie (httpOnly).

### Refresh access token
- **POST** `/api/auth/refresh`
- Uses cookie `refreshToken`.
- Response: `{ accessToken }`

### Logout
- **POST** `/api/auth/logout`
- Clears `refreshToken` cookie.
- Response: `{ message }`

---

## Admin (Cars, Orders, Stats)

Mounted at:
- `app.use("/api/admin", AdminRoute);`

### Cars (Dashboard)

#### List cars (dashboard)
- **GET** `/api/admin/cars`
- Query params:
  - `lim` (default `12`)
  - `page` (default `1`)
  - `search` (matches brand/model)
  - `brand` (if not `"Any"`)
  - `available`
- Response: `{ totalRows, totalPages, currentPage, cars }`
- Note: returns a simplified car object including `image` (first image URL) rather than all images.

#### Get car by id (dashboard)
- **GET** `/api/admin/cars/:id`
- Response: `{ car }` (same `getCar` controller as public)

#### Add a car
- **POST** `/api/admin/cars`
- Middleware chain:
  - `upload.array("images", 4)` (multipart/form-data)
  - `convertToWebp`
  - `addCar`
- Content type:
  - `multipart/form-data`
- Form fields:
  - `brand`
  - `model`
  - `year`
  - `price`
  - `fuel`
  - `gearbox`
  - `engine`
  - `horsepower`
  - `torque`
  - `available` (optional; default `true`)
  - `car_type`
  - `notes`
  - `plate`
  - `images` (up to 4 images, any image/*; each becomes a webp)
- Response: `201 { message, car }`

#### Update a car
- **PUT** `/api/admin/cars/:id`
- Middleware chain:
  - `upload.array("images", 4)`
  - `convertToWebp`
  - `updateCar`
- Content type:
  - `multipart/form-data`
- Path params:
  - `id`
- Body fields: any subset of:
  - `brand`, `model`, `year`, `price`, `fuel`, `gearbox`, `available`, `engine`, `horsepower`, `torque`, `car_type`, `notes`, `plate`
- Images:
  - If `images` is provided, old images are deleted and replaced.
  - If `images` is not provided, car fields can still be updated.
- Response:
  - `200 { message, car }`
  - `400 { message: "No fields to update" }`
  - `404 { message: "Car not found" }`

#### Delete a car
- **DELETE** `/api/admin/cars/:id`
- Path params:
  - `id`
- Response:
  - `200 { message, car }`
  - `404 { message: "Car not found" }`

---

### Orders (Dashboard)

#### List orders
- **GET** `/api/admin/orders`
- Query params:
  - `lim` (default `12`)
  - `page` (default `1`)
  - `status` (filters `orders.status`)
  - `payment` (filters `orders.payment_status`)
  - `search` (matches client full name, car brand, or car model)
- Response: `{ totalRows, totalPages, currentPage, orders }`

#### Get order by id
- **GET** `/api/admin/orders/:id`
- Response: `{ order }`
- Returns related client + car details and the first car image URL.

#### Update order
- **PUT** `/api/admin/orders/:id`
- Body (any subset):
  - `start_date`, `end_date`, `receiving_place`, `status`, `total_price`, `client_id`, `car_id`
- Response:
  - `200 { message, order }`
  - `400 { message: "No fields to update" }`
  - `404 { message: "Order not found" }`

#### Delete order (archive)
- **DELETE** `/api/admin/orders/:id`
- Behavior:
  - Inserts the order into `orders_archive`
  - Deletes it from `orders`
  - A background cleanup runs to delete archived rows after `delete_at <= NOW()` (see `cleanArchive`)
- Response: `200 { message }`
- Errors: `404 { message: "Order not found" }`

---

### Stats

#### Get dashboard stats
- **GET** `/api/admin/stats`
- Query params:
  - `year` (optional; defaults to current year)
- Response: 
  - `stats` (cards metrics)
  - `orders_over_time` (monthly counts within the selected year)
  - `car_demand` (per-car demand including percentage)

---

## Middleware / Upload Notes (Relevant to Endpoints)

- `upload.array("images", 4)`:
  - Accepts up to **4** files under field name `images`
  - Each file must be `image/*`
  - Max file size: **5MB** per file (in-memory)
- `convertToWebp`:
  - Converts uploaded images to webp with quality `80`
  - Stores them under `uploads/` directory
  - Populates `req.imageUrls` with URLs like `/uploads/<filename>.webp`

---

## Example Requests

List cars:
```http
GET /api/cars?brand=BMW&available=true&search=audi&page=1&lim=12
```

Add car (multipart):
```http
POST /api/admin/cars
Content-Type: multipart/form-data

brand=BMW
model=420d
year=2023
price=... 
fuel=Diesel
gearbox=Automatic
engine=...
horsepower=...
torque=...
car_type=...
notes=...
plate=...
images=<file1>,<file2>
```

Fetch stats:
```http
GET /api/admin/stats?year=2026
```

