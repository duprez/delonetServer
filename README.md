## <img src="./deloPNGblue.png">

<br/>
Esta es la parte que incluye todos los datos del servidor del proyecto delonet.
<br/><br/>
Para poder utilizarlo deberás instalar todos los paquetes usados para ello ejecutaremos el siguiente comando en la raíz del proyecto:<br> 

<br><pre>npm install</pre>

Una vez acabado este paso, deberemos instalar <a href="https://www.apachefriends.org/es/index.html">Xampp</a> o sus derivados (Mampp/Lampp). Recuerda iniciar MySQL y PhpMyAdmin.

Luego descarga nuestro archivo sql, e importalo a phpmyadmin.

Por último solo deberás ejecutar el comando

<pre>npm run dev</pre>

#### OR

<pre>npm start</pre>

Nota: Si tu entorno de trabajo es un Mac, deberás hacer algunos cambios documentados más abajo.

## Mac
Por defecto, MAMP utiliza el puerto 8888, pero la conexión a la base de datos SQL se realiza utilizando el puerto 3306
salvo que se le indique lo contrario. Por tanto, es necesario especificar explícitamente que queremos utilizar el puerto
8888 o cambiar el puerto de MAMP en su propia configuración para que utilice el 3306.

Además, la cuenta root del gestor de la base de datos utiliza 'root' como contraseña a diferencia de WAMP en Windows, que
es un string vacío.

También es necesario indicar en la conexión el socket de MySQL dentro de la carpeta MAMP.

Para especificar explícitamente el puerto de la conexión a la base de datos SQL y cambiar la contraseña de root:

Dentro de la carpeta configs, abre el archivo database.js.

Añade una nueva línea a la constante 'data' especificando el puerto y cambia la contraseña en password, utilizando 'root':

<pre><code>const data = {
    "host": "localhost",
    "port": 8888,
    "user": "root",
    "password": "root",
    "database": "delonet"
}
</code></pre>

Finalmente, abre el archivo server.js del directorio raíz del proyecto y añade el puerto a la conexión y el socket:

<pre><code>var connection = mysql.createConnection({
    host: databaseConf['host'],
    port: databaseConf['port'],
    user: databaseConf['user'],
    password: databaseConf['password'],
    database: databaseConf['database'],
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});
</code></pre>


## Contributors
Este proyecto ha sido realizado por Juan Manuel Martín Escobar y Antonio Duprez Hernández. <br>
Proyecto de fin de curso de 2º de DAW.

<img src="./bruni.jpeg" width="250px"> <img src="./gordito.jpeg" width="250px">

