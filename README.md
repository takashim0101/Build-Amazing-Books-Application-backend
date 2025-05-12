# Amazing Books Application Backend

## Overview

This repository contains the backend code for the Amazing Books Application. It sets up an Express server and defines API endpoints for user registration, login, and information updates, among other functionalities.

## POSTMAN Demo Result
![POSTMAN Demo](public/images/L5Mission0-amazing-books-app-backend-post_method_example.png)



## Features

- User registration
- User login
- Update user information
- Fetch books from an external API
- Serve application logo

## Technologies Used

- **Node.js**: JavaScript runtime for server-side programming
- **Express**: Web framework for building the server
- **MySQL**: Database for storing user information
- **Bcrypt**: Library for hashing passwords
- **Axios**: For making HTTP requests
- **dotenv**: For managing environment variables
- **CORS**: Middleware for enabling Cross-Origin Resource Sharing

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine
- MySQL database set up and running

### Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   cd YOUR_REPOSITORY

   ```

2. **Install dependencies:**:

   ```bash
   npm install

   ```

3. **Create a .env file** in the root directory and add your environment variables:

   ```env
   MYSQL_HOST=your_mysql_host
   MYSQL_USER=your_mysql_user
   MYSQL_PASSWORD=your_mysql_password
   MYSQL_DATABASE=your_mysql_database
   PORT=5000
   VITE_API_URL=your_external_api_url
   REACT_APP_LOGO_URL=your_logo_url
   ```

4. **Run the server**:

   ```env
   npm run dev
   ```

## API Endpoints

### User Registration

- **Endpoint**: `POST /api/register`
- **Request Body**:

  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```

### User Login

- **Endpoint**: `POST /api/login`
- **Request Body**:

  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```

### Update User Information

- **Endpoint**: `POST /api/login`
- **Request Body**: **\*(at least one field required):**

  ```json
  {
    "email": "user@example.com",
    "password": "newpassword"
  }
  ```

### POSTMAN Demo Result

```json
{
  "message": "Login successful!",
  "user": {
    "id": 2,
    "email": "test@example.com"
  }
}
```
### Fetch Books

- **Endpoint**: `GET /api/books`
- **Request Body**: **\*(at least one field required as an example):**

  ```json
    {
        "id": 1,
        "title": "The Hunger Games",
        "authors": "Suzanne Collins",
        "description": "Winning will make you famous. Losing means certain death. The nation of Panem, formed from a post-apocalyptic North America, is a country that consists of a wealthy Capitol region surrounded by 12 poorer districts. Early in its history, a rebellion led by a 13th district against the Capitol resulted in its destruction and the creation of an annual televised event known as the Hunger Games. In punishment, and as a reminder of the power and grace of the Capitol, each district must yield one boy and one girl between the ages of 12 and 18 through a lottery system to participate in the games. The 'tributes' are chosen during the annual Reaping and are forced to fight to the death, leaving only one survivor to claim victory. When 16-year-old Katniss's young sister, Prim, is selected as District 12's female representative, Katniss volunteers to take her place. She and her male counterpart Peeta are pitted against bigger, stronger representatives, some of whom have trained for this their whole lives. For her, survival is second nature.",
        "edition": "",
        "format": "Hardcover",
        "num_pages": 374,
        "rating": 4.33,
        "rating_count": 5519135,
        "review_count": 160706,
        "genres": "Young Adult, Fiction, Science Fiction, Dystopia, Fantasy",
        "genre_list": "Young Adult,Fiction,Science Fiction,Dystopia,Fantasy",
        "image_url": "https://images.gr-assets.com/books/1447303603l/2767052.jpg",
        "Quote1": "“You don’t forget the face of the person who was your last hope.”",
        "Quote2": "“Remember, we're madly in love, so it's all right to kiss me anytime you feel like it.”",
        "Quote3": "“May the odds be ever in your favor!”"
    }
  ```

### Fetch Logo

- **Endpoint**: `GET /api/logo`
- **Request Body**: **\*(at least one field required as an example):**

  ```json
    {
         "logoUrl": " "
    }
  ```

## Data Source

This project utilizes example data from [Draftbit's Example Data](https://example-data.draftbit.com/), which provides a variety of sample data for development and testing purposes. Specifically, I fetched a total of **102 books** from this API for use in this project[Draftbit's Example Data](https://example-data.draftbit.com/books).