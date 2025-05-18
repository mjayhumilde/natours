# Natours Application

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node.js-%3E%3D10.0.0-green.svg)](https://nodejs.org/en/)
[![Express](https://img.shields.io/badge/express-%5E4.21.2-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/mongodb-%5E5.13.23-brightgreen.svg)](https://www.mongodb.com/)

A tour web application in Pangasinan where I'm from for exploring and booking amazing nature or city tours. Built with Node.js, Express, and MongoDB.

**Important Note:** The backend API for this application is **fully complete**. However, the user interface (UI) is still under development. As a freelance student currently juggling school work, client projects, thesis writing, and the search for internships, I haven't had sufficient time to fully complete the UI as of now.

For the purpose of exploring the website's functionality and the integrated payment gateway (GCash and PayMongo), you can use the following test account:

**Test Account:**

- **Email:** test@example.com
- **Password:** test1234

Please note that the website is currently **not responsive** and may not display correctly on all devices. Your understanding is appreciated as I work on this project alongside my other commitments.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#getting-started)
      - [Prerequisites](#prerequisites)
      - [Installation](#installation)
      - [Configuration](#configuration)
      - [Running the Application](#running-the-application)
- [Technology Stack](#technology-stack)

## About

Natours is designed to provide users with a platform to discover and book curated nature tours around the world. It offers features like browsing tours, viewing detailed information, user authentication, booking management, and secure payment processing (integrated with PayMongo and **GCash**). While the UI is still in progress, the underlying API is complete and functional.

## Features

- **Tour Listings:** Browse a variety of nature tours with details like descriptions, duration, pricing, ratings, and available dates.
- **Detailed Tour Information:** View comprehensive information about each tour, including maps, image galleries, and reviews.
- **User Authentication:** Secure user registration, login, and logout functionality (**signup UI currently unavailable, use the test account**).
- **User Profiles:** Users can manage their profile information and settings.
- **Booking System:** Authenticated users can book tours.
- **Payment Integration:** Secure payment processing via **PayMongo Checkout and GCash**.
- **Booking Management:** Users can view their booking history.
- **Admin Interface (Potentially):** Features for administrators to manage tours, users, and bookings (you can expand on this if you have one).
- **RESTful API:** A well-structured API for handling data and interactions (**fully complete**).
- **Geospatial Features:** Integration with Leaflet for displaying tour locations on a map.
- **Email Notifications:** Sends confirmation emails upon successful bookings.
- **Payment Gateway Exploration:** Users can experience the **GCash and PayMongo** integration using the test account.

## Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

Make sure you have the following installed on your system:

- **Node.js:** (>= 10.0.0) - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** ([Install Yarn](https://yarnpkg.com/getting-started/installation))
- **MongoDB:** ([Install MongoDB](https://www.mongodb.com/docs/manual/installation/)) - Ensure your MongoDB server is running.
- **Git:** ([Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git))

### Installation

1.  **Clone the repository:**

````bash
    git clone <YOUR_REPOSITORY_URL>
    ```

(Replace `<YOUR_REPOSITORY_URL>` with the URL of your project on GitHub, GitLab, or Bitbucket)

2.  **Navigate to the project directory:**

```bash
    cd natours-application
    ```

(Adjust the directory name if needed)

3.  **Install dependencies using npm:**
    ```bash
    npm install
    ```
    **OR install dependencies using yarn:**
    ```bash
    yarn install
    ```

### Configuration

1.  **Create a `.env` file:** Copy the `.env.example` file (if you have one) to `.env` in the root of your project:

```bash
    cp .env.example .env
    ```

**OR**

```bash
    cp sample.env .env
    ```

(Adjust the filename if your example environment file has a different name).

2.  **Edit the `.env` file:** Open the `.env` file and configure the environment variables according to your setup. This will include:
    - Database connection string (`DATABASE`, `DATABASE_LOCAL`)
    - JWT secret key (`JWT_SECRET`)
    - Email service credentials (`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USERNAME`, `EMAIL_PASSWORD`, `EMAIL_FROM`)
    - PayMongo secret key (`PAYMONGO_SECRET_KEY`)
    - **GCash API Keys/Settings (if applicable)**
    - Other application-specific settings.

### Running the Application

1.  **Start the development server:**

```bash
    npm run dev
    ```

**OR**

```bash
    npm run start
    ```

This will start your Node.js/Express server. You should see output in your terminal indicating that the server is running (usually on `http://localhost:3000` or a similar address).

2.  **Build the frontend:** Use `esbuild` to bundle your frontend JavaScript:

```bash
    npm run build:js
    ```

**OR**

```bash
    yarn run build:js
    ```

For development, you can use the watch script:

```bash
    npm run watch:js
    ```

**OR**

```bash
    yarn run watch:js
    ```

3.  **Access the application in your browser:** Open your web browser and navigate to the address where your server is running (e.g., `http://localhost:3000`). Please be aware that the UI is currently not fully developed and is not responsive. Use the test account provided to explore the existing features.

## Technology Stack

- **Backend:**
    - [Node.js](https://nodejs.org/)
    - [Express](https://expressjs.com/)
- **Database:**
    - [MongoDB](https://www.mongodb.com/)
    - [Mongoose](https://mongoosejs.com/) (for MongoDB object modeling)
- **Frontend:**
    - [Pug](https://pugjs.org/) (for templating)
    - [JavaScript](https://www.javascript.com/)
    - [Leaflet](https://leafletjs.com/) (for maps)
    - [Axios](https://axios-http.com/) (for HTTP requests)
    - **[esbuild](https://esbuild.github.io/)** (for JavaScript bundling)
- **Payment Integration:**
    - [PayMongo](https://paymongo.com/)
    - **GCash**
- **Other Libraries/Tools:**
    - [bcryptjs](https://www.npmjs.com/package/bcryptjs)
    - [compression](https://www.npmjs.com/package/compression)
    - [cookie-parser](https://www.npmjs.com/package/cookie-parser)
    - [dotenv](https://www.npmjs.com/package/dotenv)
    - [express-mongo-sanitize](https://www.npmjs.com/package/express-mongo-sanitize)
    - [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
    - [helmet](https://www.npmjs.com/package/helmet)
    - [hpp](https://www.npmjs.com/package/hpp)
    - [html-to-text](https://www.npmjs.com/package/html-to-text)
    - [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
    - [morgan](https://www.npmjs.com/package/morgan)
    - [multer](https://www.npmjs.com/package/multer)
    - [ndb](https://www.npmjs.com/package/ndb)
    - [node-mailjet](https://www.npmjs.com/package/node-mailjet)
    - [nodemailer](https://www.npmjs.com/package/nodemailer)
    - [sanitize-html](https://www.npmjs.com/package/sanitize-html)
    - [sharp](https://www.npmjs.com/package/sharp)
    - [slugify](https://www.npmjs.com/package/slugify)
    - [validator](https://www.npmjs.com/package/validator)
````
