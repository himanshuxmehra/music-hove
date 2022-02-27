require("dotenv").config()
const express = require("express")
const app = express()
const mysql = require("mysql")
const bcrypt = require("bcrypt")

const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PW = process.env.DB_PASSWORD
const DB_DB = process.env.DB_DATABASE
const DB_PORT = process.env.DB_PORT

const db = mysql.createPool(
    {
        connectionLimit: 100,
        host: DB_HOST,
        user: DB_USER,
        password: DB_PW,
        database: DB_DB,
        port: DB_PORT,
    }
)

db.getConnection(
    (err, connection)=>{
        if(err) throw (err)
        console.log("Database connection established, " + connection.threadId)
    }
)

const port = process.env.PORT
app.listen(port, 
    ()=> console.log(`Server Started on port ${port}...`))

app.use(express.json())

app.post("/createUser", async(req,res)=>{
    const username = req.body.username;
    const hashPass = await bcrypt.hash(req.body.password, 10);
    console.log(hashPass)

    db.getConnection( async (err, connection)=>{
        if(err)
            throw (err)

        const sqlSearch = "SELECT * FROM userTable WHERE username = ?"
        const searchQuery = mysql.format(sqlSearch,[username]);

        const sqlInsert = "INSERT INTO userTable VALUES (0,?,?)" 
        const insertQuery = mysql.format(sqlInsert,[username,hashPass]);

        await connection.query(searchQuery, async (err,result)=>{

            if(err) throw (err)
            console.log("----> Search Results")
            console.log(result.length)
            if(result.length != 0){
                connection.release()
                console.log("Username already used")
                res.sendStatus(409)
            }
            else{
                await connection.query(insertQuery, async(err, result)=>{
                    connection.release()
                    if(err) throw err
                    console.log("-->> user created")
                    console.log(result.insertID)
                    res.sendStatus(201)
                })
            }
        })

    })
})

app.post("/login", async(req,res)=>{
    //console.log(req.body)
    const username = req.body.username;
    const password = req.body.password;

    db.getConnection(async(err,connection)=>{
        
        if (err) throw err

        const sqlSearch = "SELECT * FROM userTable WHERE username = ?"
        const searchQuery = mysql.format(sqlSearch,[username])

        connection.query(searchQuery, async(err,result)=>{
            if(err) throw err;
            connection.release();
            if(result.length==0){
                console.log("User not found");
                res.sendStatus(404);
            }
            else{
                const hashedPassword = result[0].password;

                if(await bcrypt.compare(password,hashedPassword)){
                    console.log("user logged in!")
                    res.sendStatus(200)
                }
                else{
                    console.log("wrong password")
                    res.send("wrong password")
                }
            }
            
        })
    })
})