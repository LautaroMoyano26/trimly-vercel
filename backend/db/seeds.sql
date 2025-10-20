-- Script de seed para MySQL. Ajusta nombres de tablas y columnas si difieren.
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE turno;
TRUNCATE TABLE turno_producto;
TRUNCATE TABLE producto;
TRUNCATE TABLE servicio;
TRUNCATE TABLE usuario;
TRUNCATE TABLE cliente;
SET FOREIGN_KEY_CHECKS = 1;
ALTER TABLE producto AUTO_INCREMENT = 10000;

-- Insertar 30 clientes
INSERT INTO cliente (nombre, apellido, telefono, email, dni, fechaNacimiento, activo) VALUES
('Ana', 'García', '1155551001', 'ana.garcia@email.com', '12345678', '1990-03-15', true),
('Bruno', 'López', '1155551002', 'bruno.lopez@email.com', '23456789', '1985-07-22', true),
('Carla', 'Martínez', '1155551003', 'carla.martinez@email.com', '34567890', '1992-11-08', true),
('Diego', 'Fernández', '1155551004', 'diego.fernandez@email.com', '45678901', '1988-01-30', true),
('Elena', 'Ruiz', '1155551005', 'elena.ruiz@email.com', '56789012', '1995-05-14', true),
('Francisco', 'Moreno', '1155551006', 'francisco.moreno@email.com', '67890123', '1987-09-03', true),
('Gabriela', 'Jiménez', '1155551007', 'gabriela.jimenez@email.com', '78901234', '1993-12-25', true),
('Hernán', 'Vargas', '1155551008', 'hernan.vargas@email.com', '89012345', '1986-04-12', true),
('Isabel', 'Castro', '1155551009', 'isabel.castro@email.com', '90123456', '1991-08-07', true),
('Joaquín', 'Herrera', '1155551010', 'joaquin.herrera@email.com', '01234567', '1989-02-18', true),
('Karina', 'Mendoza', '1155551011', 'karina.mendoza@email.com', '11234568', '1994-06-09', true),
('Lucas', 'Romero', '1155551012', 'lucas.romero@email.com', '21234569', '1983-10-21', true),
('María', 'Silva', '1155551013', 'maria.silva@email.com', '31234570', '1996-01-14', true),
('Nicolás', 'Guerrero', '1155551014', 'nicolas.guerrero@email.com', '41234571', '1990-05-26', true),
('Olivia', 'Medina', '1155551015', 'olivia.medina@email.com', '51234572', '1992-09-11', true),
('Pablo', 'Ortega', '1155551016', 'pablo.ortega@email.com', '61234573', '1984-03-05', true),
('Quintina', 'Aguilar', '1155551017', 'quintina.aguilar@email.com', '71234574', '1997-07-19', true),
('Roberto', 'Vega', '1155551018', 'roberto.vega@email.com', '81234575', '1981-11-02', true),
('Sofía', 'Delgado', '1155551019', 'sofia.delgado@email.com', '91234576', '1993-04-16', true),
('Tomás', 'Peña', '1155551020', 'tomas.pena@email.com', '02345678', '1987-08-29', true),
('Úrsula', 'Ramos', '1155551021', 'ursula.ramos@email.com', '12345679', '1995-12-13', true),
('Valentín', 'Flores', '1155551022', 'valentin.flores@email.com', '22345680', '1986-02-24', true),
('Wanda', 'Núñez', '1155551023', 'wanda.nunez@email.com', '32345681', '1991-06-17', true),
('Xavier', 'Campos', '1155551024', 'xavier.campos@email.com', '42345682', '1989-10-08', true),
('Yamila', 'Soto', '1155551025', 'yamila.soto@email.com', '52345683', '1994-01-31', true),
('Zacarías', 'Cabrera', '1155551026', 'zacarias.cabrera@email.com', '62345684', '1982-05-20', true),
('Adriana', 'Molina', '1155551027', 'adriana.molina@email.com', '72345685', '1996-09-04', true),
('Benjamín', 'Reyes', '1155551028', 'benjamin.reyes@email.com', '82345686', '1988-12-27', true),
('Cecilia', 'Torres', '1155551029', 'cecilia.torres@email.com', '92345687', '1993-03-12', true),
('Damián', 'González', '1155551030', 'damian.gonzalez@email.com', '03456789', '1985-07-06', true);

