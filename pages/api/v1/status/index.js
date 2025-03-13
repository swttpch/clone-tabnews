import { InternalServerError } from "infra/errors";
import database from "infra/database.js";

async function status(request, response) {
  try {
    const updatedAt = new Date().toISOString();
    const version = await database
      .query("SHOW server_version;")
      .then((res) => res.rows[0].server_version);
    const maxConnections = await database
      .query("SHOW max_connections;")
      .then((res) => res.rows[0].max_connections);

    const databaseName = process.env.POSTGRES_DB;
    const activeConnections = await database
      .query({
        text: `SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;`,
        values: [databaseName],
      })
      .then((res) => res.rows[0]);
    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: version,
          max_connections: parseInt(maxConnections),
          opened_connections: activeConnections.count,
        },
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });

    console.log("\n Error dentro do catch do controller: ");
    console.error(publicErrorObject);

    response.status(500).json(publicErrorObject);
  }
}
export default status;
