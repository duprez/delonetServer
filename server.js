'use strict';

// Importamos nuestras configuraciones
const databaseConf = require('./configs/database');
const serverConf = require('./configs/server');

const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser'); // Cuerpo de la consulta al servidor
const cors = require('cors');

/******************************/
/*    CREAMOS EL SERVIDOR    */
/*****************************/ 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const host = serverConf['host'];
const port = serverConf['port'];

app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
});


/*****************************************/
/*    CONECTAMOS CON LA BASE DE DATOS    */
/*****************************************/
var connection = mysql.createConnection({
    host: databaseConf['host'],
    user: databaseConf['user'],
    password: databaseConf['password'],
    database: databaseConf['database']
});

connection.connect(function (err) {
    if (err) console.log("Error: No se ha podido conectar con la base de datos! ¿Estas utilizando XAMPP?");
    else console.log("Connected in database: " + databaseConf['database']);
});

/***********************************/
/*    REALIZAMOS TODAS LAS APIS    */
/***********************************/

/***********************/
/*    API SOCIOS       */
/***********************/
app.get('/api/socios', (req, res) => {
    connection.query("SELECT * FROM socios", (error, data) => {
        if ( error )
            console.log("Error: No se pueden obtener los socios");
        else res.send(data);
    });
});

app.get('/api/socios/:id', (req, res) => {
    let id_socio = req.params.id;
    connection.query(`SELECT * FROM socios where id_socio = '${id_socio}'`, (error, data) => {
        if ( error )
            console.log("Error: No se pueden obtener el socio");
        else res.send(data);
    });
});

app.post('/api/socios', (req, res) => {
    const keys = Object.keys(req.body);
    let index = 0;
    const changeText = '\'' + req.body["nombre"] + '\',' +
    '\'' + req.body["apellidos"] + '\',' +
    '\'' + req.body["direccion"] + '\',' +
    '\'' + req.body["fecha_alta"] + '\',' +
    '\'' + req.body["fecha_baja"] + '\',' +
           req.body["telefono"] + ',' +
        null;

    connection.query(`INSERT INTO socios VALUES ('', ${changeText} )`, (error, data) => {
        if ( error ){
            console.log("Error: No se ha podido insertar el socio.");
            console.log(error);
        }
    });
});

app.delete('/api/socios/:id', function (req, res) {
    var id_socio = req.params.id;
    connection.query(`DELETE FROM socios WHERE id_socio = '${id_socio}'`, (error, data ) => {
        if ( error ) console.log("Error: No se ha podido borrar el socio indicado.");
        else res.send("Socio número "+ id_socio + " borrado");
    });
});

app.put('/api/socios/:id', function (req, res) {
    var id_socio = req.params.id;
    const keys = Object.keys(req.body);
    let index = 0;
    let changeText = "";
    keys.forEach(key => {
        changeText += key + " = '" + req.body[key] + "'";
        if( index < keys.length - 1 ) changeText += " , ";
        index++;
    });
    connection.query(`UPDATE socios SET ${changeText} WHERE id_socio = '${id_socio}'`, (error, data ) => {
        if ( error ) {
            console.log("Error: No se ha podido actualizar el socio indicado.");
            console.log(error);
        }
    });

});

/***********************/
/*    API CLASES       */
/***********************/
app.get('/api/clases', (req, res) => {
    connection.query("SELECT * FROM clases", (error, data) => {
        if ( error )
            console.log("Error: No se pueden obtener las clases");
        else res.send(data);
    });
});

app.get('/api/clases/:id', (req, res) => {
    let id_clase = req.params.id;
    connection.query("SELECT * FROM clases WHERE id_clase = '"+ id_clase +"'", (error, data) => {
        if ( error )
            console.log("Error: No se pueden obtener la clase: " + id_clase);
        else res.send(data);
    });
});

