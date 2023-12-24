require('dotenv').config()
const express = require('express')
const mysql = require('mysql')
const { generateToken, checkToken } = require('./scripts')
const cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer({dest: 'client/dist/client/assets/tours'})

const app = express()
const port = 80
const con = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'bac89rad',
    database: "christmas_game"
})
app.use(bodyParser.json({limit: '1000mb'}))
app.use(cors({
    origin:'*', 
    credentials:true,
    optionSuccessStatus:200,
 }))

con.connect((err) => {
    if(err) {
        throw err
    } else {
        console.log("Mysql Connected!")
    }
})

app.use(express.static('client/dist/client'))

app.post('/login', (req, res) => {
    const user = req.body
    const sql = "SELECT * FROM people WHERE Name = " + mysql.escape(user.name)+" AND Password = " + mysql.escape(user.password)
    con.query(sql, (err, result) => {
        if(err) throw err
        if(result.length == 0) {
            res.status(401).send("NOTGOOd")
        } else if(result.Name != "") {
            const token = generateToken(user)
            const obj = {
                token: token,
                GroupID: result[0].GroupID
            }
            res.send(JSON.stringify(obj))
        } else {
            res.status(401).send("nemjó")
        }
    })
})

app.get("/destionations", verifyToken, (req, res) => {
    const sql = "SELECT d.DestinationID, d.Destinationimage, d.Body, d.Destinationname, IF(t.TourID IS null, 0, COUNT(d.DestinationID)) AS tcount FROM destination d LEFT JOIN tours t ON t.DestinationID = d.DestinationID GROUP BY destinationID ORDER BY tcount DESC"
    con.query(sql, (err, result) => {
        if(err) throw err

        res.send(JSON.stringify(result))
        });

})

app.get("/groupsname", verifyToken, (req, res) => {
    const sql = 'SELECT g.Groupname, g.GroupID FROM groups g'
    con.query(sql, (err, result) => {
        if(err) throw new err

        res.send(JSON.stringify(result))
        });

})

app.get("/names", verifyToken, (req, res) => {
    const sql = 'SELECT p.PeopleID, p.Name, p.GroupID  FROM people p INNER JOIN groups g ON p.GroupID = g.GroupID'
    con.query(sql, (err, result) => {
        if(err) throw new err
        res.send(JSON.stringify(result))
        });

})

app.get("/destionation/:id", verifyToken, (req, res) => {
    const id = req.params.id
    const sql = `SELECT * FROM destination d WHERE d.DestinationID = ${id}`
    con.query(sql, (err, result) => {
        if(err) throw new err
        res.send(JSON.stringify(result))
        });
})

app.get("/groups", verifyToken, (req, res) => {
    const sql = 'SELECT * FROM groups'
    con.query(sql, (err, result) => {
        if(err) throw new err

        res.send(JSON.stringify(result))
        });

})

app.post("/people", verifyToken, (req, res) => {
    const user = req.body.name
    const sql = 'SELECT * FROM people p INNER JOIN groups g ON p.GroupID = g.GroupID WHERE p.Name = '+mysql.escape(user)
    con.query(sql, (err, result) => {
        if(err) throw new err
        const obj = {
            PeopleID: result[0].PeopleID,
            Name: result[0].Name,
            GroupID: result[0].GroupID,
            Groupname: result[0].Groupname
        }
        res.send(JSON.stringify(obj))
        });

})

app.post("/tours", verifyToken, upload.single('file'),(req, res) => {
    const date = new Date(req.body.date).toISOString('hu-HU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })
    let tour = {
        DestinationID: Number(req.body.destination),
        Tourimage: req.file.filename.toString(),
        Date: date.substring(0, 10),
        PointValue: Number(req.body.groups) * 100
    }
    let peoples = req.body.peoples.split(" ").filter(e =>e != 0)
    let sql = `INSERT INTO tours(DestinationID, Pointvalue, Tourimage, Date) VALUES(${tour.DestinationID}, ${tour.PointValue}, ${mysql.escape(tour.Tourimage)}, ${mysql.escape(tour.Date)})`
    con.query(sql, (err, result) => {
        if(err) throw err
        let tourID = result.insertId
        for(let i = 0; i < peoples.length; i++) {
            let sql2 = `INSERT INTO tourspeople(TourID, PeopleID) VALUES (${mysql.escape(tourID)}, ${mysql.escape(peoples[i])});`
            con.query(sql2, (err, result) =>{
                if(err) throw err
            })
        }
        res.send({message: "Success!"})
    })
})

app.get("/destinationimages/:id", (req, res) => {
    const sql = `SELECT t.Tourimage from tours t WHERE t.DestinationID = ${mysql.escape(req.params.id)}`
    con.query(sql, (err, result) => {
        if(err) throw err
        res.send(result)
    })
})

app.get("/grouppoints", verifyToken, (req, res) => {
    const sql = `
    SELECT
        d.Destinationname,
        t.Tourimage,
        t.Date,
        g.GroupID AS ID,
        t.Pointvalue*SUM(point.multiplier) AS points
    FROM
    tours t 
    INNER JOIN tourspeople tp ON t.TourID = tp.TourID
    INNER JOIN people p ON p.PeopleID = tp.PeopleID
    INNER JOIN groups g ON p.GroupID = g.GroupID
    INNER JOIN destination d ON d.DestinationID = t.DestinationID
    INNER JOIN (
        SELECT
        g.GroupID AS GroupID,
        1/(COUNT(p.PeopleID)) AS multiplier
    FROM
        groups g
    INNER JOIN people p ON g.GroupID = p.GroupID
    GROUP BY p.GroupID
    ) AS point ON p.GroupID = point.GroupID
    GROUP BY
        t.TourID, p.GroupID`

    con.query(sql, (err, result) => {
        if (err) throw err
        res.send(result)
    })
})

app.get("/peoplespoints", verifyToken, (req, res) => {
    const sql = `
    SELECT
        p.PeopleID,
        p.Name,
        COUNT(t.TourID) AS count,
        IF (SUM(t.Pointvalue) IS NULL, 0, SUM(t.Pointvalue)) as point
    FROM
        tours t
    INNER JOIN tourspeople tp ON t.TourID = tp.TourID
    RIGHT JOIN people p ON tp.PeopleID = P.PeopleID
    GROUP BY p.PeopleID
    ORDER BY point DESC;
    `
    con.query(sql, (err, result) => {
        if(err) throw err
        res.send(result)
    })
})

app.listen(port, () => {
    console.log("app runing on port: "+port)
})

function verifyToken(req, res, next) {
    user = checkToken(req.headers['authorization'])
    let data = []
    const sql = "SELECT * FROM people WHERE Name = " + mysql.escape(user.name)+" AND Password = " + mysql.escape(user.password)
    con.query(sql, (err, result) => {
        if(err) throw err
        data = result
    })
    if(data.length = 0) {
        throw new error
    } else {
        next()
    }
}