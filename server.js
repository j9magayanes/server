require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const morgan = require("morgan");
const sql = require('mssql');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

const sqlConfig = {
  user: 'pma',
  password: 'Onedirection@143',
  database: 'pma',
  server: 'pricemodeladministration1.database.windows.net',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true// change to true for local dev / self-signed certs
  }
}

// Get all Models
app.get("/api/v1/models", async (req, res) => {
  try {
    //const results = await db.query("select * from models");
    await sql.connect(sqlConfig)
    const modelRatingsData = await sql.query`select * from models`
    console.log(modelRatingsData)
    res.status(200).json({
      status: "success",
      results: modelRatingsData.recordset.length,
      data: {
        models: modelRatingsData.recordset,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

//Get a Model
app.get("/api/v1/models/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    await sql.connect(sqlConfig);
    const model = await sql.query(
      `select * from models where id = ${req.params.id}`
    );
    res.status(200).json({
      status: "success",
      data: {
        model: model.recordset[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Create a model
app.post("/api/v1/models", async (req, res) => {
  try {
   let pool = await sql.connect(sqlConfig)
   const result = await pool.request()
   .input('id', sql.Int, req.body.id)
   .input('name', sql.NVarChar, req.body.name)
   .input('location', sql.NVarChar, req.body.location)
   .input('price_range', sql.Int, req.body.price_range)
   .query('INSERT INTO models (id, name, location, price_range) values (@id, @name, @location, @price_range)')
   res.status(200).json({
    status: "success",
    data: {
      model: {id: 7},
    },
  });
} catch (err) {
  console.log(err);
}
});
// Update Models
app.put("/api/v1/models/:id", async (req, res) => {
  try {
    let pool = await sql.connect(sqlConfig)
    const result = await pool.request()
    .input('searchid', sql.Int, req.params.id)
    .input('id', sql.Int, req.body.id)
    .input('name', sql.NVarChar, req.body.name)
    .input('location', sql.NVarChar, req.body.location)
    .input('price_range', sql.Int, req.body.price_range)
    .query('UPDATE models SET id = @id, name = @name, location = @location, price_range = @price_range where id = @searchid')
    res.status(200).json({
      status: "success",
    });
   } catch (err) {
    console.log(err)
   }
  }
 )

// Delete Model
app.delete("/api/v1/models/:id", async (req, res) => {
  try {
    let pool = await sql.connect(sqlConfig)
    const result = await pool.request()
    .input('searchid', sql.Int, req.params.id)
    .input('id', sql.Int, req.body.id)
    .input('name', sql.NVarChar, req.body.name)
    .input('location', sql.NVarChar, req.body.location)
    .input('price_range', sql.Int, req.body.price_range)
    .query('DELETE FROM models where id = @searchid')
    res.status(200).json({
      status: "success",
    });
   } catch (err) {
    console.log(err)
   }
  }
 )



// Sign up
/* app.post("/api/v1/register", (req, res) => {
  const email = req.body.name;
  const password = req.body.password;

  try {
    const results = bcrypt.hash(password, saltRounds, (err, hash) => {
      sql.query("INSERT INTO emails (email, password) VALUES ($1, $2)", [
        email,
        hash,
      ]);
      console.log(results);
      res.status(201).json({
        status: "success",
      });
    });
  } catch (err) {
    console.log(err);
  }
}); */

// Sign in
/* app.post("/api/v1/login", async(req, res) => {
  const name = req.body.email;
  const password = req.body.password;

  try { 
    const result = await sql.query(
    "select * from emails WHERE name = $1",
    [name]
    );
    if (result.recordset.length > 0) {
      bcrypt.compare(password, result.recordset[0].password, (error, response) => {
        if (response) {
          req.session.user = result;
          console.log(req.session.user);
        } else {
          console.log("wrong password");
        }
      });
    } else {
      console.log("doesnt exist");
    }
    res.status(201).json({
      status: "success",
    });
  } catch (err) {
    console.log(err)
  }
}); */


// Log out

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is up and listening on port ${port}`);
});
