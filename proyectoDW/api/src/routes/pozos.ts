import type { FastifyInstance } from "fastify";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Estado, NuevoPozo, Pozo, Usuario } from "../models/schemas.ts";
import * as err from "../models/errors.ts";
import { Type } from "@fastify/type-provider-typebox";
import * as funcPozo from "../services/pozos-services.ts";
import { isAdmin, isPerf, isProp } from "../services/roles-services.ts";
import fs from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, "..", "..", "public");

const pozoRoutes = async function (fastify: FastifyInstance, options: object) {
  //Crear pozo (estado inicial: ingresando)
  fastify.post(
    "/usuarios/:id_usuario/pozos",
    {
      schema: {
        summary: "Crear un pozo",
        description: "Rol: Perforador",
        params: Type.Object({
          id_usuario: Type.Integer(),
        }),
        tags: ["pozos"],
        body: NuevoPozo,
        response: {
          201: Pozo,
          501: err.ErrorSchema,
        },
        security: [{ BearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.userIsAdminOrPerforador],
    },
    async (req, rep) => {
      const { id_usuario } = req.params as { id_usuario: number };
      const data = req.body as NuevoPozo;

      const isPropietario = await isProp(data.id_propietario);
      const isPerforador = await isPerf(data.id_perforador);

      if (isPropietario === false)
        throw new err.T05DatosIncorrectos("El ID no es de un propietario");
      if (isPerforador === false)
        throw new err.T05DatosIncorrectos("El ID no es de un perforador");

      const nuevoPozo = await funcPozo.createPozo(
        id_usuario,
        req.body as NuevoPozo
      );
      return rep.code(201).send(nuevoPozo);
    }
  );

  //Editar o completar la información de un pozo
  fastify.put(
    "/usuarios/:id_usuario/pozos/:id_pozo",
    {
      schema: {
        summary: "Editar un pozo",
        description: "Rol: Perforador",
        tags: ["pozos"],
        params: Type.Object({
          id_usuario: Type.Integer(),
          id_pozo: Type.Integer(),
        }),
        body: NuevoPozo,
        response: {
          200: Pozo,
          501: err.ErrorSchema,
          404: err.ErrorSchema,
        },
        security: [{ BearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.userIsAdminOrPerforador],
    },
    async (req, rep) => {
      const { id_usuario } = req.params as { id_usuario: number };
      const data = req.body as NuevoPozo;

      const isPropietario = await isProp(data.id_propietario);
      const isPerforador = await isPerf(data.id_perforador);

      if (isPropietario === false)
        throw new err.T05DatosIncorrectos("El ID no es de un propietario");
      if (isPerforador === false)
        throw new err.T05DatosIncorrectos("El ID no es de un perforador");

      const { id_pozo } = req.params as { id_pozo: number };
      const pozoEditado = await funcPozo.updatePozo(id_pozo, data);
      if (!pozoEditado) {
        throw new err.T05PozoNoEncontrado();
      }

      return rep.code(200).send(pozoEditado);
    }
  );

  //Obtener un pozo en específico
  fastify.get(
    "/usuarios/:id_usuario/pozos/:id_pozo",
    {
      schema: {
        summary: "Obtener un pozo en específico",
        description: "Rol: Propietario/Perforador",
        tags: ["pozos"],
        params: Type.Object({
          id_usuario: Type.Integer({
            description: "ID del usuario propietario",
          }),
          id_pozo: Type.Integer({ description: "ID del pozo a consultar" }),
        }),
        response: {
          200: Pozo,
          501: err.ErrorSchema,
          404: err.ErrorSchema,
        },
        security: [{ BearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [
        fastify.pozoIsFromUser,
        fastify.userIsPropietarioOrPerforadorOrAdmin,
      ],
    },
    async (req, rep) => {
      const { id_pozo } = req.params as {
        id_usuario: number;
        id_pozo: number;
      };
      const pozo = await funcPozo.getPozoById(id_pozo);
      if (!pozo) {
        throw new err.T05PozoNoEncontrado();
      }
      return rep.code(200).send(pozo);
    }
  );

  //Obtener todos los pozos
  fastify.get(
    "/usuarios/:id_usuario/pozos",
    {
      schema: {
        summary: "Obtener todos los pozos",
        description: "Rol: Administrador/Perforador",
        tags: ["pozos"],
        params: Type.Object({
          id_usuario: Type.Integer(),
        }),
        response: {
          200: Type.Array(Pozo),
          501: err.ErrorSchema,
        },
        security: [{ BearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
    },
    async (req, rep) => {
      const { id_usuario } = req.params as { id_usuario: number };

      const isPropietario = await isProp(id_usuario);
      const isPerforador = await isPerf(id_usuario);
      const isAdministrador = await isAdmin(id_usuario);
      if (isPropietario) {
        console.log("ES PROPIETARIO");
        const pozos = await funcPozo.getPozosByPropietario(id_usuario);
        return rep.code(200).send(pozos);
      }

      if (isPerforador) {
        console.log("ES PERFORADOR");
        const pozos = await funcPozo.getPozosByPerforador(id_usuario);
        return rep.code(200).send(pozos);
      }
      if (isAdministrador) {
        console.log("ES ADMIN");
        const pozos = await funcPozo.getAllPozo();
        return rep.code(200).send(pozos);
      }
      throw new err.T05SinPermiso("Se debe tener un rol");
    }
  );
  // Borrar un pozo
  fastify.delete(
    "/usuarios/:id_usuario/pozos/:id_pozo",
    {
      schema: {
        summary: "Borrar un pozo",
        description: "Rol: Perforador/Propietario",
        tags: ["pozos"],
        params: Type.Object({
          id_usuario: Type.Integer(),
          id_pozo: Type.Integer(),
        }),
        response: {
          204: Type.Null(),
          501: err.ErrorSchema,
          404: err.ErrorSchema,
        },
        security: [{ BearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.userIsAdminOrPerforador],
    },
    async (req, rep) => {
      const { id_pozo } = req.params as {
        id_usuario: number;
        id_pozo: number;
      };

      const borrado = await funcPozo.deletePozo(id_pozo);

      if (!borrado) {
        throw new err.T05PozoNoEncontrado();
      }

      return rep.code(204).send();
    }
  );
  fastify.post(
    "/usuarios/:id_usuario/pozos/:id_pozo/foto",
    {
      schema: {
        summary: "Agregar la foto a un pozo",
        description: "Rol: Perforador",
        tags: ["pozos"],
        params: Type.Object({
          id_usuario: Type.Integer(),
          id_pozo: Type.Integer(),
        }),
        body: Type.Any(),

        response: {
          200: Pozo,
          501: err.ErrorSchema,
          404: err.ErrorSchema,
        },
        security: [{ BearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.userIsAdminOrPerforador],
    },
    async (req, rep) => {
      const { id_usuario, id_pozo } = req.params as {
        id_usuario: number;
        id_pozo: number;
      };

      const foto = await (req as any).file?.();
      if (!foto)
        throw new err.T05DatosIncorrectos("No se recibió archivo de foto");

      const nombreFoto = foto.filename || "foto.jpg";
      const extension = nombreFoto.includes(".")
        ? nombreFoto.split(".").pop()
        : "jpg";

      const fileName = `pozo-${id_pozo}.${extension}`;

      const filePath = path.join(PUBLIC_DIR, fileName);

      fastify.log.info(
        { nombreFoto, extension, fileName, PUBLIC_DIR, filePath },
        "[FOTO] Rutas calculadas"
      );

      await fs.mkdir(PUBLIC_DIR, { recursive: true });

      const buffer = await foto.toBuffer();
      await fs.writeFile(filePath, buffer);

      const fotoUrl = `/public/${fileName}`;

      fastify.log.info({ fotoUrl }, "[FOTO] URL que se guarda en BD");

      const pozoActualizado = await funcPozo.updatePozoFoto(id_pozo, fotoUrl);
      if (!pozoActualizado) {
        throw new err.T05PozoNoEncontrado();
      }

      fastify.log.info(
        { id_pozo, fotoUrl },
        "[FOTO] Pozo actualizado correctamente"
      );

      return rep.code(200).send(pozoActualizado);
    }
  );
};
export default pozoRoutes;
