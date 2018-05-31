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
    if (err) {
        console.log("Error: No se ha podido conectar con la base de datos! ¿Estas utilizando XAMPP?", err);
    } else {
        console.log("Connected in database: " + databaseConf['database']);
    }
});

/***********************************/
/*    REALIZAMOS TODAS LAS APIS    */
/***********************************/

/***********************/
/*    API SOCIOS       */
/***********************/
app.get('/api/socios', (req, res) => {
    connection.query("SELECT * FROM socios", (err, data) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data);
        }
    });
});

app.get('/api/socios/:id', (req, res) => {
    let id_socio = req.params.id;
    connection.query(`SELECT * FROM socios where id_socio = '${id_socio}'`, (err, data) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data);
        }
    });
});

app.post('/api/socios', (req, res) => {
    const values = `'${req.body.nombre}', '${req.body.apellidos}', '${req.body.direccion}',
                    '${req.body.fecha_alta}', '${req.body.fecha_baja}', ${req.body.telefono},
                    null, '${req.body.email}'`;
    connection.query(`INSERT INTO usuarios VALUES ('${req.body.email}', 'delonet', 0)`, (err, data) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            connection.query(`INSERT INTO socios VALUES ('', ${values} )`, (errSocio, dataSocio) => {
                if (errSocio) {
                    res.status(404).json({message: errSocio});
                } else {
                    res.status(200).send(dataSocio);
                }
            });
        }
    })
});

app.delete('/api/socios/:id', (req, res) => {
    var id_socio = req.params.id;
    connection.query(`DELETE FROM socios WHERE id_socio = '${id_socio}'`, (err, data ) => {
        if (error) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data);
        }
    });
});

app.put('/api/socios/:id', function (req, res) {
    var id_socio = req.params.id;
    const values = `nombre = '${req.body.nombre}',
                    apellidos =  '${req.body.apellidos}', 
                    direccion = '${req.body.direccion}', 
                    fecha_alta = '${req.body.fecha_alta}', 
                    fecha_baja = '${req.body.fecha_baja}', 
                    telefono = ${req.body.telefono}`;
    connection.query(`UPDATE socios SET ${changeText} WHERE id_socio = '${id_socio}'`, (err, data ) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data);
        }
    });

});

/***********************/
/*    API CLASES       */
/***********************/
app.get('/api/clases', (req, res) => {
    connection.query("SELECT * FROM clases", (err, data) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data);
        }
    });
});

app.get('/api/clases/:id', (req, res) => {
    let id_clase = req.params.id;
    connection.query(`SELECT * FROM clases WHERE id_clase = '${id_clase}'`, (err, data) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data);
        }
    });
});

app.post('/api/clases', (req, res) => {
    const values = `'${req.body.nombre}', ${req.body.num_plazas}, ${req.body.edad_maxima},
    '${req.body.nivel}', '${req.body.hora}', ${req.body.dias}`;
    connection.query(`INSERT INTO clases VALUES ('', ${values} )`, (err, data) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data);
        }
    });
});

app.delete('/api/clases/:id', (req, res) => {
    var id_clase = req.params.id;
    connection.query(`DELETE FROM clases WHERE id_clase = '${id_clase}'`, (err, data ) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data);
        }
    });
});

app.put('/api/clases/:id', (req, res) => {
    var id_clase = req.params.id;
    const values = `nombre = '${req.body.nombre}', 
                    num_plazas = ${req.body.num_plazas}, 
                    edad_maxima = ${req.body.edad_maxima},
                    nivel = '${req.body.nivel}', 
                    hora = '${req.body.hora}', 
                    dias = ${req.body.dias}`;
    connection.query(`UPDATE clases SET ${values} WHERE id_clase = '${id_clase}'`, (err, data ) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data);
        }
    });
});

/***********************/
/*    API CALLES       */
/***********************/
app.get('/api/calles', (req, res) => {
    connection.query("SELECT * FROM calles", (err, data) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data);
        }
    });
});

app.get('/api/calles/:id', (req, res) => {
    let id_calle = req.params.id;
    connection.query(`SELECT * FROM calles WHERE id_calle = '${id_calle}'`, (err, data) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data);
        }
    });
});

/***********************/
/*    API MONITORES    */
/***********************/
app.get('/api/monitores', (req, res) => {
    connection.query("SELECT * FROM monitores", (err, data) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data);
        }
    });
});

app.get('/api/monitores/:id', (req, res) => {
    let id_monitor = req.params.id;
    connection.query(`SELECT * FROM monitores WHERE id_monitor = '${id_monitor}'`, (err, data) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data);
        }
    });
});

app.post('/api/monitores', (req, res) => {
    const values = `'${req.body.nombre}', '${req.body.apellidos}', '${req.body.direccion}',
                    ${req.body.telefono}, '${req.body.email}'`;
    connection.query(`INSERT INTO monitores VALUES ('', ${values} )`, (err, data) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data);
        }
    });
});

app.put('/api/monitores/:id', (req, res) => {
    var id_monitor = req.params.id;
    const values = `nombre = '${req.body.nombre}', 
                    apellidos = '${req.body.apellidos}', 
                    direccion = '${req.body.direccion}',
                    telefono = ${req.body.telefono}, 
                    email = '${req.body.email}'`;
    connection.query(`UPDATE monitores SET ${changeText} WHERE id_monitor = '${id_monitor}'`, (err, data ) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data);
        }
    });
});

app.delete('/api/monitores/:id', (req, res) => {
    var id_monitor = req.params.id;
    connection.query(`DELETE FROM monitores WHERE id_monitor = '${id_monitor}'`, (err, data ) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data);
        }
    });
});