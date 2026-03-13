## Endangered Species Tracker

## Project Objective
The goal of this project is to build a full-stack web application that helps researchers track sightings of endangered species.
The application allows users to record animals being observed in the wild, manage individual animals and species, and analyze sightings over time.

## Features
1. Species Management
- View a list of tracked species
- Store scientific and common names for each species

2. Individual Animal Tracking
- Add and manage individual animals belonging to a species
- View statistics about sightings for each individual
- View detailed information about an individual, including:
  - Wikipedia link
  - representative photo

3. Sightings Tracking
- Record when and where an animal was observed
- Store the observer’s email and health condition of the animal
- Display sightings grouped by individual animals

4. Search Functionality
- Search sightings within a date range

5. User Feedback
- Toast notifications
![alt text](Untitleddesign-ezgif.com-video-to-gif-converter.gif)

## Technologies Used
**Frontend**
- React
- React Context API for state management
- React Toastify for user notifications
- SCSS / CSS for styling

**Backend**
- Node.js
- Express.js
- REST API architecture

**Database**
- PostgreSQL
- SQL joins and aggregations
- Junction table for many-to-many relationships
- pg Node driver

## How to test
1. Clone the repository: `git clone https://github.com/sylviajsy/mern-pern-project.git`
2. Set Up the Backend
  - `cd server`
  - `npm install`
3. Inside your server folder, create an `.env` file with `touch .env`
4. There are two ways to restore the DB dump file the project already contains:
     A. If you have postgres set up postgres with an User:
         - just run the command `psql -U postgres techtonica -f db.sql`. Make sure that you have your Postgres password on hand. The psql console will ask for your password.
      B. If your initial configuration of postgres doesn't require a User:
          - just run the command `psql techtonica -f db.sql`
6. Inside your server folder, open the file `.env.example` and copy the correct option for your configuration found there to your new `.env` file.
Here is what your `.env` might look like:
`DATABASE_URI="postgresql://localhost/techtonica"`
     This will automatically create all tables and insert the initial data.
7. Go to the `client` folder in the project (`cd .. and cd client`) and run the command `npm install`
8. If you want to run both servers using concurrently (which is already a npm dependency on the server) you can keep the script in the package.json in the server that reads `"dev": " concurrently 'npm start' 'cd .. && cd client && npm run dev' "`. If you run the command `npm run dev` from within your server, both the client and backend servers will start.
9. Go to `http://localhost:5173/` and you should see something like this 💪
<img width="1335" height="646" alt="Screenshot 2026-03-11 at 4 34 11 PM" src="https://github.com/user-attachments/assets/b3994b8d-92a9-4b0b-9aa9-b6e8e6ddd2e7" />

## Nice-to-Have
- Map Integration: Display sightings on a map using tools such as GoogleMap API
- Photo Uploads: Allow users to upload photos of sightings instead of only storing URLs.
- Data Visualization: 