-- Insertar 15 servicios
INSERT INTO servicio (servicio, descripcion, duracion, precio, realizados, estado) VALUES
('Corte de Cabello Hombre', 'Corte moderno y clásico para hombres', 30, 2500.00, 0, true),
('Corte de Cabello Mujer', 'Corte personalizado para mujeres', 45, 3500.00, 0, true),
('Peinado Social', 'Peinado elegante para eventos especiales', 60, 4500.00, 0, true),
('Tintura Completa', 'Coloración completa del cabello', 120, 8500.00, 0, true),
('Mechas', 'Reflejos y mechas parciales', 90, 6500.00, 0, true),
('Alisado Brasileño', 'Tratamiento alisador duradero', 180, 15000.00, 0, true),
('Permanente', 'Rizado permanente del cabello', 150, 12000.00, 0, true),
('Lavado y Secado', 'Lavado profundo con secado profesional', 25, 1800.00, 0, true),
('Tratamiento Capilar', 'Hidratación y nutrición del cabello', 45, 3800.00, 0, true),
('Arreglo de Barba', 'Perfilado y cuidado de barba', 20, 2000.00, 0, true),
('Depilación Facial', 'Depilación con cera de rostro', 30, 2200.00, 0, true),
('Manicura', 'Cuidado completo de uñas', 40, 2800.00, 0, true),
('Pedicura', 'Cuidado completo de pies', 50, 3200.00, 0, true),
('Maquillaje Social', 'Maquillaje para eventos', 45, 4000.00, 0, true),
('Extensiones', 'Colocación de extensiones de cabello', 120, 10000.00, 0, true);

-- Insertar 5 usuarios
INSERT INTO usuario (username, password, nombre, apellido, email, rol, activo, fechaCreacion) VALUES
('admin.trimly', '$2b$10$hashedpassword1', 'Administrador', 'Sistema', 'admin@trimly.com', 'admin', true, NOW()),
('maria.peluquera', '$2b$10$hashedpassword2', 'María', 'Rodríguez', 'maria@trimly.com', 'empleado', true, NOW()),
('carlos.estilista', '$2b$10$hashedpassword3', 'Carlos', 'Mendez', 'carlos@trimly.com', 'empleado', true, NOW()),
('sofia.colorista', '$2b$10$hashedpassword4', 'Sofía', 'Blanco', 'sofia@trimly.com', 'empleado', true, NOW()),
('lucia.manicura', '$2b$10$hashedpassword5', 'Lucía', 'Herrera', 'lucia@trimly.com', 'empleado', true, NOW());

-- Insertar 50 productos
INSERT INTO producto (nombre, categoria, marca, precio, stock, estado) VALUES
-- Champús y Acondicionadores
('Champú Hidratante L\'Oréal 300ml', 'Cuidado Capilar', 'L\'Oréal', 2850.00, 25, true),
('Acondicionador Nutritivo Pantene 400ml', 'Cuidado Capilar', 'Pantene', 2100.00, 30, true),
('Champú Anticaspa Head & Shoulders 250ml', 'Cuidado Capilar', 'Head & Shoulders', 1950.00, 20, true),
('Champú Purple Toning 250ml', 'Cuidado Capilar', 'Schwarzkopf', 3200.00, 15, true),
('Acondicionador Reparador Elvive 300ml', 'Cuidado Capilar', 'L\'Oréal', 2400.00, 22, true),

-- Tinturas y Coloración
('Tintura Permanente Schwarzkopf Castaño', 'Coloración', 'Schwarzkopf', 1850.00, 40, true),
('Tintura Permanente L\'Oréal Rubio Ceniza', 'Coloración', 'L\'Oréal', 1950.00, 35, true),
('Decolorante Polvo Blondor 500g', 'Coloración', 'Wella', 4200.00, 18, true),
('Agua Oxigenada 30 Vol 1000ml', 'Coloración', 'Genérico', 980.00, 50, true),
('Agua Oxigenada 20 Vol 1000ml', 'Coloración', 'Genérico', 950.00, 45, true),
('Matizador Violeta Fanola 350ml', 'Coloración', 'Fanola', 2650.00, 28, true),
('Tintura Semi-permanente Crazy Color Rojo', 'Coloración', 'Crazy Color', 1400.00, 12, true),

-- Tratamientos Capilares
('Keratina Brasileña Inoar 1000ml', 'Tratamientos', 'Inoar', 8500.00, 8, true),
('Botox Capilar Plastica Capilar 500ml', 'Tratamientos', 'Plastica Capilar', 6200.00, 10, true),
('Máscara Hidratante Salon Line 500g', 'Tratamientos', 'Salon Line', 3100.00, 25, true),
('Ampolla Reconstructora Capicilin', 'Tratamientos', 'Capicilin', 850.00, 60, true),
('Aceite de Argan Marroquí 100ml', 'Tratamientos', 'Moroccan Oil', 2800.00, 20, true),

