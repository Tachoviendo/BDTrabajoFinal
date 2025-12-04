import fastifyJwt from "@fastify/jwt";
import fastifyPlugin from "fastify-plugin";
import * as err from "../models/errors.js";
import { rolUser } from "../services/auth-services.js";
import { myPool } from "../db/pool.js";
export default fastifyPlugin(async function (fastify) {
    const secret = process.env.FASTIFY_SECRET;
    if (!secret)
        throw new err.T05ErrorDesconocido("Falta setear FASTIFY_SECRET");
    await fastify.register(fastifyJwt, { secret });
    fastify.decorate("authenticate", async function (req, rep) {
        try {
            await req.jwtVerify();
        }
        catch {
            throw new err.T05NoAutorizado();
        }
    });
    fastify.decorate("userIsAdmin", async function (req, rep) {
        await fastify.authenticate(req, rep);
        const { sub } = req.user;
        const ok = await rolUser(sub, "administracion");
        if (!ok)
            throw new err.T05SinPermiso();
    });
    fastify.decorate("userIsPerforador", async function (req, rep) {
        await fastify.authenticate(req, rep);
        const { sub } = req.user;
        const ok = await rolUser(sub, "perforador");
        if (!ok)
            throw new err.T05SinPermiso();
    });
    fastify.decorate("userIsPropietario", async function (req, rep) {
        await fastify.authenticate(req, rep);
        const { sub } = req.user;
        const ok = await rolUser(sub, "propietario");
        if (!ok)
            throw new err.T05SinPermiso();
    });
    fastify.decorate("userIsPropietarioOrPerforador", async function (req, rep) {
        await fastify.authenticate(req, rep);
        const { sub } = req.user;
        const isPropietario = await rolUser(sub, "propietario");
        const IsPerforador = await rolUser(sub, "perforador");
        if (!(isPropietario || IsPerforador))
            throw new err.T05SinPermiso();
    });
    fastify.decorate("userIsPropietarioOrPerforadorOrAdmin", async function (req, rep) {
        await fastify.authenticate(req, rep);
        const { sub } = req.user;
        const isPropietario = await rolUser(sub, "propietario");
        const IsPerforador = await rolUser(sub, "perforador");
        const IsAdmin = await rolUser(sub, "administracion");
        if (!(isPropietario || IsPerforador || IsAdmin))
            throw new err.T05SinPermiso();
    });
    fastify.decorate("userIsAdminOrPerforador", async function (req, rep) {
        await fastify.authenticate(req, rep);
        const { sub } = req.user;
        const isAdmin = await rolUser(sub, "administracion");
        const IsPerforador = await rolUser(sub, "perforador");
        if (!(isAdmin || IsPerforador))
            throw new err.T05SinPermiso();
    });
    fastify.decorate("pozoIsFromUser", async function (req, rep) {
        await fastify.authenticate(req, rep);
        const { sub } = req.user;
        const { id_pozo } = req.params;
        const isAdmin = await rolUser(sub, "administracion");
        const { rows } = await myPool.query(`SELECT id_propietario, id_perforador FROM pozo WHERE id_pozo = $1`, [id_pozo]);
        if (rows.length === 0)
            throw new err.T05PozoNoEncontrado();
        const { id_propietario, id_perforador } = rows[0];
        if (Number(sub) !== Number(id_propietario) &&
            Number(sub) !== Number(id_perforador) &&
            !isAdmin)
            throw new err.T05SinPermiso();
    });
    fastify.decorate("IsThisUser", async function (req, rep) {
        await fastify.authenticate(req, rep);
        const { sub } = req.user;
        const { id_usuario } = req.params;
        console.log(id_usuario, Number(sub));
        const isuser = Number(sub) === id_usuario;
        const isadmin = await rolUser(sub, "administracion");
        if (!isuser && !isadmin)
            throw new err.T05SinPermiso();
    });
});
//# sourceMappingURL=jwt.js.map