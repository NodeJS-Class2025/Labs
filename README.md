# Team 4 — Forum

This project is a simple forum system that allows users to interact through topics and posts.
The core entities are Topic and Post.
There are three types of users:

Guest – can view topics and posts

Registered User – can view and create posts

Administrator – can manage topics (create, edit, delete) and view content

The application focuses on role-based access and basic forum functionality.

## How to Run the Application

1. **Install dependencies**  
   Run the following command in the project root:

    ```
    npm install
    ```

2. **Start the application**  
   Use the command:

    ```
    npm start
    ```

    or, if you want to run in development mode with auto-reload:

    ```
    npm run dev
    ```

3. **Open in browser**  
   By default, the app will be available at [http://localhost:3000](http://localhost:3000).

4. **Default credentials**  
   If you need test users, check the `src/mock/users.mock.json` file for generated accounts.
