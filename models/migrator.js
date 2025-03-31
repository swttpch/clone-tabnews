import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import { ServiceError } from "infra/errors";

const defaultMigrationsOptions = {
  dir: resolve("infra", "migrations"),
  direction: "up",
  log: () => {},
  migrationsTable: "pgmigrations",
};

const dbClientHandler = async (handler) => {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    return await handler(dbClient);
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      message: "Erro na execução das 'migrations'",
      cause: error,
    });
    throw serviceErrorObject;
  } finally {
    await dbClient?.end();
  }
};

async function listPendingMigrations() {
  return await dbClientHandler(async (dbClient) => {
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient,
      dryRun: true,
    });
    return pendingMigrations;
  });
}

async function runPendingMigrations() {
  return await dbClientHandler(async (dbClient) => {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient,
      dryRun: false,
    });
    return migratedMigrations;
  });
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
