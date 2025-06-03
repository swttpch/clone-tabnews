import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";
beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "MesmoCase",
          email: "mesmo.case@email.com",
          password: "123abc",
        }),
      });

      expect(response.status).toBe(201);

      const userResponse = await fetch(
        "http://localhost:3000/api/v1/users/MesmoCase",
      );

      expect(userResponse.status).toBe(200);
      const userResponseBody = await userResponse.json();

      expect(userResponseBody).toEqual({
        id: userResponseBody.id,
        username: "MesmoCase",
        email: "mesmo.case@email.com",
        password: userResponseBody.password,
        created_at: userResponseBody.created_at,
        updated_at: userResponseBody.updated_at,
      });

      expect(uuidVersion(userResponseBody.id)).toBe(4);
      expect(Date.parse(userResponseBody.created_at)).not.toBeNaN();
      expect(Date.parse(userResponseBody.updated_at)).not.toBeNaN();
    });
    test("With case mismatch", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "DiferenteCase",
          email: "diferente.case@email.com",
          password: "123abc",
        }),
      });

      expect(response.status).toBe(201);

      const userResponse = await fetch(
        "http://localhost:3000/api/v1/users/diferentecase",
      );

      expect(userResponse.status).toBe(200);

      const userResponseBody = await userResponse.json();

      expect(userResponseBody).toEqual({
        id: userResponseBody.id,
        username: "DiferenteCase",
        email: "diferente.case@email.com",
        password: userResponseBody.password,
        created_at: userResponseBody.created_at,
        updated_at: userResponseBody.updated_at,
      });

      expect(uuidVersion(userResponseBody.id)).toBe(4);
      expect(Date.parse(userResponseBody.created_at)).not.toBeNaN();
      expect(Date.parse(userResponseBody.updated_at)).not.toBeNaN();
    });
    test("With nonexistent username", async () => {
      const userResponse = await fetch(
        "http://localhost:3000/api/v1/users/nonexistent",
      );

      expect(userResponse.status).toBe(404);
      const nextResponseBody = await userResponse.json();
      expect(nextResponseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
        status_code: 404,
      });
    });
  });
});
