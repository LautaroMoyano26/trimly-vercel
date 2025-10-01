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

-- 10 Clientes
INSERT INTO cliente (nombre, apellido, telefono, email, dni, fechaNacimiento, activo) VALUES
('Ana','Gomez','1155550001','ana@example.com','11111111','1990-01-01',1),
('Bruno','Lopez','1155550002','bruno@example.com','22222222','1988-02-02',1),
('Carla','Martinez','1155550003','carla@example.com','33333333','1992-03-03',1),
('Diego','Fernandez','1155550004','diego@example.com','44444444','1985-04-04',1),
('Elena','Ruiz','1155550005','elena@example.com','55555555','1995-05-05',1),
('Facundo','Sosa','1155550006','facundo@example.com','66666666','1991-06-06',1),
('Gabriela','Ramos','1155550007','gabriela@example.com','77777777','1993-07-07',1),
('Hector','Vega','1155550008','hector@example.com','88888888','1987-08-08',1),
('Irene','Cruz','1155550009','irene@example.com','99999999','1994-09-09',1),
('Javier','Alonso','1155550010','javier@example.com','10101010','1989-10-10',1);

-- 10 Usuarios (empleados/administradores)
INSERT INTO usuario (nombre, apellido, username, email, password, rol, activo) VALUES
('Pablo','Heredia','pablo.heredia','pablo@trimly.com','$2b$10$hashedpassword1','admin',1),
('Maria','Rodriguez','maria.rodriguez','maria@trimly.com','$2b$10$hashedpassword2','empleado',1),
('Carlos','Sanchez','carlos.sanchez','carlos@trimly.com','$2b$10$hashedpassword3','empleado',1),
('Laura','Gutierrez','laura.gutierrez','laura@trimly.com','$2b$10$hashedpassword4','empleado',1),
('Roberto','Morales','roberto.morales','roberto@trimly.com','$2b$10$hashedpassword5','empleado',1),
('Sofia','Torres','sofia.torres','sofia@trimly.com','$2b$10$hashedpassword6','empleado',1),
('Andres','Vargas','andres.vargas','andres@trimly.com','$2b$10$hashedpassword7','empleado',1),
('Valentina','Castillo','valentina.castillo','valentina@trimly.com','$2b$10$hashedpassword8','empleado',1),
('Nicolas','Mendoza','nicolas.mendoza','nicolas@trimly.com','$2b$10$hashedpassword9','empleado',1),
('Camila','Jimenez','camila.jimenez','camila@trimly.com','$2b$10$hashedpassword10','empleado',1);

-- 10 Productos
INSERT INTO producto (nombre, categoria, marca, precio, stock, estado) VALUES
('Shampoo Profesional','cuidado','Marca A',850.00,50,'Alto'),
('Acondicionador Reparador','cuidado','Marca B',920.00,35,'Alto'),
('Cera Modeladora','styling','Marca C',1200.00,25,'Medio'),
('Gel Fijador','styling','Marca D',680.00,40,'Medio'),
('Mascarilla Hidratante','tratamiento','Marca E',1800.00,20,'Medio'),
('Serum Anti-Frizz','tratamiento','Marca F',1350.00,30,'Medio'),
('Spray Protector Térmico','proteccion','Marca G',950.00,45,'Alto'),
('Aceite Capilar','tratamiento','Marca H',1100.00,28,'Medio'),
('Mousse Voluminizadora','styling','Marca I',780.00,38,'Medio'),
('Tónico Anticaída','tratamiento','Marca J',2200.00,15,'Bajo');

-- 10 Servicios
INSERT INTO servicio (servicio, descripcion, duracion, precio, realizados, estado) VALUES
('Corte de pelo','Corte hombre/mujer',30,1200.00,0,1),
('Barba','Perfilado de barba',15,600.00,0,1),
('Tintura','Color completo',90,4500.00,0,1),
('Peinado','Peinado social',45,2000.00,0,1),
('Lavado','Lavado y secado',20,500.00,0,1),
('Corte niño','Corte para niños',25,800.00,0,1),
('Alisado','Alisado temporal',120,7500.00,0,1),
('Reflejos','Reflejos parciales',100,5200.00,0,1),
('Tratamiento','Reparador capilar',60,3000.00,0,1),
('Manicura','Manicura básica',40,1500.00,0,1);

-- 10 Turnos (ajusta los nombres de columnas FK según tu esquema)
INSERT INTO turno (clienteId, servicioId, estado, fecha, hora, notas) VALUES
(1,1,'pendiente','2025-09-26','10:00:00','Cliente regular'),
(2,2,'pendiente','2025-09-26','10:30:00','Primera vez'),
(3,3,'pendiente','2025-09-27','11:00:00','Quiere cambio de look'),
(4,4,'pendiente','2025-09-27','11:30:00','Para evento especial'),
(5,5,'confirmado','2025-09-28','12:00:00',''),
(6,6,'pendiente','2025-09-28','12:30:00','Niño inquieto'),
(7,7,'pendiente','2025-09-29','13:00:00','Cabello muy rizado'),
(8,8,'confirmado','2025-09-29','13:30:00','Solo mechas frontales'),
(9,9,'pendiente','2025-09-30','14:00:00','Cabello dañado'),
(10,10,'pendiente','2025-09-30','14:30:00','Uñas gel');