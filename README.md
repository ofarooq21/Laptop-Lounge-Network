# Laptop Lounge Network Web Application

A web application that allows users to exchange laptops with other users. Built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- Create, read, update, and delete laptop listings
- Make and manage exchange offers
- Session-based user management
- Flash messages for user feedback
- Responsive design

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (MongoDB Atlas)
- **Template Engine**: EJS
- **Authentication**: Session-based with bcryptjs
- **Styling**: Custom CSS
- **Additional Libraries**:
  - express-session for session management
  - connect-mongo for session storage
  - connect-flash for flash messages
  - method-override for HTTP method override
  - mongoose for MongoDB object modeling
  - express-validator for input validation

## Project Structure

```
├── app.js              # Main application file
├── routes/             # Route handlers
│   ├── itemRoutes.js   # Laptop listing routes
│   ├── offerRoutes.js  # Exchange offer routes
│   └── userRoutes.js   # User authentication routes
├── controllers/        # Business logic
├── models/            # Database models
├── views/             # EJS templates
├── public/            # Static assets
└── middleware/        # Custom middleware
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd laptopexchange-2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Start the application:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## API Routes

### User Routes
- `GET /` - Home page
- `GET /users/login` - Login page
- `POST /users/login` - Login user
- `GET /users/register` - Registration page
- `POST /users/register` - Register new user
- `GET /users/logout` - Logout user

### Item Routes
- `GET /items` - List all laptop listings
- `GET /items/new` - Create new listing form
- `POST /items` - Create new listing
- `GET /items/:id` - View specific listing
- `GET /items/:id/edit` - Edit listing form
- `PUT /items/:id` - Update listing
- `DELETE /items/:id` - Delete listing

### Offer Routes
- `POST /items/:id/offers` - Create new offer
- `PUT /items/:id/offers/:offerId` - Update offer status
- `DELETE /items/:id/offers/:offerId` - Delete offer

## Security Features

- Password hashing using bcryptjs
- Session-based authentication
- Input validation using express-validator
- Protected routes using middleware
- Secure session storage in MongoDB

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

For any questions or concerns, please open an issue in the repository. 
