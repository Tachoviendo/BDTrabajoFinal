import { myPool } from "../../db/pool.js";
export async function getReportePozo(id_pozo) {
    const sql = `
    SELECT
      p.id_pozo,
      prop.nombre AS propietario,
      p.empresa AS empresa,
      perf.nombre AS perforador,
      s.departamento || COALESCE(' - ' || s.localidad, '') AS sitio,
      p.fecha_inicio,
      p.fecha_fin,
      p.profundidad_final_m,
      p.nivel_estatico_m,
      p.nivel_dinamico_m,
      p.caudal_estimado_lh,
      p.metodo_sedimentario,
      p.metodo_rocoso,
      p.cementacion AS cementacion,
      p.desarrollo AS desarrollo,
      NULL::text AS introduccion,  
      doc.nombre_archivo,
      p.foto_url 
    FROM public.pozo p
      JOIN public.usuario prop ON prop.id_usuario = p.id_propietario
      JOIN public.usuario perf ON perf.id_usuario = p.id_perforador
      JOIN public.sitio s ON s.id_sitio = p.id_sitio
      LEFT JOIN public.documento doc ON doc.id_pozo = p.id_pozo
    WHERE p.id_pozo = $1;
  `;
    const { rows } = await myPool.query(sql, [id_pozo]);
    if (rows.length === 0)
        return null;
    const pozo = rows[0];
    const litologiaSql = `
    SELECT desde_m, hasta_m, material
    FROM public.intervalo_litologico
    WHERE id_pozo = $1
    ORDER BY desde_m;
  `;
    const { rows: litRows } = await myPool.query(litologiaSql, [id_pozo]);
    const diamSql = `
    SELECT desde_m, hasta_m, diametro_pulg
    FROM public.intervalo_diametro_perforacion
    WHERE id_pozo = $1
    ORDER BY desde_m;
  `;
    const { rows: diamRows } = await myPool.query(diamSql, [id_pozo]);
    const aporteSql = `
    SELECT profundidad_m
    FROM public.nivel_aporte
    WHERE id_pozo = $1
    ORDER BY profundidad_m;
  `;
    const { rows: aporteRows } = await myPool.query(aporteSql, [id_pozo]);
    return {
        ...pozo,
        litologia: litRows.map((l) => ({
            desde_m: Number(l.desde_m),
            hasta_m: Number(l.hasta_m),
            material: l.material,
        })),
        diametros: diamRows.map((d) => ({
            desde_m: Number(d.desde_m),
            hasta_m: Number(d.hasta_m),
            diametro_pulg: Number(d.diametro_pulg),
        })),
        niveles_aporte: aporteRows.map((a) => ({
            profundidad_m: Number(a.profundidad_m),
        })),
    };
}
//# sourceMappingURL=generar-informe-consultas.js.map