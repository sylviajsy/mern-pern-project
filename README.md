Your First Express and React App with Vite
⚡ Create a working full stack app with React and Express in minutes by running your client using Vite, your server using Express, and dumping your db in the template ⚡

Step by Step instructions - To use this project as your starting point 🚀
To create the whole project
Go to your project directory in your terminal and run the command git clone https://github.com/Techtonica/curriculum/tree/main/projects/2023TemplateWithVite NAMENEWDIRECTORY

To remove the source code git out of the project directory, run the command rm -rf .git

Then while still within the project directory in your terminal, run the command git init to start your own git track

You will something like this in your terminal

Go to the server folder in the project (cd server) and run the command npm install

Inside your server folder, create an .env file with touch .env

⚠️ All these instructions should be inside your server folder ⚠️

There are two ways to restore the DB dump file the project already contains:
A- If you have postgres set up postgres with an User:

just run the command psql -U postgres techtonica -f db.sql. Make sure that you have your Postgres password on hand. The psql console will ask for your password.
B- If your initial configuration of postgres doesn't require a User:

just run the command psql techtonica -f db.sql
Inside your server folder, open the file .env.example and copy the correct option for your configuration found there to your new .env file.
Here is what your .env might look like:

DATABASE_URI="postgresql://localhost/techtonica"
For this template, the name of your db should be techtonica.

⚠️ If you don't see a techtonica db, you can create one. From the terminal, navigate to the psql command line with psql and type create database techtonica; - don't forget the semicolon!! ⚠️

You will something like this in your terminal

Go to the client folder in the project (cd .. and cd client) and run the command npm install
🔎 The npm install command installs the required dependencies defined in the package.json files and generates a node_modules folder with the installed modules.

⚡ Note: Using Vite we can avoid all the package deprecation warnings ⚡

If you want to run both servers using concurrently (which is already a npm dependency on the server) you can keep the script in the package.json in the server that reads "dev": " concurrently 'npm start' 'cd .. && cd client && npm run dev' ". If you run the command npm run dev from within your server, both the client and backend servers will start.

Go to localhost:5173 and you should see something like this 💪

You should see something like this in your terminal.

⚡ Notes ⚡

React requires Node >= 14.0.0 & npm >= 5.6

This template is using icons from react-icons/io5 and react-bootstrap in the frontend. You can see all the frontend dependencies in the package.json on the client folder

Please note that your backend server will run from port 8080, and your frontend React server will run from port 5173 (the default Vite port).

Confused about why use Vite? 🤔 → Check out the Create a new React app with Vite

⚙️ Links that you could need:

The instructions for pg (Website)
Setup PostgresSQL correctly (Website)