const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago");
const app = express();

app.use(express.json());
app.use(cors());

// Configura tu Access Token privado
mercadopago.configure({
  access_token: "APP_USR-7110963948036985-030207-944c1b4fded96aa6af15d583a9983e50-3234524541"
});

app.post("/create_preference", async (req, res) => {
  try {
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
    // Devolvemos el ID de preferencia generado
    res.json({ id: response.body.id });
  } catch (error) {
    console.error("Error en Mercado Pago:", error);
    res.status(500).json({ error: "Error al crear la preferencia" });
  }
});

// CORRECCIÓN: Puerto dinámico para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de pagos activo en puerto ${PORT}`);
});