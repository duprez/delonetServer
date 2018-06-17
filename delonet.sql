/**************************************************************************/
/*Este script SQL crea la base de datos delonet y todas sus tablas*/
/*************************************************************************/

/*Borramos, si existe, una base de datos anterior */
DROP DATABASE IF EXISTS delonet;

/*Creamos la base de datos llamada delonet */
CREATE DATABASE delonet
CHARACTER SET utf8
COLLATE utf8_spanish_ci;

use delonet;

/***********************/
/* TABLA: usuarios     */
/***********************/
CREATE TABLE delonet.usuarios (
 email VARCHAR(50) PRIMARY KEY,
 passwrd VARCHAR(300),
 is_admin TINYINT(1),
 profile_image LONGTEXT
) ENGINE=INNODB;


/***********************/
/* TABLA: clases       */
/***********************/
CREATE TABLE delonet.clases (
 id_clase INT(11) AUTO_INCREMENT PRIMARY KEY,
 nombre VARCHAR(40),
 num_plazas INT(2),
 edad_maxima INT(2),
 nivel VARCHAR(30),
 hora TIME,
 dias VARCHAR(40)
) ENGINE=INNODB;


/***********************/
/* TABLA: socios       */
/***********************/
CREATE TABLE delonet.socios (
 id_socio INT(11) AUTO_INCREMENT PRIMARY KEY,
 nombre VARCHAR(30),
 apellidos VARCHAR(30),
 direccion VARCHAR(50),
 fecha_alta DATE,
 fecha_baja DATE,
 telefono VARCHAR(15),
 id_clase INT(11),
 email VARCHAR(50),
 FOREIGN KEY (id_clase)
 REFERENCES clases(id_clase)
 ON DELETE CASCADE ON UPDATE CASCADE,
 FOREIGN KEY (email)
 REFERENCES usuarios(email)
 ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=INNODB;


/***********************/
/* TABLA: monitores    */
/***********************/
CREATE TABLE delonet.monitores (
 id_monitor INT(11) AUTO_INCREMENT PRIMARY KEY,
 nombre VARCHAR(30),
 apellidos VARCHAR(30),
 direccion VARCHAR(50),
 telefono VARCHAR(15),
 email VARCHAR(50),
 FOREIGN KEY (email)
 REFERENCES usuarios(email)
 ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=INNODB;


/***********************/
/* TABLA: calles       */
/***********************/
CREATE TABLE delonet.calles (
 id_calle INT(11) AUTO_INCREMENT PRIMARY KEY,
 velocidad VARCHAR(30),
 complementos TINYINT(1)
) ENGINE=INNODB;


/***********************/
/* TABLA: complementos */
/***********************/
CREATE TABLE delonet.complementos (
 id_complemento INT(11) AUTO_INCREMENT PRIMARY KEY,
 nombre VARCHAR(40),
 existencias INT(3)
) ENGINE=INNODB;


/***********************/
/* TABLA: reservas     */
/***********************/
CREATE TABLE delonet.reservas (
 id_reserva INT(11) AUTO_INCREMENT PRIMARY KEY,
 id_socio INT(11),
 id_calle INT(11),
 id_clase INT(11),
 fecha DATETIME,
 FOREIGN KEY (id_socio)
 REFERENCES socios(id_socio)
 ON DELETE CASCADE ON UPDATE CASCADE,
 FOREIGN KEY (id_calle)
 REFERENCES calles(id_calle)
 ON DELETE CASCADE ON UPDATE CASCADE,
 FOREIGN KEY (id_clase)
 REFERENCES clases(id_clase)
 ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=INNODB;


/***********************/
/* TABLA: clasesMonitores */
/***********************/
CREATE TABLE delonet.clasesMonitores (
 id_monitor INT(11),
 id_clase INT(11),
 PRIMARY KEY (id_monitor, id_clase),
 FOREIGN KEY (id_monitor)
 REFERENCES monitores(id_monitor)
 ON DELETE CASCADE ON UPDATE CASCADE,
 FOREIGN KEY (id_clase)
 REFERENCES clases(id_clase)
 ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=INNODB;


/***********************/
/* TABLA: callesClases */
/***********************/
CREATE TABLE delonet.callesClases (
 id_calle INT(11),
 id_clase INT(11),
 PRIMARY KEY (id_calle, id_clase),
 FOREIGN KEY (id_calle)
 REFERENCES calles(id_calle)
 ON DELETE CASCADE ON UPDATE CASCADE,
 FOREIGN KEY (id_clase)
 REFERENCES clases(id_clase)
 ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=INNODB;


/***********************/
/* TABLA: complementosClases */
/***********************/
CREATE TABLE delonet.complementosClases (
 id_complemento INT(11),
 id_clase INT(11),
 cantidad INT(2),
 PRIMARY KEY (id_complemento, id_clase),
 FOREIGN KEY (id_complemento)
 REFERENCES complementos(id_complemento)
 ON DELETE CASCADE ON UPDATE CASCADE,
 FOREIGN KEY (id_clase)
 REFERENCES clases(id_clase)
 ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=INNODB;



/****************************************************************************************
Estas sentencias SQL insertan en las tablas de delonet un conjunto de datos de prueba
****************************************************************************************/
USE delonet;


/***********************/
/* TABLA: usuarios       */
/***********************/

INSERT INTO usuarios (email, passwrd, is_admin, profile_image)
VALUES ('adrian@delonet.com', '8e35c1e92ecf951d202414c75c3885ce', 1, ''),
('laura@delonet.com', '8e35c1e92ecf951d202414c75c3885ce', 1, ''),
('gabriel@delonet.com', '8e35c1e92ecf951d202414c75c3885ce', 1, ''),
('juan@gmail.com', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('antonio@gmail.com', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('alicia@gmail.com', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('fran@gmail.com', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('estefania@gmail.com', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('pepe@gmail.com', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('roberto@gmail.com', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('sofia@gmail.com', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('carla@gmail.com', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('roberta@gmail.com', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('alejandra@gmail.com', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('alex@gmail.com', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('alejandro@gmail.com', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('amin@gmail.com', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('carlos@delonet.com', '8e35c1e92ecf951d202414c75c3885ce', 1, ''),
('carla@delonet.com', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('alicia@delonet.com', '8e35c1e92ecf951d202414c75c3885ce', 1, ''),
('fran@delonet.com', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('estefania@delonet.com', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('pepe@delonet.com', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('roberto@delonet.com', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('roberta@delonet.com', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('alejandro@delonet.com', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('alex@delonet.com', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('alex@yahoo.com', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('gabriel@yahoo.es', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('juan@yahoo.es', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('antonio@yahoo.es', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('alicia@yahoo.es', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('fran@yahoo.es', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('estefania@yahoo.es', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('pepe@yahoo.es', '8e35c1e92ecf951d202414c75c3885ce', 0, ''),
('jose@gmail.com', '8e35c1e92ecf951d202414c75c3885ce', 0, '');


/***********************/
/* TABLA: clases       */
/***********************/

INSERT INTO clases (nombre, num_plazas, edad_maxima, nivel, hora, dias)
VALUES ('Aquagym', 10, null, 'Principiante', '20:00:00', 'Viernes'),
('Natación Infantil', 10, 10, 'Principiante', '16:00:00', 'Lunes, Miércoles'),
('Natación Infantil', 10, 10, 'Principiante', '17:00:00', 'Lunes, Miércoles'),
('Natación Infantil', 10, 10, 'Principiante', '18:00:00', 'Lunes, Miércoles'),
('Natación Iniciación', 10, null, 'Principiante', '18:00:00', 'Martes, Jueves'),
('Natación Iniciación', 10, null, 'Principiante', '19:00:00', 'Martes, Jueves'),
('Natación Iniciación', 10, null, 'Principiante', '20:00:00', 'Martes, Jueves'),
('Natación Avanzada', 10, null, 'Avanzado', '18:00:00', 'Lunes, Miércoles'),
('Natación Avanzada', 10, null, 'Avanzado', '15:00:00', 'Lunes, Miércoles'),
('Natación Avanzada', 10, null, 'Avanzado', '19:00:00', 'Lunes, Miércoles'),
('Espalda', 8, null, 'Intermedio', '17:00:00', 'Martes, Jueves'),
('Espalda', 8, null, 'Intermedio', '19:00:00', 'Martes, Jueves'),
('Espalda', 8, null, 'Intermedio', '16:00:00', 'Martes, Jueves'),
('Espalda', 5, null, 'Intermedio', '18:00:00', 'Martes, Jueves'),
('Aquagym', 10, null, 'Principiante', '15:00:00', 'Viernes'),
('Aquagym', 10, null, 'Principiante', '19:00:00', 'Viernes'),
('Aquagym', 5, null, 'Principiante', '20:00:00', 'Viernes');


/***********************/
/* TABLA: socios       */
/***********************/

INSERT INTO socios (nombre, apellidos, direccion, fecha_alta, fecha_baja, telefono, id_clase, email)
VALUES ('Juan', 'Martin', 'C/ Laujar de Andarax 37, Vicar', '2018/06/02', '2018/07/02', '666112233', 7, 'juan@gmail.com'),
('Antonio', 'Duprez', 'C/ Costa Blanca 11, Aguadulce', '2018/06/15', '2018/07/15', '666445566', 5, 'antonio@gmail.com'),
('Alicia', 'Rodriguez', 'C/ Blanca 6, Aguadulce', '2018/06/28', '2018/07/28', '612345678', 2, 'alicia@gmail.com'),
('Fran', 'Ruiz', 'C/ Verde 12, Almeria', '2018/06/25', '2018/07/25', '601234567', 7, 'fran@gmail.com'),
('Estefanía', 'Padilla', 'C/ Rojo 43, Vicar', '2018/06/11', '2018/07/11', '656789812', 5, 'estefania@gmail.com'),
('Jose', 'Díaz', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'jose@gmail.com'),
('Pepe', 'Baeza', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111',  NULL, 'pepe@gmail.com'),
('Roberto', 'Galdeano', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'roberto@gmail.com'),
('Sofia', 'Díaz', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'sofia@gmail.com'),
('Carla', 'Gomez', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'carla@gmail.com'),
('Roberta', 'Duprez', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'roberta@gmail.com'),
('Alejandra', 'Hernandez', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'alejandra@gmail.com'),
('Alex', 'Galdeano', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'alex@gmail.com'),
('Alejandro', 'Duprez', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'alejandro@gmail.com'),
('Amin', 'Kirikout', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'amin@gmail.com'),
('Carla', 'Carmona', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'carla@delonet.com'),
('Fran', 'Escobar', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'fran@delonet.com'),
('Estefania', 'Montoya', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'estefania@delonet.com'),
('Pepe', 'Escobar', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'pepe@delonet.com'),
('Roberto', 'Martín', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'roberto@delonet.com'),
('Roberta', 'Hernandez', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'roberta@delonet.com'),
('Alejandro', 'Ibañez', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'alejandro@delonet.com'),
('Alex', 'Carmona', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'alex@delonet.com'),
('Alex', 'Duprez', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'alex@yahoo.com'),
('Gabriel', 'Hernandez', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'gabriel@yahoo.es'),
('Juan', 'Galdeano', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'juan@yahoo.es'),
('Antonio', 'Gomez', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'antonio@yahoo.es'),
('Alicia', 'Gilabert', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'alicia@yahoo.es'),
('Fran', 'Gomez', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'fran@yahoo.es'),
('Estefania', 'Sevilla', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'estefania@yahoo.es'),
('Pepe', 'Díaz', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'pepe@yahoo.es'),
('Jose', 'Fernandez', 'C/ Amarilla 15, El Ejido', '2018/06/06', '2018/07/06', '654267111', NULL, 'jose@gmail.com');


/***********************/
/* TABLA: monitores    */
/***********************/

INSERT INTO monitores (nombre, apellidos, direccion, telefono, email)
VALUES ('Adrián', 'Roda', 'C/ Ancha 12, Vícar', '612345122', 'adrian@delonet.com'),
('Laura', 'Alcántara', 'C/ Estrecha 27, Vícar', '678568765', 'laura@delonet.com'),
('Gabriel', 'Manzano', 'C/ Intermedia 7, Vícar', '609675493', 'gabriel@delonet.com'),
('Carlos', 'Gomez', 'C/ Amarilla 15, El Ejido', '654267111', 'carlos@delonet.com'),
('Alicia', 'Martín', 'C/ Amarilla 15, El Ejido', '654267111', 'alicia@delonet.com');


/***********************/
/* TABLA: calles       */
/***********************/

INSERT INTO calles (velocidad, complementos)
VALUES ('Lenta', 1),
('Rápida', 1),
('Lenta', 0),
('Rápida', 0),
('Rápida', 1),
('Lenta', 0);


/***********************/
/* TABLA: complementos */
/***********************/

INSERT INTO complementos (nombre, existencias)
VALUES ('Pullboy', 10),
('Aletas pies', 6),
('Aletas manos', 6),
('Churro', 20),
('Pelota', 15),
('Tabla', 20),
('Anilla', 20);


/***********************/
/* TABLA: reservas     */
/***********************/

INSERT INTO reservas (id_socio, id_calle, id_clase, fecha)
VALUES (1, 4, null, '2018-06-03T16:00:00.000Z'),
(1, 4, null, '2018-06-03T18:00:00.000Z'),
(null, 1, 7, '2018-06-03T17:00:00.000Z'),
(null, 2, 7, '2018-06-03T19:00:00.000Z');


/***********************/
/* TABLA: clasesMonitores */
/***********************/

INSERT INTO clasesMonitores (id_monitor, id_clase)
VALUES (1, 1),
(2, 2),
(2, 3),
(3, 4),
(3, 5),
(3, 6),
(1, 7),
(2, 8),
(4, 9),
(5, 10),
(3, 11),
(2, 12),
(1, 13),
(2, 14),
(3, 15),
(4, 16),
(5, 17);


/***********************/
/* TABLA: callesClases */
/***********************/

INSERT INTO callesClases (id_calle, id_clase)
VALUES (5, 1),
(6, 1),
(1, 2),
(2, 2),
(5, 5),
(6, 5),
(1, 7),
(2, 7);


/***********************/
/* TABLA: complementosClases */
/***********************/

INSERT INTO complementosClases (id_complemento, id_clase, cantidad)
VALUES (1, 7, 2),
(7, 2, 1),
(5, 2, 1),
(5, 1, 1),
(4, 1, 1);