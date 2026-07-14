/**
 * @file app.js
 * @description Configuración centralizada de la API REST Pura para SAIC-CORE-API.
 * @author Manuel Andrés Acosta Aguilera
 */
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// ==========================================
// 1. IMPORTACIÓN DE RUTAS MODULARES
// ==========================================
import dashboardRoutes from "./routes/dashboardRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import servicePlatformRoutes from "./routes/servicePlatformRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import logisticsRoutes from "./routes/logisticsRoutes.js";
import ministryRoutes from "./routes/ministryRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import finaceRoutes from "./routes/finaceRoutes.js";

// ==========================================
// 2. IMPORTACIÓN DE MIDDLEWARES CENTRALIZADOS
// ==========================================
import { isAuthenticated } from "./middlewares/validate-modules/auth.js";
import { isRole } from "./middlewares/validate-modules/isRole.js"; 
import error from "./middlewares/error.js";

const app = express();

// ==========================================
// 3. MIDDLEWARES GLOBALES DE CONFIGURACIÓN
// ==========================================

// Lista de orígenes autorizados
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'https://saic-frontend.vercel.app',
];

app.use(cors({
    origin: function (origin, callback) {
        // Permitir peticiones sin origen (Postman, mobile, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app') || origin.endsWith('.ngrok-free.app')) {
            return callback(null, true);
        } else {
            return callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    // 🔴 AQUÍ AGREGAMOS 'ngrok-skip-browser-warning' A LOS HEADERS PERMITIDOS
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'ngrok-skip-browser-warning']
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helmet configurado para API REST sin bloquear cross-origin
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        contentSecurityPolicy: false // Desactivado para evitar interferir con peticiones de dominios externos como Vercel
    })
);

// ==========================================
// 4. RUTA RAÍZ DE BIENVENIDA Y VERIFICACIÓN
// ==========================================
app.get("/", (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "Bienvenido al núcleo de servicios web: SAIC-CORE-API",
        version: "1.0.0",
        author: "Manuel Andrés Acosta Aguilera"
    });
});

// ==========================================
// 5. INYECCIÓN DE ENDPOINTS CON ROLES DEL SISTEMA
// ==========================================

// Ruta Pública
app.use("/api/auth", authRoutes);

// Rutas Privadas con Control de Acceso Basado en Roles (RBAC) Exacto
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", isAuthenticated, profileRoutes);
app.use("/api/users", isAuthenticated, isRole('admin'), userRoutes);
app.use("/api/members", isAuthenticated, isRole('admin', 'tesorero', 'lider'), memberRoutes);
app.use("/api/service", isAuthenticated, servicePlatformRoutes);
app.use("/api/logistic", isAuthenticated, isRole('admin', 'lider', 'miembro'), logisticsRoutes);
app.use("/api/ministries", isAuthenticated, isRole('admin', 'lider'), ministryRoutes);
app.use("/api/finance", isAuthenticated, isRole('admin', 'tesorero'), finaceRoutes);
app.use("/api/report", isAuthenticated, isRole('admin', 'tesorero', 'lider'), reportRoutes);

// ==========================================
// 6. MANEJO GLOBAL DE ENDPOINTS INEXISTENTES (404)
// ==========================================
app.use(error.error404);

// ==========================================
// 7. INTERCEPTOR CENTRALIZADO DE EXCEPCIONES (500)
// ==========================================
app.use((err, req, res, next) => {
    error.error500(req, res, err);
});

export default app;