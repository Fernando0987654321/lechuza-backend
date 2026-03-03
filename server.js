const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago");
const app = express();

// CONFIGURACIÓN DE CORS
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST"]
}));

// SOLUCIÓN AL ERROR 413: Aumentar el límite de recepción de datos
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configura tu Access Token privado
mercadopago.configure({
  access_token: "APP_USR-7110963948036985-030207-944c1b4fded96aa6af15d583a9983e50-3234524541"
});

app.post("/create_preference", async (req, res) => {
  try {
    // Verificación de datos en la consola de Render
    console.log("Recibiendo items:", req.body.items);

    let preference = {
      items: req.body.items.map(item => ({
        title: item.titulo,
        unit_price: Number(item.precio),
        quantity: Number(item.cantidad),
        currency_id: "MXN"
      })),
      back_urls: {
        success: "https://la-lechuza-lectora.web.app/html/Logeado/pago_exitoso.html",
        failure: "https://la-lechuza-lectora.web.app/html/Logeado/carrito.html"
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id }); //
  } catch (error) {
    console.error("Error en Mercado Pago:", error);
    res.status(500).json({ error: "Error al crear la preferencia" });
  }
});

// Puerto dinámico para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de pagos activo en puerto ${PORT}`);
});