app.post('/api/clases', (req, res) => {
    const keys = Object.keys(req.body);
    let index = 0;
    let changeText = "";
    keys.forEach(key => {
        changeText += "'" + req.body[key] + "'";
        if( index < keys.length - 1 ) changeText += " , ";
        index++;
    });

    connection.query(`INSERT INTO clases VALUES ('', ${changeText} )`, (error, data) => {
        if ( error ) console.log("Error: No se ha podido insertar las clases.");
        else res.send("Nueva clase añadida");
    });
});

app.delete('/api/clases/:id', function (req, res) {
    var id_clase = req.params.id;
    connection.query(`DELETE FROM clases WHERE id_clase = '${id_clase}'`, (error, data ) => {
        if ( error ) console.log("Error: No se ha podido borrar la clase indicada.");
        else res.send("Clase "+ id_clase + " borrada");
    });
});

app.put('/api/clases/:id', function (req, res) {
    var id_clase = req.params.id;
    const keys = Object.keys(req.body);
    let index = 0;
    let changeText = "";
    keys.forEach(key => {
        changeText += key + " = '" + req.body[key] + "'";
        if( index < keys.length - 1 ) changeText += " , ";
        index++;
    });
    connection.query(`UPDATE clases SET ${changeText} WHERE id_clase = '${id_clase}'`, (error, data ) => {
        if ( error ) console.log("Error: No se ha podido actualizar la clase.");
        else res.send("La clase " + id_clase + " ha sido modificada.");
    });

});

/***********************/
/*    API CALLES       */
/***********************/
app.get('/api/calles', (req, res) => {
    connection.query("SELECT * FROM calles", (error, data) => {
        if ( error )
            console.log("Error: No se pueden obtener las calles");
        else res.send(data);
    });
});

app.get('/api/calles/:id', (req, res) => {
    let id_calle = req.params.id;
    connection.query(`SELECT * FROM calles WHERE id_calle = '${id_calle}'`, (error, data) => {
        if ( error )
            console.log("Error: No se pueden obtener las calles");
        else res.send(data);
    });
});

/***********************/
/*    API MONITORES    */
/***********************/
app.get('/api/monitores', (req, res) => {
    connection.query("SELECT * FROM monitores", (error, data) => {
        if ( error )
            console.log("Error: No se pueden obtener los monitores");
        else res.send(data);
    });
});

app.get('/api/monitores/:id', (req, res) => {
    let id_monitor = req.params.id;
    connection.query(`SELECT * FROM monitores WHERE id_monitor = '${id_monitor}'`, (error, data) => {
        if ( error )
            console.log("Error: No se pueden obtener los monitores");
        else res.send(data);
    });
});

app.post('/api/monitores', (req, res) => {
    const keys = Object.keys(req.body);
    let index = 0;
    let changeText = "";
    keys.forEach(key => {
        changeText += "'" + req.body[key] + "'";
        if( index < keys.length - 1 ) changeText += " , ";
        index++;
    });

    connection.query(`INSERT INTO monitores VALUES ('', ${changeText} )`, (error, data) => {
        if ( error ) console.log("Error: No se ha podido insertar el monitor.");
        else res.send("Nuevo monitor añadido");
    });
});

app.put('/api/monitores/:id', function (req, res) {
    var id_monitor = req.params.id;
    const keys = Object.keys(req.body);
    let index = 0;
    let changeText = "";
    keys.forEach(key => {
        changeText += key + " = '" + req.body[key] + "'";
        if( index < keys.length - 1 ) changeText += " , ";
        index++;
    });
    connection.query(`UPDATE monitores SET ${changeText} WHERE id_monitor = '${id_monitor}'`, (error, data ) => {
        if ( error ) console.log("Error: No se ha podido actualizar el monitor.");
        else res.send("El monitor " + id_monitor + " ha sido modificado.");
    });

});

app.delete('/api/monitores/:id', function (req, res) {
    var id_monitor = req.params.id;
    connection.query(`DELETE FROM monitores WHERE id_monitor = '${id_monitor}'`, (error, data ) => {
        if ( error ) console.log("Error: No se ha podido borrar el monitor indicado.");
        else res.send("Monitor "+ id_monitor + " borrado");
    });
});