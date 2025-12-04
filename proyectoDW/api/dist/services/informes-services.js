import { myPool } from "../db/pool.js";
import { CaracteristicasConstructivas, Informe, InformeBody, IntervaloLitologico, } from "../models/schemas.js";
import * as err from "../models/errors.js";
export async function getInforme(id_pozo) {
    const { rows } = await myPool.query(`
    SELECT *
    FROM informe
    WHERE id_perforacion = $1
    `, [id_pozo]);
    return rows[0] ?? null;
}
export async function getCaracteristicasConstructivas(id_pozo) {
    const { rows } = await myPool.query(`
    SELECT *
    FROM caracteristicas_constructivas
    WHERE id_pozo = $1
    `, [id_pozo]);
    return rows[0] ?? null;
}
//# sourceMappingURL=informes-services.js.map