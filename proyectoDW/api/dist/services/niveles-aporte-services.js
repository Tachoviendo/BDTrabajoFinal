import { myPool } from "../db/pool.js";
import { NivelAporte, NivelAporteBody } from "../models/schemas.js";
import * as err from "../models/errors.js";
export async function createNivelAporte(id_pozo, data) {
    const sql = `INSERT INTO nivel_aporte (id_pozo, profundidad_m)
  VALUES ($1, $2)
  RETURNING *`;
    try {
        const { rows } = await myPool.query(sql, [id_pozo, data.profundidad_m]);
        return rows[0];
    }
    catch (e) {
        if (e.code === "23503")
            throw new err.T05PozoNoEncontrado();
        if (e.code === "23514")
            throw new err.T05DatosIncorrectos();
        throw e;
    }
}
export async function updateNivelAporte(id_pozo, id_nivel_aporte, data) {
    const exists = await myPool.query(`SELECT 1 FROM nivel_aporte WHERE id_nivel_aporte = $1 AND id_pozo = $2`, [id_nivel_aporte, id_pozo]);
    if (!exists.rows[0])
        throw new err.T05PozoNoEncontrado();
    const sql = `
    UPDATE nivel_aporte
    SET
      profundidad_m = $3
    WHERE id_nivel_aporte = $1
      AND id_pozo = $2
    RETURNING *;
  `;
    try {
        const { rows } = await myPool.query(sql, [
            id_nivel_aporte,
            id_pozo,
            data.profundidad_m,
        ]);
        return rows[0] ?? null;
    }
    catch (e) {
        if (e.code === "23514")
            throw new err.T05DatosIncorrectos("Validación: 'profundidad_m debe ser mayor a 0'.");
        throw e;
    }
}
export async function deleteNivelAporte(id_pozo, id_nivel_aporte) {
    const { rowCount } = await myPool.query(`
    DELETE FROM nivel_aporte
    WHERE id_nivel_aporte = $1
      AND id_pozo = $2
    `, [id_nivel_aporte, id_pozo]);
    return (rowCount ?? 0) > 0;
}
export async function getNivelAporteById(id_pozo, id_nivel_aporte) {
    const { rows } = await myPool.query(`
    SELECT *
    FROM nivel_aporte
    WHERE id_nivel_aporte = $1
      AND id_pozo = $2
    `, [id_nivel_aporte, id_pozo]);
    return rows[0] ?? null;
}
export async function getNivelAporteList(id_pozo) {
    const { rows } = await myPool.query(`
    SELECT *
    FROM nivel_aporte
    WHERE id_pozo = $1
    `, [id_pozo]);
    return rows;
}
//# sourceMappingURL=niveles-aporte-services.js.map