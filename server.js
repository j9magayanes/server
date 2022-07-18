require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
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
    const modelRatingsData = await sql.query`select * from price_models`
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
      `select * from price_models where Model_Id = ${req.params.id}`
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
    console.log(req.body.Model_Name)
   let pool = await sql.connect(sqlConfig)
   const result = await pool.request()
   .input('Credit_Name', sql.NVarChar, req.body.Credit_Name)
   .input('Source_Name', sql.NVarChar, req.body.Source_Name)
   .input('Model_Name', sql.NVarChar, req.body.Model_Name)
   .input('Instruction', sql.NVarChar, req.body.Instruction)
   .input('Days_Number', sql.SmallInt, req.body.Days_Number)
   .input('Authors_Number', sql.NVarChar, req.body.Authors_Number)
   .input('Category_Name', sql.NVarChar, req.body.Category_Name)
   .input('Price_Number', sql.Float, req.body.Price_Number)
   .input('Currency_Name', sql.NVarChar, req.body.Currency_Name)
   .input('Online_State', sql.NVarChar, req.body.Online_State)
   .input('Days_Number_TV', sql.NVarChar, req.body.Days_Number_TV)
   .input('Price_TV', sql.NVarChar, req.body.Price_TV)
   .input('TV_State', sql.NVarChar, req.body.TV_State)
   .input('Print_State', sql.NVarChar, req.body.Print_State)
   .input('Royalty_State', sql.NVarChar, req.body.Royalty_State)
   .input('Visible_State', sql.NVarChar, req.body.Visible_State)
   .input('Order_State', sql.NVarChar, req.body.Order_State)
   .query('INSERT INTO price_models (Credit_Name, Source_Name, Model_Name, Instruction, Days_Number, Authors_Number, Category_Name, Price_Number, Currency_Name, Online_State, Days_Number_TV, Price_TV, TV_State, Print_State, Royalty_State, Visible_State, Order_State) values (@Credit_Name, @Source_Name, @Model_Name, @Instruction, @Days_Number, @Authors_Number, @Category_Name, @Price_Number, @Currency_Name, @Online_State, @Days_Number_TV, @Price_TV, @TV_State, @Print_State, @Royalty_State, @Visible_State, @Order_State )')
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
    .input('id', sql.Int, req.params.id)
    .input('Credit_Name', sql.NVarChar, req.body.Credit_Name)
    .input('Source_Name', sql.NVarChar, req.body.Source_Name)
    .input('Model_Name', sql.NVarChar, req.body.Model_Name)
    .input('Instruction', sql.NVarChar, req.body.Instruction)
    .input('Days_Number', sql.SmallInt, req.body.Days_Number)
    .input('Authors_Number', sql.NVarChar, req.body.Authors_Number)
    .input('Category_Name', sql.NVarChar, req.body.Category_Name)
    .input('Price_Number', sql.Float, req.body.Price_Number)
    .input('Currency_Name', sql.NVarChar, req.body.Currency_Name)
    .input('Online_State', sql.NVarChar, req.body.Online_State)
    .input('Days_Number_TV', sql.NVarChar, req.body.Days_Number_TV)
    .input('Price_TV', sql.NVarChar, req.body.Price_TV)
    .input('TV_State', sql.NVarChar, req.body.TV_State)
    .input('Print_State', sql.NVarChar, req.body.Print_State)
    .input('Royalty_State', sql.NVarChar, req.body.Royalty_State)
    .input('Visible_State', sql.NVarChar, req.body.Visible_State)
    .input('Order_State', sql.NVarChar, req.body.Order_State)
    .query('UPDATE price_models SET Credit_Name = @Credit_Name, Source_Name = @Source_Name, Model_Name = @Model_Name, Instruction = @Instruction, Days_Number = @Days_Number, Authors_Number = @Authors_Number, Category_Name = @Category_Name , Price_Number = @Price_Number, Currency_Name = @Currency_Name, Online_State = @Online_State, Days_Number_TV = @Days_Number_TV, Price_TV = @Price_TV , TV_State = @TV_State, Print_State = @Print_State, Royalty_State = @Royalty_State, Visible_State = @Visible_State, Order_State = @Order_State where Model_Id = @id')
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
    .query('DELETE FROM price_models where Model_Id = @searchid')
    res.status(200).json({
      status: "success",
    });
   } catch (err) {
    console.log(err)
   }
  }
 )

 // Search
 app.get("/api/v1/models/search/:search", async (req, res) => {
  try {
    //const results = await db.query("select * from models");
    const search = req.params.search
    console.log(search)
    let pool = await sql.connect(sqlConfig)
    const result = await pool.request()
    .query`select * from price_models where Credit_Name  = ${search} union select * from price_models where Source_Name  = ${search};`
    console.log(result)
    res.status(200).json({
      status: "success",
      results: result.recordset.length,
      data: {
        results: result.recordset,
      },
    });
  } catch (err) {
    console.log(err);
  }
}); 


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
