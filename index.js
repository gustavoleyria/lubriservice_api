// Importar conexion a BD
const connection = require("./database/connection");

// Importar dependencias
require('dotenv').config();
const express = require("express");
const cors = require("cors");

// Mensaje de bienvenida
console.log("API REST con Node para app lubriservice arrancada!!!")

//Ejecutar conexion a la BD
connection();

//Crear servicio de Node
const app = express();
const port = process.env.PORT || 3003; // Utiliza el puerto definido en .env o el puerto 3000 como valor predeterminado

//Configurar Cors
app.use(cors());

//Covertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Cargar configuracion de rutas
const UserRoutes = require("./routes/users");
const CarRoutes = require("./routes/cars");
const TrabajadorRoutes = require("./routes/trabajadores");
const TrabajoRoutes = require("./routes/trabajos");
const TicketGarageRoutes = require("./routes/ticketGarages");
const FacturaRoutes = require("./routes/facturas");
const PromocionaRoutes = require("./routes/promociones");

app.use("/api/user", UserRoutes);
app.use("/api/car", CarRoutes);
app.use("/api/trabajador", TrabajadorRoutes);
app.use("/api/trabajo", TrabajoRoutes);
app.use("/api/ticketGarage", TicketGarageRoutes);
app.use("/api/factura", FacturaRoutes);
app.use("/api/promocion", PromocionaRoutes);


//Ruta de prueba
app.get("/ruta-prueba", (req,res)=>{
    return res.status(200).send({
        status:"success",
        message:"Ruta de prueba lubriservice exitosa"
    })
})

//Poner al servidor a escuchar peticiones https
app.listen(port, ()=>{
    console.log("Escuchando en el puerto ",port);
})
