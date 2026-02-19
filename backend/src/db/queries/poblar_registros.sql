INSERT INTO roles (id, nombre, descripcion) VALUES
                                                ('10000000-0000-0000-0000-000000000001', 'administrador', 'Acceso total al sistema'),
                                                ('10000000-0000-0000-0000-000000000002', 'cajero', 'Realizar transacciones y atención al cliente'),
                                                ('10000000-0000-0000-0000-000000000003', 'cliente', 'Acceso a sus propias cuentas y servicios');

-- Inserción de Permisos
INSERT INTO permisos (id, nombre, descripcion) VALUES
                                                   ('20000000-0000-0000-0000-000000000001', 'crear_cliente', 'Permite registrar nuevos clientes'),
                                                   ('20000000-0000-0000-0000-000000000002', 'realizar_retiro', 'Permite realizar retiros de efectivo'),
                                                   ('20000000-0000-0000-0000-000000000003', 'ver_auditoria', 'Permite visualizar logs de auditoría');

-- Asignación de Permisos a Roles
INSERT INTO roles_permisos (rol_id, permiso_id) VALUES
                                                    ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001'), -- Admin puede crear cliente
                                                    ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003'), -- Admin puede ver auditoría
                                                    ('10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002'); -- Cajero puede hacer retiro

-- Inserción de un Cliente de Ejemplo
INSERT INTO clientes (id, tipo_identificacion, numero_identificacion, nombres, apellidos, fecha_nacimiento, direccion, departamento, distrito, ciudad, email) VALUES
    ('30000000-0000-0000-0000-000000000001', 'cedula', '1234567', 'Juan', 'Perez', '1985-05-15 00:00:00', 'Av. Principal 123', 'Central', 'Asuncion(Capital)', 'Asuncion', 'juan.perez@ejemplo.com');

-- Inserción de una Cuenta de Ejemplo (asociada al cliente Juan Perez)
INSERT INTO cuentas (id, cliente_id, tipo_cuenta, saldo_actual, saldo_disponible, moneda, fecha_apertura, estado, limite_transferencia_diaria) VALUES
    ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'caja_ahorro', 5000000.00, 5000000.00, 'PYG', NOW(), 'activa', 10000000.00);

-- Inserción de un Usuario del Sistema (Administrador)
INSERT INTO usuarios_sistema (id, username, password_hash, rol_id, estado) VALUES
    ('50000000-0000-0000-0000-000000000001', 'admin', 'hashed_password_admin_12345', '10000000-0000-0000-0000-000000000001', 'activo');

-- Inserción de un Usuario del Sistema (Cliente - Juan Perez)
INSERT INTO usuarios_sistema (id, cliente_id, username, password_hash, rol_id, estado) VALUES
    ('50000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'juanperez', 'hashed_password_cliente_67890', '10000000-0000-0000-0000-000000000003', 'activo');

-- Inserción de Cajero Automático
INSERT INTO cajeros_automaticos (id, codigo_cajero, ubicacion, saldo_efectivo_disponible, denominaciones_disponibles, estado) VALUES
    ('60000000-0000-0000-0000-000000000001', 'ATM001', 'Shopping del Sol, Asuncion', 25000000.00, '{"100000": 100, "50000": 200, "20000": 250}', 'operativo');

-- Inserción de una Transacción (Retiro de 500.000 PYG)
INSERT INTO transacciones (tipo_transaccion, cuenta_origen_id, cajero_id, monto, moneda, descripcion, estado) VALUES
    ('retiro', '40000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', 500000.00, 'PYG', 'Retiro en ATM001', 'completada');

-- Inserción de un registro de Auditoría
INSERT INTO auditoria (usuario_id, accion_realizada, tabla_afectada, registro_afectado_id, valores_nuevos, nivel_criticidad) VALUES
    ('50000000-0000-0000-0000-000000000001', 'CREACION', 'clientes', '30000000-0000-0000-0000-000000000001', '{"nombres": "Juan", "apellidos": "Perez"}', 'medio');

-- Sentencia INSERT para agregar un nuevo cliente
INSERT INTO clientes (
    id,
    tipo_identificacion,
    numero_identificacion,
    nombres,
    apellidos,
    fecha_nacimiento,
    nacionalidad,
    direccion,
    departamento,
    distrito,
    ciudad,
    telefono,
    email,
    estado
) VALUES (
             '30000000-0000-0000-0000-000000000002', -- ID personalizado (Asegúrate de usar un UUID único en producción)
             'ruc',
             '80012345-1',
             'Carlos Javier',
             'Benitez Nuñez',
             '1975-02-10 00:00:00',
             'paraguaya',
             'Ruta 1 Km 350, Barrio San Roque',
             'Itapua',
             'Ciudad del Este', -- Nota: Usamos 'Ciudad del Este' del distritoEnum, aunque esté en Itapúa. Se ajustaría si hubiese más granularidad.
             'Encarnacion',
             '+595995789012',
             'carlos.benitez@negocio.com.py',
             'activo'
         );

-- Si deseas asociarle una cuenta de ejemplo inmediatamente:
-- Sentencia INSERT para agregar un nuevo cliente
INSERT INTO clientes (
    id,
    tipo_identificacion,
    numero_identificacion,
    nombres,
    apellidos,
    fecha_nacimiento,
    nacionalidad,
    direccion,
    departamento,
    distrito,
    ciudad,
    telefono,
    email,
    estado
) VALUES (
             '30000000-0000-0000-0000-000000000002', -- ID personalizado (Asegúrate de usar un UUID único en producción)
             'ruc',
             '80012345-1',
             'Carlos Javier',
             'Benitez Nuñez',
             '1975-02-10 00:00:00',
             'paraguaya',
             'Ruta 1 Km 350, Barrio San Roque',
             'Itapua',
             'Ciudad del Este', -- Nota: Usamos 'Ciudad del Este' del distritoEnum, aunque esté en Itapúa. Se ajustaría si hubiese más granularidad.
             'Encarnacion',
             '+595995789012',
             'carlos.benitez@negocio.com.py',
             'activo'
         );

-- Si deseas asociarle una cuenta de ejemplo inmediatamente:
INSERT INTO cuentas (
    id,
    cliente_id,
    tipo_cuenta,
    saldo_actual,
    saldo_disponible,
    moneda,
    fecha_apertura,
    estado,
    limite_transferencia_diaria
) VALUES (
             '40000000-0000-0000-0000-000000000002', -- Nuevo ID de cuenta
             '30000000-0000-0000-0000-000000000002', -- Referencia al nuevo cliente
             'cuenta_corriente',
             15000.00,
             14500.00,
             'USD',
             NOW(),
             'activa',
             5000.00
         );

-- Inserción de un registro de Bitácora
INSERT INTO bitacora_sistema (nivel, modulo, mensaje, usuario_id) VALUES
    ('info', 'AuthService', 'Inicio de sesión exitoso', '50000000-0000-0000-0000-000000000002');