-- Productos de Peinado
('Gel Fijador Extra Fuerte 500ml', 'Peinado', 'Schwarzkopf', 1650.00, 35, true),
('Mousse Voluminizadora TRESemmé 300ml', 'Peinado', 'TRESemmé', 1850.00, 28, true),
('Spray Fijador Profesional 400ml', 'Peinado', 'L\'Oréal', 2100.00, 32, true),
('Cera Modeladora Matte Effect 100g', 'Peinado', 'American Crew', 2450.00, 24, true),
('Serum Anti-Frizz Schwarzkopf 150ml', 'Peinado', 'Schwarzkopf', 3200.00, 18, true),
('Spray Termoprotector 200ml', 'Peinado', 'TRESemmé', 2650.00, 26, true),

-- Uñas y Manicura
('Esmalte Base Coat Transparente', 'Manicura', 'OPI', 890.00, 40, true),
('Esmalte Rojo Clásico OPI 15ml', 'Manicura', 'OPI', 1250.00, 25, true),
('Esmalte Top Coat Brillante', 'Manicura', 'OPI', 920.00, 35, true),
('Removedor Sin Acetona 250ml', 'Manicura', 'Sally Hansen', 650.00, 30, true),
('Aceite Cutículas Vitamina E 15ml', 'Manicura', 'CND', 780.00, 45, true),
('Lima Profesional 180/240', 'Manicura', 'OPI', 320.00, 100, true),
('Empujador de Cutículas Acero', 'Manicura', 'Staleks', 450.00, 50, true),

-- Herramientas y Accesorios
('Tijera Profesional Jaguar 5.5"', 'Herramientas', 'Jaguar', 12500.00, 5, true),
('Navaja Barbería Clásica', 'Herramientas', 'Dovo', 3800.00, 8, true),
('Peine Carbón Antiestático 21cm', 'Herramientas', 'YS Park', 850.00, 40, true),
('Cepillo Profesional Cerda Natural', 'Herramientas', 'Mason Pearson', 1650.00, 25, true),
('Secador Profesional 2000W', 'Herramientas', 'BaByliss', 15800.00, 3, true),
('Plancha Alisadora Titanio 230°C', 'Herramientas', 'GHD', 18500.00, 2, true),
('Babyliss Ondulador 25mm', 'Herramientas', 'BaByliss', 12200.00, 4, true),
('Clips Separadores Negros x12', 'Herramientas', 'Dewal', 480.00, 80, true),

-- Cuidado Facial
('Crema Hidratante Neutrogena 50ml', 'Facial', 'Neutrogena', 1950.00, 20, true),
('Tónico Facial Astringente 200ml', 'Facial', 'La Roche Posay', 1350.00, 25, true),
('Mascarilla Arcilla Verde 100g', 'Facial', 'The Body Shop', 1750.00, 18, true),
('Desmaquillante Bifásico 150ml', 'Facial', 'Bioderma', 1680.00, 22, true),

-- Depilación
('Cera Depilatoria Caliente 500g', 'Depilación', 'Lycon', 2100.00, 15, true),
('Bandas Depilatorias Corpo x20', 'Depilación', 'Veet', 890.00, 35, true),
('Aceite Post-Depilación 200ml', 'Depilación', 'Lycon', 1450.00, 20, true),
('Espátulas Madera Descartables x50', 'Depilación', 'Genérico', 650.00, 40, true),

-- Higiene y Limpieza
('Alcohol en Gel 70% 500ml', 'Higiene', 'Genérico', 580.00, 60, true),
('Barbicide Desinfectante 473ml', 'Higiene', 'Barbicide', 2850.00, 12, true),
('Toallas Descartables x100', 'Higiene', 'Genérico', 1250.00, 30, true),
('Guantes Nitrilo Negros x100', 'Higiene', 'Sempermed', 1850.00, 25, true),
('Capa Corte Impermeable Negra', 'Higiene', 'Dewal', 2100.00, 15, true),
('Papel Aluminio Mechas 100m', 'Higiene', 'Genérico', 980.00, 20, true),
('Gorro Plástico Descartable x100', 'Higiene', 'Genérico', 750.00, 40, true);

