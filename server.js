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
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
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
        console.log("Connected to database: " + databaseConf['database']);
    }
});

/***********************************/
/*    REALIZAMOS TODAS LAS APIS    */
/***********************************/

/***********************/
/*    API USUARIOS     */
/***********************/
app.put('/api/password/:id', function (req, res) {
    var id_user = req.params.id;
    const values = `u.passwrd = '${req.body.password}'`;
    const tabla = req.body.type;
    var id;
    switch(tabla) {
        case 'socios':
            id = 'id_socio'; break;
        case 'monitores':
            id = 'id_monitor'; break;
    }
    connection.query(`UPDATE usuarios u, ${tabla} t SET ${values} WHERE u.email = t.email and t.${id} = '${id_user}'`, 
        (err, data ) => {
            if (err) {
                res.status(404).json({message: err});
            } else {
                res.status(200).send(data);
            }
    });
});

/***********************/
/*    API SOCIOS       */
/***********************/
app.get('/api/socios', (req, res) => {
    connection.query(`SELECT s.*, u.profile_image, c.nombre as nombre_clase FROM socios s, usuarios u, clases c 
                    where u.email = s.email and s.id_clase = c.id_clase`, (err, data) => {
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
            res.status(200).send(data[0]);
        }
    });
});

app.post('/api/socios', (req, res) => {
    const values = `'${req.body.nombre}', '${req.body.apellidos}', '${req.body.direccion}', 
                    '${req.body.fecha_alta}', '${req.body.fecha_baja}',
                     ${req.body.telefono}, ${req.body.id_clase}, '${req.body.email}'`;

    const profile_image = req.body.profile_image ? req.body.profile_image : null;
    let image = null;
    if (profile_image && profile_image !== null) {
        const image_parts = profile_image.split(',');
        image = '\'' + image_parts[1] + '\'';
    }

    connection.query(`INSERT INTO usuarios VALUES ('${req.body.email}', 'delonet', 0, ${image})`, (err, data) => {
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
    connection.query(`DELETE s, u FROM socios s JOIN usuarios u ON u.email = s.email WHERE s.id_socio = '${id_socio}'`, (err, data ) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
           res.status(200).send(data);
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
                    s.telefono = ${req.body.telefono},
                    s.id_clase = ${req.body.id_clase}`;

    const profile_image = req.body.profile_image ? req.body.profile_image : null;
    let image = null;
    if (profile_image && profile_image !== null) {
        const image_parts = profile_image.split(',');
        image = image_parts[1];
    }
    let valuesUser;
    if (image !== null) {
        valuesUser = `u.email = '${req.body.email}',
                    u.profile_image = '${image}'`;
    } else {
        valuesUser = `u.email = '${req.body.email}',
                    u.profile_image = ${image}`;
    }

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
            res.status(200).send(data[0]);
        }
    });
});

app.post('/api/monitores', (req, res) => {
    const values = `'${req.body.nombre}', '${req.body.apellidos}', '${req.body.direccion}', 
                     '${req.body.telefono}', '${req.body.email}'`;
    
    const profile_image = req.body.profile_image ? req.body.profile_image : null;
    let image = null;
    if (profile_image && profile_image !== null) {
        const image_parts = profile_image.split(',');
        image = '\'' + image_parts[1] + '\'';
    }
    connection.query(`INSERT INTO usuarios VALUES ('${req.body.email}', 'delonet', 1, ${image})`, (err, data) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            connection.query(`INSERT INTO monitores VALUES ('', ${values} )`, (errMonitor, dataMonitor) => {
                if (errMonitor) {
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
    connection.query(`DELETE m, u FROM monitores m JOIN usuarios u ON u.email = m.email WHERE m.id_monitor = '${id_monitor}'`, (err, data) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data);
        }
    });
});

app.put('/api/monitores/:id', function (req, res) {
    var id_monitor = req.params.id;
    const values = `m.nombre = '${req.body.nombre}',
                    m.apellidos =  '${req.body.apellidos}', 
                    m.direccion = '${req.body.direccion}', 
                    m.telefono = ${req.body.telefono}`;

    const profile_image = req.body.profile_image ? req.body.profile_image : null;
    let image = null;
    if (profile_image && profile_image !== null) {
        const image_parts = profile_image.split(',');
        image = image_parts[1];
    }
    let valuesUser;
    if (image !== null) {
        valuesUser = `u.email = '${req.body.email}',
                    u.profile_image = '${image}'`;
    } else {
        valuesUser = `u.email = '${req.body.email}',
                    u.profile_image = ${image}`;
    }
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
    const consulta = `SELECT c.*, GROUP_CONCAT(id_monitor) as monitores FROM clases c, clasesMonitores cm WHERE c.id_clase = cm.id_clase GROUP BY
                      cm.id_clase ORDER BY c.id_clase`;
    connection.query(`${consulta}`, (err, data) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data);
        }
    });
});

app.get('/api/clases/:id', (req, res) => {
    let id_clase = req.params.id;
    const consulta = `SELECT c.*, GROUP_CONCAT(id_monitor) as monitores FROM clases c, clasesMonitores cm WHERE c.id_clase = '${id_clase}'
                     and  c.id_clase = cm.id_clase GROUP BY cm.id_clase ORDER BY c.id_clase`;
    connection.query(`${consulta}`, (err, data) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data[0]);
        }
    });
});

app.get('/api/clases-socios/:id', (req, res) => {
    let id_clase = req.params.id;
    const consulta = `SELECT c.nombre as nombre_clase, c.nivel, c.id_clase, c.hora, c.dias, 
                     s.* FROM clases c, socios s WHERE c.id_clase = '${id_clase}'
                     and c.id_clase = s.id_clase GROUP BY c.id_clase, s.id_socio`;
    connection.query(`${consulta}`, (err, data) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data);
        }
    });
});

app.get('/api/clases/:id/add-member', (req, res) => {
    let id_clase = req.params.id;
    const consulta = `SELECT s.* FROM clases c, socios s WHERE s.id_clase IS NULL GROUP BY s.id_socio`;
    connection.query(`${consulta}`, (err, data) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data);
        }
    });
});

app.post('/api/clases', (req, res) => {
    let error = '';
    const values = `'${req.body.nombre}', ${req.body.num_plazas}, ${req.body.edad_maxima},
    '${req.body.nivel}', '${req.body.hora}', '${req.body.dias}'`;
    const monitores = req.body.monitores.length > 1 ? req.body.monitores.split(',') : req.body.monitores;
    connection.query(`INSERT INTO clases VALUES ('', ${values} )`, (err, data) => {
        if (err) {
            error = err;
        } else {
            connection.query(`SELECT id_clase FROM clases ORDER BY id_clase DESC LIMIT 1`, (err2, data2) => {
                if (err2) {
                    error = err2;
                } else {
                    const id_clase = data2[0]['id_clase'];
                    if (monitores.length > 1) {
                        monitores.forEach(monitor => {
                            connection.query(`INSERT INTO clasesMonitores VALUES ('${monitor}', '${id_clase}')`, (err3, data3) => {
                                if (err3) {
                                    error = err3;
                                }
                            });
                        });
                    } else {
                        connection.query(`INSERT INTO clasesMonitores VALUES ('${monitores}', '${id_clase}')`, (err4, data4) => {
                            if (err4) {
                                error = err4;
                            }
                        });
                    }
                }
            });
        }
    });
    if (error && error.length > 0) {
        res.status(400).json({message: error});
    } else {
        res.status(200).json({message: 'OK'});
    }
});

app.delete('/api/clases/:id', (req, res) => {
    var id_clase = req.params.id;
    const borrado = `DELETE c, cm FROM clases c 
                     JOIN clasesMonitores cm ON cm.id_clase = c.id_clase WHERE 
                     c.id_clase = '${id_clase}'`;
    connection.query(`${borrado}`, (err, data ) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            res.status(200).send(data);
        }
    });
});

app.put('/api/clases/:id', (req, res) => {
    var id_clase = req.params.id;
    let error = '';
    const values = `c.nombre = '${req.body.nombre}', 
                    c.num_plazas = ${req.body.num_plazas}, 
                    c.edad_maxima = ${req.body.edad_maxima},
                    c.nivel = '${req.body.nivel}', 
                    c.hora = '${req.body.hora}', 
                    c.dias = '${req.body.dias}'`;
    const monitores = req.body.monitores.length > 1 ? req.body.monitores.split(',') : req.body.monitores;
    if (monitores.length > 1) {
        monitores.forEach(monitor => {
            connection.query(`DELETE FROM clasesMonitores WHERE id_clase = '${id_clase}'`, (err, data) => {
                if (err) {
                    error = err;
                } else {
                    connection.query(`UPDATE clases c SET ${values}
                        WHERE c.id_clase = '${id_clase}'`, (err2, data2) => {
                            if (err2) {
                                error = err2;
                            } else {
                                connection.query(`INSERT INTO clasesMonitores VALUES ('${monitor}', '${id_clase}')`, (err3, data3) => {
                                    if (err3) {
                                        error = err3;
                                    }
                                });
                            }
                    });
                }
            });
        });
    } else {
        const monitor = monitores;
        connection.query(`DELETE FROM clasesMonitores WHERE id_clase = '${id_clase}'`, (err, data) => {
            if (err) {
               error = err;
            } else {
                connection.query(`UPDATE clases c SET ${values}
                    WHERE c.id_clase = '${id_clase}'`, (err2, data2) => {
                        if (err2) {
                            error = err2;
                        } else {
                            connection.query(`INSERT INTO clasesMonitores VALUES ('${monitor}', '${id_clase}')`, (err3, data3) => {
                                if (err3) {
                                    error = err3;
                                }
                            });
                        }
                });
            }
        });
    }

    if (error && error.length > 0) {
        res.status(400).json({message: error});
    } else {
        res.status(200).json({message: 'OK'});
    }
});

/***********************/
/*    API RESERVAS     */
/***********************/
app.get('/api/reservas', (req, res) => {
    let reservas = [
        { lane: '1', events: [] },
        { lane: '2', events: [] },
        { lane: '3', events: [] },
        { lane: '4', events: [] },
        { lane: '5', events: [] },
        { lane: '6', events: [] }
    ];
    connection.query("SELECT id_calle, id_reserva, COALESCE(nombre,'Particular') AS nombre, fecha FROM reservas s left join clases c on s.id_clase = c.id_clase order by id_calle ASC", (err, data) => {
        if (err) {
            res.status(404).json({message: err});
        } else {
            data.forEach(element => {
                reservas[element.id_calle - 1].events.push(element);
            });
            res.status(200).send(reservas);
        }
    });
});

app.post('/api/reservas', (req, res) => {
    const values = `${req.body.id_socio}, ${req.body.id_calle}, ${req.body.id_clase}, 
                    '${req.body.fecha}'`;
    connection.query(`INSERT INTO reservas VALUES ('', ${values})`, (err, data) => {
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
            res.status(200).send(data[0]);
        }
    });
});

/***********************/
/*    API LOGIN        */
/***********************/

app.post('/api/sessions', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    connection.query(`SELECT * FROM usuarios WHERE email = '${email}'`, (err, data) => {
        if (err) {
            res.status(404).json({message: err});
        } else if (data.length < 1) {
            res.status(404).json({message: 'Usuario no encontrado'});
        } else {
            connection.query(`SELECT u.email, u.profile_image, u.is_admin, s.id_socio, s.nombre as s_nombre, 
            m.nombre as m_nombre, m.id_monitor FROM usuarios u 
            left join socios s on u.email = s.email left join monitores m on u.email = m.email 
            WHERE u.email = '${email}' and u.passwrd = '${password}'`, (err, data) => {
                if (err) {
                    res.status(404).json({message: err});
                } else if (data.length < 1) {
                    res.status(404).json({message: 'Contraseña incorrecta'});
                } else {
                    let response;
                    if (!data[0].is_admin) {
                        response = {
                            email: data[0].email,
                            id_socio: data[0].id_socio,
                            nombre: data[0].s_nombre,
                            profile_image: data[0].profile_image
                        }
                    } else {
                        response = {
                            email: data[0].email,
                            id_monitor: data[0].id_monitor,
                            nombre: data[0].m_nombre,
                            profile_image: data[0].profile_image
                        }
                    }
                    res.status(200).send(response);
                }
            });
        }
    });
});