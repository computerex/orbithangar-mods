const express = require('express');
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const mysql = require('mysql2/promise');
const fs = require('fs');

const port = 5005;
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyparser.json())
// app.use(express.static('public'));


app.get('/api/addons', async function(req, res){
    const con = await get_sql();
    const [addons, fields] = await con.query("SELECT * FROM ohm.addonDB");
    con.end();
    res.send(addons);
});

const get_sql = async () => await mysql.createConnection({
    host: process.env.DB_HOST || 'ohm-database', 
    port: 3306, 
    user: 'root', 
    database: process.env.DB_NAME || 'ohm', 
    multipleStatements: true
}); 

const init_db = async () => {
    console.log("checking if db has initialized...");
    try {
        const connection = await get_sql();
        connection.end();
        console.log("db is up, schema has been initialized")
    }
    catch(e) {
        if (e.code === 'ER_BAD_DB_ERROR') {
            console.log("db is up! creating schema");
            let sql = fs.readFileSync('/application/db_structure.sql').toString();
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST || 'ohm-database', 
                port: 3306, 
                user: 'root', 
                multipleStatements: true
            });
            connection.query(sql);
            console.log(sql);
            connection.end();
        } else {
            console.log("db not up: " + e.code);
            setTimeout(init_db, 5000);
        }
    }
}

app.listen(port, async () => {
    init_db();
    console.log(`Your server is started: http://localhost:${port}`);
});