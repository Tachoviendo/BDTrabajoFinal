
# Defensa proyecto Integrador.

Estudiante : Ignacio Silva  

Universidad Católica

Asignatura: Bases de Datos I

Docente: Jorge Martínez

Fecha: 4 de diciembre de 2025

## Mer origianl
![assets/DiagramaFisico.png]("mersito")
## Integración con diagrama mer

![assets/merModuloAuditoria.png]("mersito")

## Diagrama Físico Original

![assets/DiagramaFisico.png]("mersito")

## Integración del diagrama Físico. 

![assets/diagramaFisicoModuloAuditoria.png]("mersito")


## ddl

```
CREATE TABLE tabla(
    nombre_tabla VARCHAR(40) PRIMARY KEY, 
    campo VARCHAR(50),
    dato_antes VARCHAR(100), 
    dato_despues VARCHAR(100)
);



CREATE TABLE modificacion(
    id_modificacion SERIAL PRIMARY KEY,
    fecha DATE,
    hora VARCHAR (50),
    tipo_accion VARCHAR(50),
    id_usuario INT, 
    nombre_tabla VARCHAR NOT NULL, 
    FOREING KEY (nombre_tabla) REFERENCES tabla(nombre_tabla),
    FOREING KEY (id_usuario) REFERENCES usuario(id_usuario) 
    
);

CREATE TABLE sesion(
    id_sesion SERIAL PRIMARY KEY, 
    fecha DATE,
    hora VARCHAR (30)
);

CREATE TABLE usuario_sesion(
    id_usuario INT REFERENCES usuario(id_usuario),
    id_sesion INT REFERENCES sesion(id_sesion),
    PRIMARY KEY (id_usuario, id_sesion)
);




```




## dml
```
INSERT INTO sesion (fecha, hora)
VALUES
  ('2025-12-01', '12:12'),
  ('2025-12-02', '12:13'),
  ('2025-12-03', '14:12');

INSERT INTO usuario_sesion(id_usuario, id_sesion)
VALUES
    (1, 1),
    (2,2),
    (3,3);





INSERT INTO tabla(nombre_tabla, campo, dato_antes, dato_despues);
VALUES
    ('pozo', 'empresa', "Coca-cola", "pepsi"),
    ('informe', 'titulo', "Informe", "Informe2"),
    ('sitio', 'departamento', "Artigas", "Salto");


INSERT INTO modificacion(fecha, hora, tipo_accion, id_usuario, nombre_tabla)
VALUES
  ("2025-12-04", "12:13", "modificar", 1, "pozo"),
  ("2025-12-04", "12:13", "modificar", 2, "informe"),
  ("2025-12-04", "12:13", "modificar", 3, "sitio");







```








