# PRACTICA INTEGRADORA

A través de esta práctica integradora, se realiza la integración de express, router, handlebars, mongoDB Atlas y mongoose.
Se crea un carpeta llamada **dao** donde se colocaran los manager de products y carts con persistencia en archivo mediante File System; así mismo dentro de esta carpeta se coloca el archivo de conexión a la base de datos MongoDB Atlas llamado **db.js** y una carpeta llamada **models** donde se colocaran los archivos de esquemas de mongoose, para los manejadores de products, carts y messages.

## HANDLEBARS (MOTOR DE PLANTILLAS)

Mediante el uso de handlebars como motor de plantillas, para crear una página estática para un chat, donde la comunicación se realiza a través de websockets, donde se crea un formulario para recibir los datos del nombre de usuario que es el correo electrónico del usuario mediente un form input, y el texto del mensaje a través de un texarea. Se realiza un submit de estos datos usando un botón que dispara el evento submit; el formulación a su vez ejecuta el evento onsubmit que ejecuta la función correspondiente para dar formato al mensaje, mediante el objeto messaging como **{user: recibe el valor del input box username, message: recobe el valor del textarea usermessage}**.

Para essto se crea una carpeta de vistas llamada **views**, en la ruta raíz, donde se alberga el archivo **main.handlebars.js** en la carpeta de **layout**; por otro lado en la crapeta de views, se crea el archivo **chat.handlebars.js**, donde realiza el diseño del formulario.

## WEBSOCKETS

Se usará la aplicación de sockets.io para realizar la comunicación a través de http 8080. Del lado del servidor se crea un router que contendrá en endpoint GET, llamado **chat.router.js** como función que recibirá desde el index.js del servidor, ubicado en la ruta raíz, la constante **io** que recibe **socket.io**. 

En el endpoint, se realiza la recepción del mensaje enviado por el cliente medinate el evento **chatMessage**, este mensage se almacena en un array llamado **allMessages**, donde se realuzará el push de los mensajes envien los clientes; posteriormente se emitirá a los clientes, mediante el evento **allMessages**, para mostrar el seguimiento de los mensajes. Una vez cerrada la conexión por parte de cliente mediante el botón de **Finalizr chat** que dispara la función **socket.disconnect()** del lado del cliente, se almacenarán los mensajes en el mongoDB Atlas, en una colleción llamada messages.

Por el lado del cliente, socket.io, se instala mediante el uso del script **<script src="/socket.io/socket.io.js"></script>**, colocado en el archivo de chat.handlebars.js; por otro lado se usa el archivo **chat.js** para realizar la lógica de programación, para instanciar socket.io mediante la constante **socket**,  recibir los datos del formulario, formateo y creación del objeto de messaging, y emisión hacia el servidor mediante el evento **chatMessage** enviando el objeto messaging. También se realiza la función para recibir el evento **allMessages** enviado por el servidor con el arreglo de los mensajes a cumulados, y relizar el render de la vista de los mensajes; y la función para deconexión del cliente y poder enviar los mensajes acumulados a la base de datos mongoDB Atlas en la colección messages.

## ROUTER

Mediante el uso de Routers de express, se crean los endopint para products y carts. 

1. Para el caso de los products en el index.js se crea un middleware para usar el router, archivo **product.router.js** de productos con la ruta **/api/products/**, y crean los siguientes endpoints:

- GET de todos los productos con la ruta **/**, que realiza la busqueda en la base de datos de mongoDB Atlas, y devuelve todos los productos existentes.
- GET de producto por el ID, en la ruta **/:pid**, donde pid es el ID de productos generado por mongoDB Atlas. 
- POST que crea un producto nuevo, en la ruta **/newproduct**, y este a su vez realiza la creación de un nuevo documentos en la base de datos Atlas, enviando un objeto, en el body en JSON, de la forma:

 {
    "code": String,
    "title": String,
    "description": String,
    "thumbnails": [Arreglo con los links de la imagen o imangenes],
    "price": Number,
    "stock": Number,
    "status": Boolean,
    "category": String
  }

- POST que realiza la actualización de un producto, en la ruta **/:pid**, donde pid es el parámetro del ID del producto que se quiere actualizar. El ID del producto, es el id generado por MongoDB Atlas al momento de realizar la creación del documento. SE objeto de forma anterior con la actualización de los datos requeridos.
- DELETE, con la ruta **/:pid** que realiza la eliminación de un producto en la base de datos mongoDB Atlas

2. Para el caso de carts, en el index.js se crea un middleware para usar el router **cart.router.js**, con la ruta **/api/carts**, donde se crean los siguientes endpoints:

- GET con la ruta **/:cid** donde cid es el params que se recibe con el ID de cart que se generó en la base de datos Atlas cuando se creao un cart nuevo, esto para obtener un cart por su ID.
- POST para crear un carrito nuevo, con la ruta **/newcart**, el cart se crea con el arrego de productos vacio, quedando de la forma:

{
    products: []
}

Cuando se crea el documento en la base datos Atla, se genera un ID del cart automáticamente.

- POST en la ruta **/:cid/product/:pid**, que agregará un producto nuevo que no este en el cart, o actualizar el producto si ya sencuentra en el cart. Los params, cid representa el ID del cart y pid es el ID del producto. Por lo que en el body en JSON se recibira un objeto:

{
    qty: Number
}

Donde qty es la cantidad de items del mismo producto. el ID del producto es el que genero en mongoDB Atlas cuando se registro el producto.

Si el pid no exite, se agregará al cart el producto junto con su cantidad en la forma  objeto {_id: pid. qty: qty}; si el producto ya existe solo se modificará la cantidad.

- POST para borrar un producto del cart, en la ruta **/:cid/delproduct/:pid**. Mediante este endpint se elimará un producto del documento de cart de la colección carts de Atlas.
- DELETE para borrar un cart de la colección carts, en la ruta **/delcart/:cid**, el endpoint eliminará el documento cart de la colección carts.

## MONGOOSE

Se empleará Mongoose como para el modelado de los datos, para esto primero se realiza conexión a la base da datos en el archivo **db.js** ubicado en la ruta **/dao**.

Se crearan los esquemas para el modelado de los datos de carts, products y messages, elaborando los archivos **modelCart.js, modelProduct.js y modelMessage.js**, respectivamente. 

- El esquema del prductos del carts se crea con el siguiente formato de datos, con el nombre de cartProductSchema:

{
    _id: {
        type: String
    },
    qty: {
        type: Number
    }
}

asi mismo este esquema se lleva al esquema de carts de la siguiente forma:

{
    products: [cartProductSchema]
}

- El esquema de productos se define de la siguiente forma:

{
    code: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnails: {
        type: Array,
        default: [],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    category: {
        type: String,
        required: true
    }
}

- Y el esquema de mensajes primero se define el mensaje se colocará dentro del arreglo de mensajes, son el nombre de messageTypeSchema:

{
    user: {
        type: String
    },
    message: {
        type: String
    }
}

Y en el esquema del arreglo de mensajes se define de la siguiente manera:

{
    messages: [messageTypeSchema]
}

#FIN

