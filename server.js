import app from "./app.js";

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(` Servidor de la API corriendo con éxito en http://localhost:${port}`);
});