import { Usuario, UsuarioLogin, UsuarioRegister } from "../models/schemas.js";
import * as err from "../models/errors.js";
import { Type } from "@fastify/type-provider-typebox";
import { logUser } from "../services/auth-services.js";
import { getUsuarioById } from "../services/usuarios-service.js";
import { getRoles } from "../services/roles-services.js";
const authRoutes = async function (fastify, options) {
    fastify.post("/login", {
        schema: {
            summary: "Inicio de sesión de un usuario",
            description: "Rol: Cualquiera",
            tags: ["login"],
            body: UsuarioLogin,
            response: {
                200: Type.Object({
                    token: Type.String(),
                }),
                501: err.ErrorSchema,
            },
        },
    }, async function (req, rep) {
        try {
            const { email, password } = req.body;
            const user = await logUser(email, password);
            if (!user)
                throw new err.T05UsuarioNoEncontrado();
            const roles = await getRoles(user.id_usuario);
            if (!roles)
                throw new err.T05RolNoEncontrado();
            const token = fastify.jwt.sign({ sub: user.id_usuario, roles }, { expiresIn: "10h" });
            return { token };
        }
        catch (e) {
            throw err.T05ErrorConexion();
        }
    });
    fastify.get("/login", {
        schema: {
            tags: ["login"],
            response: {
                200: Usuario,
                401: err.ErrorSchema,
            },
            security: [{ BearerAuth: [] }],
        },
        onRequest: [fastify.authenticate],
    }, async function (req) {
        try {
            const id = req.user.sub;
            const user = await getUsuarioById(id);
            if (!user)
                throw new err.T05UsuarioNoEncontrado();
            return user;
        }
        catch (e) {
            throw new err.T05ErrorConexion();
        }
    });
};
export default authRoutes;
//# sourceMappingURL=login.js.map