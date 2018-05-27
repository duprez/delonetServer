## <img src="./deloPNGblue.png">

<br/>
Esta es la parte que incluye todos los datos del servidor del proyecto delonet.
<br/><br/>
Para poder utilizarlo deberás usar:
<ol>
    <li> Hacer npm i en el paquete principal. </li>
    <li> Usar Wampp/Mampp/Lampp. </li>
    <li> Si tú entorno de trabajo es un Mac, deberás hacer algunos cambios documentados más abajo. </li>
</ol>

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
