import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";
import user from "models/user.js";
import password from "models/password.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "swttpch",
          email: "contact@email.com",
          password: "123abc",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "swttpch",
        email: "contact@email.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const userInDatabase = await user.findOneByUsername("swttpch");
      const correctPasswordMatch = await password.compare(
        "123abc",
        userInDatabase.password,
      );

      const incorrectPasswordMatch = await password.compare(
        "SenhaErrada",
        userInDatabase.password,
      );

      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });
    test("With duplicated 'email'", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado1",
          email: "duplicado@email.com",
          password: "123abc",
        }),
      });

      expect(response.status).toBe(201);

      const nextResponse = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado2",
          email: "Duplicado@email.com",
          password: "123abc",
        }),
      });

      expect(nextResponse.status).toBe(400);

      const nextResponseBody = await nextResponse.json();
      expect(nextResponseBody).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo utilizado",
        action: "Utilize outro email para esta operação.",
        status_code: 400,
      });
    });
    test("With duplicated 'username'", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "duplicado",
          email: "usernameduplicado1@email.com",
          password: "123abc",
        }),
      });

      expect(response.status).toBe(201);

      const nextResponse = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Duplicado",
          email: "usernameduplicado2@email.com",
          password: "123abc",
        }),
      });

      expect(nextResponse.status).toBe(400);

      const nextResponseBody = await nextResponse.json();
      expect(nextResponseBody).toEqual({
        name: "ValidationError",
        message: "O username informado já está sendo utilizado",
        action: "Utilize outro username para esta operação.",
        status_code: 400,
      });
    });
  });
});
