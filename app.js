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
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                "default-src": ["'self'"],
                "connect-src": ["'self'"],
                "upgrade-insecure-requests": [],
            },
        },
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