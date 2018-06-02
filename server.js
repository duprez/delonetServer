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
    port: databaseConf['port'],
    user: databaseConf['user'],
    password: databaseConf['password'],
    database: databaseConf['database'],
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

connection.connect(function (err) {
    if (err) {
        console.log("Error: No se ha podido conectar con la base de datos! ¿Estas utilizando XAMPP?", err);
    } else {
        console.log("Connected to database: " + databaseConf['database']);
    }
});

/***********************************/
/*    REALIZAMOS TODAS LAS APIS    */
/***********************************/

/***********************/
/*    API SOCIOS       */
/***********************/
app.get('/api/socios', (req, res) => {
    connection.query("SELECT s.*, u.profile_image FROM socios s, usuarios u where u.email = s.email", (err, data) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data);
        }
    });
});

app.get('/api/socios/:id', (req, res) => {
    let id_socio = req.params.id;
    connection.query(`SELECT s.*, u.profile_image FROM socios s, usuarios u where id_socio = '${id_socio}' and u.email = s.email`, (err, data) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data);
        }
    });
});

app.post('/api/socios', (req, res) => {
    const values = `'${req.body.nombre}', '${req.body.apellidos}', '${req.body.direccion}', 
                    '${req.body.fecha_alta}', '${req.body.fecha_baja}',
                     ${req.body.telefono}, null, '${req.body.email}'`;
    
    connection.query(`INSERT INTO usuarios VALUES ('${req.body.email}', 'delonet', 0, '${req.body.profile_image}')`, (err, data) => {
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
    const id_socio = req.params.id;
    let email;
    connection.query(`SELECT email FROM socios WHERE id_socio = '${id_socio}'`, (err, data ) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            email = data[0].email;
            connection.query(`DELETE FROM socios WHERE id_socio = '${id_socio}'`, (err2, data2) => {
                if (err2) {
                    res.status(404).json({message: err2});
                } else {
                    connection.query(`DELETE FROM usuarios WHERE email = '${email}'`, (err3, data3) => {
                        if (err3) {
                            res.status(404).json({message: err3});
                        } else {
                            res.status(200).send(data3);
                        }
                    });
                }
            });
        }
    });
});

app.put('/api/socios/:id', function (req, res) {
    var id_socio = req.params.id;
    const values = `s.nombre = '${req.body.nombre}',
                    s.apellidos =  '${req.body.apellidos}', 
                    s.direccion = '${req.body.direccion}', 
                    s.fecha_alta = '${req.body.fecha_alta}', 
                    s.fecha_baja = '${req.body.fecha_baja}', 
                    s.telefono = ${req.body.telefono}`;
    const valuesUser = `u.email = '${req.body.email}',
                        u.profile_image = '${req.body.profile_image}'`;
    connection.query(`UPDATE usuarios u, socios s SET ${valuesUser}, ${values} WHERE u.email = s.email and s.id_socio = '${id_socio}'`, 
        (err, data ) => {
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
    connection.query("SELECT m.*, u.profile_image FROM monitores m, usuarios u where u.email = m.email", (err, data) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data);
        }
    });
});

app.get('/api/monitores/:id', (req, res) => {
    let id_monitor = req.params.id;
    connection.query(`SELECT m.*, u.profile_image FROM monitores m, usuarios u where id_monitor = '${id_monitor}' and u.email = m.email`, (err, data) => {
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
    
    connection.query(`INSERT INTO usuarios VALUES ('${req.body.email}', 'delonet', 1, '${req.body.profile_image}')`, (err, data) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            connection.query(`INSERT INTO monitores VALUES ('', ${values} )`, (errMonitor, dataMonitor) => {
                if (dataMonitor) {
                    res.status(404).json({message: errMonitor});
                } else {
                    res.status(200).send(dataMonitor);
                }
            });
        } 
    })
});

app.delete('/api/monitores/:id', (req, res) => {
    const id_monitor = req.params.id;
    let email;
    connection.query(`SELECT email FROM monitores WHERE id_monitor = '${id_monitor}'`, (err, data ) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            email = data[0].email;
            connection.query(`DELETE FROM monitores WHERE id_monitor = '${id_monitor}'`, (err2, data2) => {
                if (err2) {
                    res.status(404).json({message: err2});
                } else {
                    connection.query(`DELETE FROM usuarios WHERE email = '${email}'`, (err3, data3) => {
                        if (err3) {
                            res.status(404).json({message: err3});
                        } else {
                            res.status(200).send(data3);
                        }
                    });
                }
            });
        }
    });
});

app.put('/api/monitores/:id', function (req, res) {
    var id_monitor = req.params.id;
    const values = `m.nombre = '${req.body.nombre}',
                    m.apellidos =  '${req.body.apellidos}', 
                    m.direccion = '${req.body.direccion}', 
                    m.telefono = ${req.body.telefono}`;
    const valuesUser = `u.email = '${req.body.email}',
                        u.profile_image = '${req.body.profile_image}'`;
    connection.query(`UPDATE usuarios u, monitores m SET ${valuesUser}, ${values} WHERE u.email = m.email and m.id_monitor = '${id_monitor}'`, 
        (err, data ) => {
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
/*    API RESERVAS     */
/***********************/
app.get('/api/reservas', (req, res) => {
    let reservas = [];
    connection.query("SELECT * FROM reservas order by id_calle ASC", (err, data) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            data.forEach(element => {
                if (!reservas[element.id_calle - 1]) {
                    reservas[element.id_calle - 1] = new Array();
                }
                reservas[element.id_calle - 1].push(element);
            });
            res.status(200).send(reservas);
        }
    });
});

app.post('/api/reservas', (req, res) => {
    const values = `${req.body.id_socio}, ${req.body.id_calle}, ${req.body.id_clase}, 
                    '${req.body.fecha}'`;
    connection.query(`INSERT INTO reservas VALUES ('', ${values}, null)`, (err, data) => {
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
