# Natours Application

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node.js-%3E%3D10.0.0-green.svg)](https://nodejs.org/en/)
[![Express](https://img.shields.io/badge/express-%5E4.21.2-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/mongodb-%5E5.13.23-brightgreen.svg)](https://www.mongodb.com/)

A comprehensive web application for exploring and booking amazing nature tours. Built with Node.js, Express, and MongoDB.

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

Natours is designed to provide users with a platform to discover and book curated nature tours around the world. It offers features like browsing tours, viewing detailed information, user authentication, booking management, and secure payment processing (integrated with PayMongo).

## Features

- **Tour Listings:** Browse a variety of nature tours with details like descriptions, duration, pricing, ratings, and available dates.
- **Detailed Tour Information:** View comprehensive information about each tour, including maps, image galleries, and reviews.
- **User Authentication:** Secure user registration, login, and logout functionality.
- **User Profiles:** Users can manage their profile information and settings.
- **Booking System:** Authenticated users can book tours.
- **Payment Integration:** Secure payment processing via PayMongo Checkout.
- **Booking Management:** Users can view their booking history.
- **Admin Interface (Potentially):** Features for administrators to manage tours, users, and bookings (you can expand on this if you have one).
- **RESTful API:** A well-structured API for handling data and interactions.
- **Geospatial Features:** Integration with Leaflet for displaying tour locations on a map.
- **Email Notifications:** Sends confirmation emails upon successful bookings.

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

    ```bash
    git clone <YOUR_REPOSITORY_URL>
    ```

    (Replace `<YOUR_REPOSITORY_URL>` with the URL of your project on GitHub, GitLab, or Bitbucket)

2.  **Navigate to the project directory:**

    ```bash
    cd natours-application
    ```

    (Adjust the directory name if needed)

3.  **Install dependencies using npm:**
    ```bash
    npm install
    ```
    **OR install dependencies using yarn:**
    ```bash
    yarn install
    ```

### Configuration

1.  **Create a `.env` file:** Copy the `.env.example` file (if you have one) to `.env` in the root of your project:

    ```bash
    cp .env.example .env
    ```

    **OR**

    ```bash
    cp sample.env .env
    ```

    (Adjust the filename if your example environment file has a different name).

2.  **Edit the `.env` file:** Open the `.env` file and configure the environment variables according to your setup. This will include:
    - Database connection string (`DATABASE`, `DATABASE_LOCAL`)
    - JWT secret key (`JWT_SECRET`)
    - Email service credentials (`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USERNAME`, `EMAIL_PASSWORD`, `EMAIL_FROM`)
    - PayMongo secret key (`PAYMONGO_SECRET_KEY`)
    - Other application-specific settings.

### Running the Application

1.  **Start the development server:**

    ```bash
    npm run start
    ```

    **OR**

    ```bash
    yarn start
    ```

    This will start your Node.js server. You should see output in your terminal indicating that the server is running (usually on `http://localhost:3000` or a similar address).

2.  **Build the frontend (if applicable):** If you have a separate build process for your frontend (e.g., using `esbuild` as in your `package.json`):

    ```bash
    npm run build:js
    ```

    **OR**

    ```bash
    yarn run build:js
    ```

    You might also have a watch script for development:

    ```bash
    npm run watch:js
    ```

    **OR**

    ```bash
    yarn run watch:js
    ```

3.  **Access the application in your browser:** Open your web browser and navigate to the address where your server is running (e.g., `http://localhost:3000`).

## Technology Stack

- **Backend:**
  - [Node.js](https://nodejs.org/)
  - [Express](https://expressjs.com/)
- **Database:**
  - [MongoDB](https://www.mongodb.com/)
  - [Mongoose](https://mongoosejs.com/) (for MongoDB object modeling)
- **Frontend:** (List the main technologies you're using)
  - [Pug](https://pugjs.org/) (for templating)
  - [JavaScript](https://www.javascript.com/)
  - [Leaflet](https://leafletjs.com/) (for maps)
  - [Axios](https://axios-http.com/) (for HTTP requests)
  - [esbuild](https://esbuild.github.io/) (for bundling)
- **Payment Integration:**
  - [PayMongo](https://paymongo.com/)
- **Other Libraries/Tools:** (List any other significant libraries you're using, e.g., `bcryptjs`, `jsonwebtoken`, `nodemailer`, etc.)
