SELECT
  (SELECT count(id)::int FROM places) AS total,
  count(ad_rows.*)::int AS count,
  ${offset} AS offset,
  json_agg(row_to_json(ad_rows)) AS results
  FROM (SELECT * FROM places ORDER BY name DESC LIMIT ${limit} OFFSET ${offset}) ad_rows
