import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';

import lotesRoutes from './routes/lotes.js';

import sql from 'mssql'

const app = express();
const PORT = process.env.PORT || 3000;

// SQL Server configuration
var config = {
  "user": process.env.DB_USER, // Database username
  "password": process.env.DB_PASS, // Database password
  "server": process.env.DB_SERVER, // Server IP address
  "database": process.env.DB_DATABASE, // Database name
  "options": {
    "encrypt": false // Disable encryption
  }
}

// Connect to SQL Server
sql.connect(config, err => {
  if (err) {
    throw err;
  }
  console.log("Connection Successful!");
});
console.log('test');

app.use(bodyParser.json());
app.use(cors())

app.use('/express-coffee/lotes', lotesRoutes)

app.get('/express-coffee', (req, res) => { res.send('test2') })

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}/express-coffee`))