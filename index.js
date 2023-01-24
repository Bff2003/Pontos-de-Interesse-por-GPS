const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const bodyParser = require("body-parser");

const db = new sqlite3.Database("database/database.db", (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log("Connected to the database.");
});

const app = express();
const port = 3000;
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.status(200).send("Please use /interess");
});

app.post("/interess", (req, res) => {
    /**
     * Create a new interess point in database
     *
     * Required parameters:
     * nome (string) : name of the point
     * latitude (float) : latitude of the point
     * longitude (float) : longitude of the point
     *
     * Optional parameters:
     * descricao (string) : description of the point
     *
     * Possible Codes:
     * 200 OK (Success)
     * 400 Bad Request (Missing parameters)
     * 500 Internal Server Error (Error)
     */
    !req.body.nome ? res.status(400).send("nome is required") : null;
    !req.body.latitude ? res.status(400).send("latitude is required") : null;
    !req.body.longitude ? res.status(400).send("longitude is required") : null;

    let descricao = [
        req.body.descricao ? "descricao" : "",
        req.body.descricao ? ", '" + req.body.descricao + "'" : "",
    ];

    let sql = `INSERT INTO pontoDeInteresse (nome, latitude, longitude, ${descricao[0]}) VALUES ('${req.body.nome}', '${req.body.latitude}', '${req.body.longitude}'${descricao[1]});`;

    db.run(sql, [], (err) => {
        if (err) {
            res.status(500).send("Error"); // 500 Internal Server Error
            throw err;
        }
        res.status(200).send("Success"); // 200 OK
    });
    return;
});

app.delete("/interess", (req, res) => {
    /**
     * Delete a interess point in database
     *
     * Required parameters: (at least one)
     * nome (string) : name of the point
     * latitude (float) : latitude of the point
     * longitude (float) : longitude of the point
     *
     * Possible Codes:
     * 200 OK (Success)
     * 400 Bad Request (Missing parameters)
     * 500 Internal Server Error (Error)
     */

    let deleteStatements = [];
    !req.body.nome ? deleteStatements.push("nome = '" + req.body.nome + "'") : null;
    !req.body.latitude ? deleteStatements.push("latitude = '" + req.body.latitude + "'") : null;
    !req.body.longitude ? deleteStatements.push("longitude = '" + req.body.longitude + "'") : null;
    !req.body.descricao ? deleteStatements.push("descricao = '" + req.body.descricao + "'") : null;

    !deleteStatements.length ? res.status(400).send("At least one parameter is required") : null;

    let sql = `DELETE FROM pontoDeInteresse WHERE ${deleteStatements.join(" AND ")};`;

    db.run(sql, [], (err) => {
        if (err) {
            res.status(500).send("Error"); // 500 Internal Server Error
            throw err;
        }
        res.status(200).send("Success"); // 200 OK
    });
    return;
});

app.put("/interess", (req, res) => {
    /**
     * Update a interess point in database
     *
     * Required parameters:
     * nome (string) : name of the point
     *
     * Optional parameters:
     * latitude (float) : latitude of the point
     * longitude (float) : longitude of the point
     * descricao (string) : description of the point
     *
     * Possible Codes:
     * 200 OK (Success)
     * 400 Bad Request (Missing parameters)
     * 500 Internal Server Error (Error)
     */

    let updateStatements = [];
    !req.body.nome ? updateStatements.push("nome = '" + req.body.nome + "'"): null;
    !req.body.latitude ? updateStatements.push("latitude = '" + req.body.latitude + "'"): null;
    !req.body.longitude ? updateStatements.push("longitude = '" + req.body.longitude + "'"): null;
    !req.body.descricao ? updateStatements.push("descricao = '" + req.body.descricao + "'"): null;
    !updateStatements.length ? res.status(400).send("At least one parameter is required"): null;

    let sql = `UPDATE pontoDeInteresse SET ${updateStatements.join(",")} WHERE nome = '${req.body.nome}';`;

    db.run(sql, [], (err) => {
        if (err) {
            res.status(500).send("Error"); // 500 Internal Server Error
            throw err;
        }
        res.status(200).send("Success"); // 200 OK
    });
    return;
});

// get interess at nerby by lat and long
app.get("/interess", (req, res) => {
    /**
     * Get a interess point in database
     *
     * Required parameters:
     * lat (float) : latitude of the point
     * long (float) : longitude of the point
     *
     * Optional parameters:
     * maxDistance (float) : max distance in km
     * showDistance (boolean) : show distance in km
     * orderBy (string) : order by distance or name (distance (if only the showDistance is true) or name)
     *
     * Possible Codes:
     * 200 OK (Success)
     * 400 Bad Request (Missing parameters)
     * 500 Internal Server Error (Error)
     */

    // Required
    let lat = req.query.lat;
    !lat ? res.status(400).send("lat is required") : null;
    let long = req.query.long;
    !long ? res.status(400).send("long is required") : null;

    // Optional
    let maxDistance = req.query.maxDistance; // in km
    let showDistance = req.query.showDistance; // true or false
    let orderBy = req.query.orderBy; // distance or name

    // Check if showDistance is true, if true, add distance to query
    let distanceQuery = "";
    if (showDistance != undefined) {
        distanceQuery = `,6371 * acos(cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${long})) + sin(radians(${lat})) * sin(radians(latitude))) as distance`;
    } else {
        distanceQuery = "";
    }

    // Check if orderBy is distance, if true, add order by distance to query
    if (orderBy != undefined && orderBy == "distance" && showDistance != undefined) {
        orderBy = " order by distance";
    } else if (orderBy != undefined && orderBy == "distance" && showDistance == undefined) {
        res.status(400).send("showDistance is required to orderBy distance");
        return;
    } else if (orderBy != undefined && orderBy == "name") {
        orderBy = " order by nome";
    }

    // Mount query
    let sql = "";
    if (maxDistance) {
        sql = `select nome, latitude, longitude ${distanceQuery}
        from pontoDeInteresse 
        where (6371 * acos(cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${long})) + sin(radians(${lat})) * sin(radians(latitude)))) <= ${maxDistance} ${orderBy};`;
    } else {
        sql = `select nome, latitude, longitude${distanceQuery} from pontoDeInteresse ${orderBy};`;
    }

    // Execute query
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.status(200).send(rows);
    });
    return;
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
