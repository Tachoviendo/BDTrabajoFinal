import { myPool } from "../db/pool.js";
import { Sitio, SitioBody } from "../models/schemas.js";
import * as err from "../models/errors.js";
export async function createSitio(data) {
    const sql = `
            INSERT INTO sitio
              (departamento, localidad, latitud, longitud)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
          `;
    try {
        const { rows } = await myPool.query(sql, [
            data.departamento,
            data.localidad,
            data.latitud,
            data.longitud,
        ]);
        return rows[0];
    }
    catch (e) {
        throw e;
    }
}
export async function updateSitio(id_sitio, data) {
    const exists = await myPool.query(`SELECT 1 FROM sitio WHERE id_sitio = $1`, [
        id_sitio,
    ]);
    if (!exists.rows[0])
        return null;
    const sql = `
    UPDATE sitio
    SET
      departamento = $2,
      localidad = $3,
      latitud = $4,
      longitud = $5
    WHERE id_sitio = $1
    RETURNING *;
  `;
    try {
        const { rows } = await myPool.query(sql, [
            id_sitio,
            data.departamento,
            data.localidad,
            data.latitud,
            data.longitud,
        ]);
        return rows[0] ?? null;
    }
    catch (e) {
        throw e;
    }
}
export async function deleteSitio(id_sitio) {
    const { rowCount } = await myPool.query(`
        DELETE FROM sitio
        WHERE id_sitio = $1
        `, [id_sitio]);
    if (rowCount === 0)
        throw new err.T05SitioNoEncontrado();
    return (rowCount ?? 0) > 0;
}
export async function getSitioById(id_sitio) {
    const { rows } = await myPool.query(`
    SELECT *
    FROM sitio
    WHERE id_sitio = $1
    `, [id_sitio]);
    return rows[0] ?? null;
}
export async function getAllSitios() {
    const { rows } = await myPool.query(`
    SELECT *
    FROM sitio
    `);
    return rows;
}
//# sourceMappingURL=sitios-service.js.map