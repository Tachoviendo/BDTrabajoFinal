DROP TABLE IF EXISTS
  documento,
  pozo_estado_hist,
  regla_transicion,
  transicion,
  estado,
  nivel_aporte,
  intervalo_diametro_perforacion,
  intervalo_litologico,
  pozo,
  perforador,
  empresa,
  sitio,
  propietario,
  rol_permiso,
  permiso,
  usuario_rol,
  rol,
  usuario
CASCADE;

CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE usuario (
  id_usuario      BIGSERIAL PRIMARY KEY,
  email           CITEXT NOT NULL UNIQUE,
  nombre          VARCHAR NOT NULL,
  password        VARCHAR NOT NULL,    
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  fecha_registro  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE rol (
  id_rol  BIGSERIAL PRIMARY KEY,
  nombre  VARCHAR NOT NULL UNIQUE,
  descr   VARCHAR NOT NULL
);

CREATE TABLE usuario_rol (
  id_usuario BIGINT REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  id_rol     BIGINT REFERENCES rol(id_rol)        ON DELETE CASCADE,
  PRIMARY KEY (id_usuario, id_rol)
);

CREATE TABLE permiso (
  id_permiso BIGSERIAL PRIMARY KEY,
  clave      TEXT NOT NULL UNIQUE,
  descr      VARCHAR NOT NULL        
);

CREATE TABLE rol_permiso (
  id_rol     BIGINT REFERENCES rol(id_rol)           ON DELETE CASCADE,
  id_permiso BIGINT REFERENCES permiso(id_permiso)   ON DELETE CASCADE,
  PRIMARY KEY (id_rol, id_permiso)
);



CREATE TABLE sitio (
  id_sitio      BIGSERIAL PRIMARY KEY,
  departamento  VARCHAR NOT NULL,
  localidad     VARCHAR,
  latitud       VARCHAR,   
  longitud      VARCHAR
);



CREATE TABLE pozo (
  id_pozo              BIGSERIAL PRIMARY KEY,
  id_propietario       BIGINT NOT NULL REFERENCES usuario(id_usuario),
  id_sitio             BIGINT NOT NULL REFERENCES sitio(id_sitio),
  empresa              VARCHAR,
  id_perforador        BIGINT NOT NULL REFERENCES usuario(id_usuario),  
  creado_por           BIGINT REFERENCES usuario(id_usuario),                
  fecha_inicio         DATE,
  fecha_fin            DATE,
  profundidad_final_m  NUMERIC CHECK (profundidad_final_m > 0),
  sello_sanitario      BOOLEAN,
  pre_filtro           VARCHAR,
  nivel_estatico_m     NUMERIC,
  nivel_dinamico_m     NUMERIC,
  caudal_estimado_lh   INTEGER,
  metodo_sedimentario  VARCHAR, 
  metodo_rocoso        VARCHAR, 
  cementacion          VARCHAR, 
  desarrollo           VARCHAR, 
  revestimiento        VARCHAR,
  foto_url             VARCHAR,
  fecha_creado         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE intervalo_litologico (
  id_intervalo_litologico BIGSERIAL PRIMARY KEY,
  id_pozo                 BIGINT NOT NULL REFERENCES pozo(id_pozo) ON DELETE CASCADE,
  desde_m                 NUMERIC NOT NULL,
  hasta_m                 NUMERIC NOT NULL,
  material                VARCHAR NOT NULL,
  CHECK (hasta_m > desde_m)
);

CREATE TABLE intervalo_diametro_perforacion (
  id_intervalo_diametro_perforacion BIGSERIAL PRIMARY KEY,
  id_pozo                           BIGINT NOT NULL REFERENCES pozo(id_pozo) ON DELETE CASCADE,
  desde_m                           NUMERIC NOT NULL,
  hasta_m                           NUMERIC NOT NULL,
  diametro_pulg                     NUMERIC NOT NULL,
  CHECK (hasta_m > desde_m)
);

CREATE TABLE nivel_aporte (
  id_nivel_aporte BIGSERIAL PRIMARY KEY,
  id_pozo         BIGINT NOT NULL REFERENCES pozo(id_pozo) ON DELETE CASCADE,
  profundidad_m   NUMERIC NOT NULL CHECK (profundidad_m >= 0)
);


CREATE TABLE documento (
  id_documento  BIGSERIAL PRIMARY KEY,
  id_pozo       BIGINT NOT NULL REFERENCES pozo(id_pozo) ON DELETE CASCADE,
  tipo          VARCHAR,
  nombre_archivo VARCHAR NOT NULL,
  ruta          VARCHAR,
  generado_por  BIGINT REFERENCES usuario(id_usuario),
  generado_en   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE informe (
  id_informe   BIGSERIAL PRIMARY KEY,
  id_pozo      BIGINT NOT NULL REFERENCES pozo(id_pozo) ON DELETE CASCADE,
  titulo       VARCHAR NOT NULL,
  descripcion  TEXT,
  generado_por BIGINT NOT NULL REFERENCES usuario(id_usuario),
  generado_en  TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- Usuarios
INSERT INTO usuario(email, nombre, password)
SELECT 'administracion@gmail.com', 'Sistema', 'administracion'
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE email='administracion@gmail.com');

INSERT INTO usuario(email, nombre, password)
SELECT 'perforador@gmail.com', 'Perforador', 'perforador'
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE email='perforador@gmail.com');

INSERT INTO usuario(email, nombre, password)
SELECT 'propietario@gmail.com', 'Propietario', 'propietario'
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE email='propietario@gmail.com');

-- Roles
INSERT INTO rol(nombre, descr)
SELECT 'administracion', 'Administración'
WHERE NOT EXISTS (SELECT 1 FROM rol WHERE nombre='administracion');

INSERT INTO rol(nombre, descr)
SELECT 'perforador', 'Técnico de perforación'
WHERE NOT EXISTS (SELECT 1 FROM rol WHERE nombre='perforador');

INSERT INTO rol(nombre, descr)
SELECT 'propietario', 'Propietario del sitio'
WHERE NOT EXISTS (SELECT 1 FROM rol WHERE nombre='propietario');

-- Asignación de roles a usuarios
INSERT INTO usuario_rol(id_usuario, id_rol)
SELECT u.id_usuario, r.id_rol
FROM usuario u
JOIN rol r ON (
   (u.email='administracion@gmail.com' AND r.nombre='administracion')
OR (u.email='perforador@gmail.com' AND r.nombre='perforador')
OR (u.email='propietario@gmail.com' AND r.nombre='propietario')
)
WHERE NOT EXISTS (
   SELECT 1 FROM usuario_rol ur 
   WHERE ur.id_usuario=u.id_usuario AND ur.id_rol=r.id_rol
);

-- Permisos
INSERT INTO permiso(clave, descr)
SELECT 'crear_pozo', 'Crear pozos'
WHERE NOT EXISTS (SELECT 1 FROM permiso WHERE clave='crear_pozo');

INSERT INTO permiso(clave, descr)
SELECT 'editar_pozo', 'Editar datos del pozo'
WHERE NOT EXISTS (SELECT 1 FROM permiso WHERE clave='editar_pozo');

INSERT INTO permiso(clave, descr)
SELECT 'aprobar', 'Aprobar informes'
WHERE NOT EXISTS (SELECT 1 FROM permiso WHERE clave='aprobar');

INSERT INTO permiso(clave, descr)
SELECT 'generar_pdf', 'Generar informe PDF'
WHERE NOT EXISTS (SELECT 1 FROM permiso WHERE clave='generar_pdf');

INSERT INTO permiso(clave, descr)
SELECT 'registrar_dinagua', 'Registrar en DINAGUA'
WHERE NOT EXISTS (SELECT 1 FROM permiso WHERE clave='registrar_dinagua');

-- Asignación de permisos a roles
INSERT INTO rol_permiso(id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM rol r
JOIN permiso p ON (
   (r.nombre='administracion') OR
   (r.nombre='perforador' AND p.clave IN ('crear_pozo','editar_pozo','generar_pdf')) OR
   (r.nombre='propietario' AND p.clave IN ('crear_pozo','editar_pozo','registrar_dinagua'))
)
WHERE NOT EXISTS (
   SELECT 1 FROM rol_permiso rp 
   WHERE rp.id_rol=r.id_rol AND rp.id_permiso=p.id_permiso
);

-- Sitios
INSERT INTO sitio(departamento, latitud, longitud)
SELECT 'Salto', 'S 31°23''', 'W 57°58'''
WHERE NOT EXISTS (SELECT 1 FROM sitio WHERE departamento='Salto');

INSERT INTO pozo (
  id_propietario,
  id_sitio,
  empresa,
  id_perforador,
  creado_por,
  fecha_inicio,
  fecha_fin,
  profundidad_final_m,
  sello_sanitario,
  pre_filtro,
  nivel_estatico_m,
  nivel_dinamico_m,
  caudal_estimado_lh,
  metodo_sedimentario,
  metodo_rocoso,
  cementacion,
  desarrollo
) VALUES (
  1,              -- id_propietario
  1,              -- id_sitio
  'Raul Silva',  --id_empresa
  2,              -- id_perforador
  3,              -- creado_por
  '2025-01-10',   -- fecha_inicio
  '2025-01-20',   -- fecha_fin
  120.5,          -- profundidad_final_m
  TRUE,           -- sello_sanitario
  '',             -- pre_filtro
  15.2,           -- nivel_estatico_m
  25.7,           -- nivel_dinamico_m
  1800,           -- caudal_estimado_lh
  '',             -- metodo_sedimentario
  '',             -- metodo_rocoso
  '',             -- cementacion
  ''              -- desarrollo
);

INSERT INTO pozo (
  id_propietario,
  id_sitio,
  empresa,
  id_perforador,
  creado_por,
  fecha_inicio,
  fecha_fin,
  profundidad_final_m,
  sello_sanitario,
  pre_filtro,
  nivel_estatico_m,
  nivel_dinamico_m,
  caudal_estimado_lh,
  metodo_sedimentario,
  metodo_rocoso,
  cementacion,
  desarrollo
) VALUES (
  3,              -- id_propietario
  1,              -- id_sitio
  'Raul Silva',              --empresa
  2,              -- id_perforador
  3,              -- creado_por
  '2025-01-10',   -- fecha_inicio
  '2025-01-20',   -- fecha_fin
  120.5,          -- profundidad_final_m
  TRUE,           -- sello_sanitario
  '',             -- pre_filtro
  15.2,           -- nivel_estatico_m
  25.7,           -- nivel_dinamico_m
  1800,           -- caudal_estimado_lh
  '',             -- metodo_sedimentario
  '',             -- metodo_rocoso
  '',             -- cementacion
  ''              -- desarrollo
);

INSERT INTO nivel_aporte (id_pozo, profundidad_m)
VALUES 
  (1, 0),
  (1, 8),
  (1, 15);


INSERT INTO intervalo_litologico (id_pozo, desde_m, hasta_m, material)
VALUES
  (1, 0, 12, 'Arenisca'),
  (1, 12, 23, 'Limo'),
  (1, 23, 31, 'Arcilla');

INSERT INTO intervalo_diametro_perforacion
  (id_pozo, desde_m, hasta_m, diametro_pulg)
VALUES
  (1,   0,   20, 8),
  (1, 20,   110,  6),
  (1, 110,   120.5,  6);


