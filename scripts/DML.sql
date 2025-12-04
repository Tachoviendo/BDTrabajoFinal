INSERT INTO usuario(email, nombre, password)
SELECT 'administracion@gmail.com', 'Sistema', 'administracion'
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE email='administracion@gmail.com');

INSERT INTO usuario(email, nombre, password)
SELECT 'perforador@gmail.com', 'Perforador', 'perforador'
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE email='perforador@gmail.com');

INSERT INTO usuario(email, nombre, password)
SELECT 'propietario@gmail.com', 'Propietario', 'propietario'
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE email='propietario@gmail.com');

INSERT INTO rol(nombre, descr)
SELECT 'administracion', 'Administración'
WHERE NOT EXISTS (SELECT 1 FROM rol WHERE nombre='administracion');

INSERT INTO rol(nombre, descr)
SELECT 'perforador', 'Técnico de perforación'
WHERE NOT EXISTS (SELECT 1 FROM rol WHERE nombre='perforador');

INSERT INTO rol(nombre, descr)
SELECT 'propietario', 'Propietario del sitio'
WHERE NOT EXISTS (SELECT 1 FROM rol WHERE nombre='propietario');

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
  1,              
  1,              
  'Raul Silva',  
  2,             
  3,              
  '2025-01-10',  
  '2025-01-20', 
  120.5,          
  TRUE,           
  '',             
  15.2,          
  25.7,           
  1800,         
  '',             
  '',         
  '',          
  ''              
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
