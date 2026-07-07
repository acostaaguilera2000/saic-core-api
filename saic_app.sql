-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-06-2026 a las 08:06:08
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `saic_app`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comunicado`
--

CREATE TABLE `comunicado` (
  `id_comunicado` int(11) NOT NULL,
  `asunto` varchar(100) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_envio` date NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `culto`
--

CREATE TABLE `culto` (
  `id_culto` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time DEFAULT NULL,
  `tipo_culto` varchar(100) DEFAULT NULL,
  `id_dirigente` int(11) DEFAULT NULL,
  `dirigente_externo` varchar(100) DEFAULT NULL,
  `id_predicador` int(11) DEFAULT NULL,
  `predicador_externo` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `culto`
--

INSERT INTO `culto` (`id_culto`, `fecha`, `hora`, `tipo_culto`, `id_dirigente`, `dirigente_externo`, `id_predicador`, `predicador_externo`) VALUES
(12, '2026-06-01', '19:00:00', 'Escuela Bíblica Dominical', NULL, 'Juan pedro', 3, NULL),
(13, '2026-06-07', '19:00:00', 'Culto de Oración', NULL, 'Servio rodriguez', NULL, 'Juan Mendez'),
(14, '2026-07-01', '07:00:00', 'Culto General', 1, NULL, NULL, 'Juan Méndez'),
(17, '2026-06-06', '19:00:00', 'Culto de Jóvenes', 1, NULL, NULL, 'Servio Rodriguez'),
(18, '2026-06-08', '19:00:00', 'Culto de Oración', 4, NULL, 9, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `donaciones`
--

CREATE TABLE `donaciones` (
  `id_donacion` int(11) NOT NULL,
  `monto` decimal(12,2) NOT NULL,
  `fecha_registro` date NOT NULL,
  `tipo_pago` enum('Efectivo','Transferencia','Consignación','Cheque') NOT NULL,
  `categoria_ingreso` enum('Ofrenda General','Diezmo','Donación Especial','Pro-Templo') NOT NULL,
  `observacion` text DEFAULT NULL,
  `id_miembro` int(11) DEFAULT NULL,
  `id_externo` int(11) DEFAULT NULL,
  `estado` enum('Anulada','Asentada') DEFAULT 'Asentada'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `donaciones`
--

INSERT INTO `donaciones` (`id_donacion`, `monto`, `fecha_registro`, `tipo_pago`, `categoria_ingreso`, `observacion`, `id_miembro`, `id_externo`, `estado`) VALUES
(3, 500000.00, '2026-06-07', 'Transferencia', 'Donación Especial', 'Dijo que el señor lo bendijo y el prometio dar esta ofrenda ', NULL, 1, 'Asentada'),
(4, 20000.00, '2026-06-07', 'Efectivo', 'Ofrenda General', 'en culto', 3, NULL, 'Asentada'),
(5, 100000.00, '2026-06-07', 'Efectivo', 'Ofrenda General', NULL, 4, NULL, 'Asentada'),
(6, 500000.00, '2026-06-07', 'Efectivo', 'Ofrenda General', NULL, 10, NULL, 'Asentada'),
(7, 20000.00, '2026-06-07', 'Efectivo', 'Ofrenda General', NULL, 9, NULL, 'Asentada'),
(8, 20000.00, '2026-06-07', 'Efectivo', 'Pro-Templo', NULL, 2, NULL, 'Asentada');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `donantes_externos`
--

CREATE TABLE `donantes_externos` (
  `id_externo` int(11) NOT NULL,
  `nombre_completo` varchar(150) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `donantes_externos`
--

INSERT INTO `donantes_externos` (`id_externo`, `nombre_completo`, `telefono`, `correo`, `fecha_creacion`) VALUES
(1, 'Juan perez', '3235467890', NULL, '2026-06-07 00:35:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evento`
--

CREATE TABLE `evento` (
  `id_evento` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `fecha` date NOT NULL,
  `lugar` varchar(100) DEFAULT NULL,
  `responsable` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logistica_culto`
--

CREATE TABLE `logistica_culto` (
  `id_logistica` int(11) NOT NULL,
  `id_culto` int(11) NOT NULL,
  `id_sonido` int(11) DEFAULT NULL,
  `id_multimedia` int(11) DEFAULT NULL,
  `id_aseo` int(11) DEFAULT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `logistica_culto`
--

INSERT INTO `logistica_culto` (`id_logistica`, `id_culto`, `id_sonido`, `id_multimedia`, `id_aseo`, `observaciones`) VALUES
(2, 13, NULL, NULL, 2, '#1 Todos debemos apoyar en el aseo\r\n#2 Debemos llegar temprano'),
(3, 12, NULL, NULL, 4, NULL),
(4, 14, 4, 7, 2, 'todos llegamos tempranos para colaborar en el aseo a las 7:00 pm'),
(5, 17, 4, 2, 7, 'Ezequiel ayuda en el aseo'),
(6, 18, NULL, NULL, 10, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `miembro`
--

CREATE TABLE `miembro` (
  `id_miembro` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `documento` varchar(20) NOT NULL,
  `fecha_registro` date NOT NULL,
  `fecha_bautismo` date DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `miembro`
--

INSERT INTO `miembro` (`id_miembro`, `nombre`, `apellido`, `documento`, `fecha_registro`, `fecha_bautismo`, `activo`) VALUES
(1, 'Katyuska Karelys', 'Mendez Mercado', '23451890', '2026-04-13', '2021-04-15', 1),
(2, 'Manuel Andrés', 'Acosta Aguilera', '1002487577', '2023-05-26', '2019-04-26', 1),
(3, 'Ana ', 'Mercado', '1002487573', '2026-02-22', NULL, 1),
(4, 'Andrés Alfonso', 'Trujillo Rodriguez', '12345678', '2026-05-25', '2006-05-25', 1),
(5, 'Nazaret', 'Rodríguez Moreno', '01002002', '2026-05-26', '2003-05-26', 1),
(6, 'Betzabet', 'Acosta', '12356487', '2026-05-29', '2002-11-23', 1),
(7, 'Alfondo farid', 'Trujillo', '02346178', '2026-05-30', NULL, 1),
(9, 'Melquisedec', 'Rodríguez Moreno', '102934758', '2026-06-05', '2016-06-14', 1),
(10, 'Elizabet', 'Trujilo Rodriguez', '001123456', '2024-06-06', '2007-03-12', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `miembro_ministerio`
--

CREATE TABLE `miembro_ministerio` (
  `id_miembro` int(11) NOT NULL,
  `id_ministerio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `miembro_ministerio`
--

INSERT INTO `miembro_ministerio` (`id_miembro`, `id_ministerio`) VALUES
(2, 1),
(3, 2),
(6, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ministerio`
--

CREATE TABLE `ministerio` (
  `id_ministerio` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ministerio`
--

INSERT INTO `ministerio` (`id_ministerio`, `nombre`, `descripcion`) VALUES
(1, 'Ministerio de alabanza', 'Auqui van todos los participantes del grupo'),
(2, 'Ministerio de oracion', 'Aqui va el grupo encargado de la oracion y fortaleza del templo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `rol` enum('admin','tesorero','lider','miembro') NOT NULL,
  `username` varchar(100) NOT NULL,
  `id_miembro` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `email`, `password`, `rol`, `username`, `id_miembro`) VALUES
(1, 'root@gmail.com', '$2b$10$AKz10saKaNgg4W49UhosZuyg/BuPiAs.gzoXwpf.1LKQ.4F6a.k76', 'admin', 'root', NULL),
(2, 'acostaaguilera2000@gmail.com', '$2b$10$1M6.4io6JT/P.7QcLsgcFeT6OZ8P2p2UI4g.xKS04OhCC.BesWav6', 'admin', 'Madrew', 2),
(6, 'melromo95@gmail.com', '$2b$10$9yJJ9ZURqYnFwZYL2clGBO75vn4dq/hIo4J3lmnv4LumdnJYWhtBu', 'admin', 'MelRomo', 9),
(13, 'andrestrujillo@gmail.com', '$2b$10$GFjwDdfAuEy..9Bsy0CkkOhNVf1oMrtKWqXiH7PG4eoMYtCBH5eCK', 'miembro', 'Andres Trujillo', 4),
(15, 'katy@gmail.com', '$2b$10$dbo3PvGaKtow7SijNgP.3ejEHNDz1DBUTdck5bTTSTqzyAvBYfbTO', 'lider', 'katiuska', 1),
(19, 'alfonsofarid@gmail.com', '$2b$10$hn5oOqdMQmGcPSq35HjQk.g8J3FUX/gR38TcNvcG8ANBgUI23bnZW', 'miembro', 'Chofa', 7),
(20, 'ange@gmail.com', '$2b$10$w7CtT0dhKNltzwN8nsgqzuXOZ5D9LGSJ0RlbM5gBfTCgDNtYOWJ7C', 'miembro', 'Angelica', NULL),
(21, 'juan@gmail.com', '$2b$10$cGiOG/DWeHlzQqhwCv9XpOqnXmfdCa3PpP3zkfwsiPqodJvFuBdwW', 'lider', 'Juan', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comunicado`
--
ALTER TABLE `comunicado`
  ADD PRIMARY KEY (`id_comunicado`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `culto`
--
ALTER TABLE `culto`
  ADD PRIMARY KEY (`id_culto`),
  ADD KEY `id_dirigente` (`id_dirigente`),
  ADD KEY `id_predicador` (`id_predicador`);

--
-- Indices de la tabla `donaciones`
--
ALTER TABLE `donaciones`
  ADD PRIMARY KEY (`id_donacion`),
  ADD KEY `id_miembro` (`id_miembro`),
  ADD KEY `id_externo` (`id_externo`);

--
-- Indices de la tabla `donantes_externos`
--
ALTER TABLE `donantes_externos`
  ADD PRIMARY KEY (`id_externo`);

--
-- Indices de la tabla `evento`
--
ALTER TABLE `evento`
  ADD PRIMARY KEY (`id_evento`);

--
-- Indices de la tabla `logistica_culto`
--
ALTER TABLE `logistica_culto`
  ADD PRIMARY KEY (`id_logistica`),
  ADD UNIQUE KEY `id_culto` (`id_culto`),
  ADD KEY `fk_logistica_sonido` (`id_sonido`),
  ADD KEY `fk_logistica_multimedia` (`id_multimedia`),
  ADD KEY `fk_logistica_aseo` (`id_aseo`);

--
-- Indices de la tabla `miembro`
--
ALTER TABLE `miembro`
  ADD PRIMARY KEY (`id_miembro`),
  ADD UNIQUE KEY `documento` (`documento`);

--
-- Indices de la tabla `miembro_ministerio`
--
ALTER TABLE `miembro_ministerio`
  ADD PRIMARY KEY (`id_miembro`,`id_ministerio`),
  ADD KEY `id_ministerio` (`id_ministerio`);

--
-- Indices de la tabla `ministerio`
--
ALTER TABLE `ministerio`
  ADD PRIMARY KEY (`id_ministerio`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `id_miembro` (`id_miembro`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comunicado`
--
ALTER TABLE `comunicado`
  MODIFY `id_comunicado` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `culto`
--
ALTER TABLE `culto`
  MODIFY `id_culto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `donaciones`
--
ALTER TABLE `donaciones`
  MODIFY `id_donacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `donantes_externos`
--
ALTER TABLE `donantes_externos`
  MODIFY `id_externo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `evento`
--
ALTER TABLE `evento`
  MODIFY `id_evento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `logistica_culto`
--
ALTER TABLE `logistica_culto`
  MODIFY `id_logistica` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `miembro`
--
ALTER TABLE `miembro`
  MODIFY `id_miembro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `ministerio`
--
ALTER TABLE `ministerio`
  MODIFY `id_ministerio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comunicado`
--
ALTER TABLE `comunicado`
  ADD CONSTRAINT `comunicado_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `culto`
--
ALTER TABLE `culto`
  ADD CONSTRAINT `culto_ibfk_1` FOREIGN KEY (`id_dirigente`) REFERENCES `miembro` (`id_miembro`),
  ADD CONSTRAINT `culto_ibfk_2` FOREIGN KEY (`id_predicador`) REFERENCES `miembro` (`id_miembro`);

--
-- Filtros para la tabla `donaciones`
--
ALTER TABLE `donaciones`
  ADD CONSTRAINT `donaciones_ibfk_1` FOREIGN KEY (`id_miembro`) REFERENCES `miembro` (`id_miembro`) ON DELETE SET NULL,
  ADD CONSTRAINT `donaciones_ibfk_2` FOREIGN KEY (`id_externo`) REFERENCES `donantes_externos` (`id_externo`) ON DELETE SET NULL;

--
-- Filtros para la tabla `logistica_culto`
--
ALTER TABLE `logistica_culto`
  ADD CONSTRAINT `fk_logistica_aseo` FOREIGN KEY (`id_aseo`) REFERENCES `miembro` (`id_miembro`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_logistica_culto` FOREIGN KEY (`id_culto`) REFERENCES `culto` (`id_culto`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_logistica_multimedia` FOREIGN KEY (`id_multimedia`) REFERENCES `miembro` (`id_miembro`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_logistica_sonido` FOREIGN KEY (`id_sonido`) REFERENCES `miembro` (`id_miembro`) ON DELETE SET NULL;

--
-- Filtros para la tabla `miembro_ministerio`
--
ALTER TABLE `miembro_ministerio`
  ADD CONSTRAINT `miembro_ministerio_ibfk_1` FOREIGN KEY (`id_miembro`) REFERENCES `miembro` (`id_miembro`),
  ADD CONSTRAINT `miembro_ministerio_ibfk_2` FOREIGN KEY (`id_ministerio`) REFERENCES `ministerio` (`id_ministerio`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_miembro`) REFERENCES `miembro` (`id_miembro`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
