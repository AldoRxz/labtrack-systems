# LabTrack Systems

**LabTrack Systems** is an inventory management system designed for schools to track equipment across multiple locations. The system allows users to add locations and equipment, monitor their traceability, record observations, and manage maintenance logs. This project includes a backend developed with Node.js and a frontend built with React.

## Prerequisites

- Node.js v16 or higher
- npm v7 or higher
- Access to a MySQL database (local or Amazon RDS)


## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd node

2. Install the dependencies:
   ```bash
   npm install

3. Configure the database connection in node/database/db.js. You can choose between a local database or Amazon RDS. Example:
    ```bash
   const dbConfig = {
    host: 'localhost', // Change to your RDS host if necessary
    user: 'root',
    password: 'password',
    database: 'labtrack',
    };

4. Start the server:
   ```bash
   npm start

  The backend will be available at http://localhost:3000 by default.

  ## Frontend Setup

1. Navigate to the frontend  directory:
   ```bash
   cd reactfront

2. Install the dependencies:
   ```bash
   npm install

3. Configure the backend URL in react/src/axios/axios.js. Example:
    ```bash
   import axios from 'axios';

    const instance = axios.create({
        baseURL: 'http://localhost:3000', // Change to your backend production URL
    });
    
    export default instance;

4. Start the frontend:
   ```bash
   npm start

The frontend will be available at http://localhost:3000 by default.


## Usage

1. Ensure both the backend and frontend are running.
2. Access the application in your browser at `http://localhost:3000`.
3. Use the interface to:
   - Add and manage locations.
   - Add, edit, and track equipment.
   - Record and view maintenance logs and observations.

## Contact

Developed by Aldo.
- Email: [aldo_roman13@hotmail.com](mailto:aldo_roman13@hotmail.com)
- GitHub: [AldoRxz](https://github.com/AldoRxz)
