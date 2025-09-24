# 📘 README -- Fotovoltaico

## 🌞 Description

**Fotovoltaico** is the MVP of a web application designed to digitize
the management of a company that sells photovoltaic systems.\
In this first version, it allows users to log in, create quotes through
an intuitive dashboard, and view saved quotes.\
Future versions will focus on adding extra features to further simplify
and digitize company operations (such as drafting contracts, calculating
economic returns, and other routine tasks).

## 🚀 Main Features

-   🔐 **Secure authentication** with Supabase
-   📊 **Interactive dashboard** for data visualization
-   📝 **Quote management** (create, view, update)
-   💾 **Integrated database** (SQL schema provided in
    `database-schema.sql`)

## 🛠️ Technologies Used

-   [React](https://reactjs.org/) -- user interface
-   [Supabase](https://supabase.com/) -- authentication and database
-   [JavaScript
    (ES6+)](https://developer.mozilla.org/docs/Web/JavaScript)
-   CSS3 for styling

## 📦 Installation

1.  Clone the repository:

    ``` bash
    git clone https://github.com/davidechiattelli/fotovoltaico.git
    cd fotovoltaico
    ```

2.  Install dependencies:

    ``` bash
    npm install
    ```

3.  Start the application locally:

    ``` bash
    npm start
    ```

4.  The app will be available at `http://localhost:3000`.

## ⚙️ Configuration

-   Update the Supabase settings in `src/supabaseClient.js` with your
    credentials.\
-   If you want to use the sample database, import the schema contained
    in `database-schema.sql`.

## 📂 Project Structure

    fotovoltaico/
     ├── public/              # Static files (index.html, favicon, etc.)
     ├── src/                 # React source code
     │   ├── App.js           # Main component
     │   ├── Dashboard.js     # User dashboard
     │   ├── Login.js         # Login page
     │   ├── authService.js   # Authentication handling
     │   ├── preventiviService.js # Quote services
     │   └── supabaseClient.js# Supabase configuration
     ├── package.json         # Configurations and dependencies
     ├── database-schema.sql  # Database schema
     └── README.md

## 📜 License

This project is licensed under the **MIT License**.\
You are free to use, modify, and distribute it with proper credit.
