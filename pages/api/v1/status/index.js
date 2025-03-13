import { createRouter } from "next-connect";
import { InternalServerError, MethodNotAllowedError } from "infra/errors";
import database from "infra/database.js";

const router = createRouter();

router.get(getHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(error, request, response) {
  const publicErrorObject = new InternalServerError({
    cause: error,
  });

  console.log("\n Error dentro do onErrorHandler do next-connect:");
  console.error(publicErrorObject);

  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

async function getHandler(request, response) {
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
}
