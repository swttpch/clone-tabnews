import password from "models/password";
import user from "models/user";
import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";
beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With nonexistent 'username'", async () => {
      const userResponse = await fetch(
        "http://localhost:3000/api/v1/users/nonexistent",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "NovoUsername",
          }),
        },
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
    test("With duplicated 'username'", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
          email: "user1@email.com",
          password: "123abc",
        }),
      });

      expect(user1Response.status).toBe(201);

      const user2Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user2",
          email: "user2@email.com",
          password: "123abc",
        }),
      });

      expect(user2Response.status).toBe(201);

      const response = await fetch("http://localhost:3000/api/v1/users/user2", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
        }),
      });

      expect(response.status).toBe(400);

      const nextResponseBody = await response.json();
      expect(nextResponseBody).toEqual({
        name: "ValidationError",
        message: "O username informado já está sendo utilizado",
        action: "Utilize outro username para esta operação.",
        status_code: 400,
      });
    });
    test("With duplicated 'email'", async () => {
      const email1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "email1",
          email: "email1@email.com",
          password: "123abc",
        }),
      });

      expect(email1Response.status).toBe(201);

      const email2Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "email2",
          email: "email2@email.com",
          password: "123abc",
        }),
      });

      expect(email2Response.status).toBe(201);

      const response = await fetch(
        "http://localhost:3000/api/v1/users/email2",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "email1@email.com",
          }),
        },
      );

      expect(response.status).toBe(400);

      const nextResponseBody = await response.json();
      expect(nextResponseBody).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo utilizado",
        action: "Utilize outro email para esta operação.",
        status_code: 400,
      });
    });

    test("should return success on change case of 'username'", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "userName1",
          email: "username1@test.br",
          password: "senha123",
        }),
      });
      expect(user1Response.status).toEqual(201);

      const response = await fetch(
        "http://localhost:3000/api/v1/users/username1",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "UserName1",
          }),
        },
      );

      expect(response.status).toEqual(200);
    });
    test("With unique 'username'", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "uniqueuser1",
          email: "uniqueuser1@email.com",
          password: "123abc",
        }),
      });

      expect(user1Response.status).toBe(201);

      const response = await fetch(
        "http://localhost:3000/api/v1/users/uniqueuser1",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "uniqueuser2",
          }),
        },
      );

      expect(response.status).toBe(200);

      const nextResponseBody = await response.json();
      expect(nextResponseBody).toEqual({
        id: nextResponseBody.id,
        username: "uniqueuser2",
        email: "uniqueuser1@email.com",
        password: nextResponseBody.password,
        created_at: nextResponseBody.created_at,
        updated_at: nextResponseBody.updated_at,
      });

      expect(uuidVersion(nextResponseBody.id)).toBe(4);
      expect(Date.parse(nextResponseBody.created_at)).not.toBeNaN();
      expect(Date.parse(nextResponseBody.updated_at)).not.toBeNaN();

      expect(nextResponseBody.updated_at > nextResponseBody.created_at).toBe(
        true,
      );
    });
    test("With unique 'email'", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "uniqueemail1",
          email: "uniqueemail1@email.com",
          password: "123abc",
        }),
      });

      expect(user1Response.status).toBe(201);

      const response = await fetch(
        "http://localhost:3000/api/v1/users/uniqueemail1",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "uniqueemail2@email.com",
          }),
        },
      );

      expect(response.status).toBe(200);

      const nextResponseBody = await response.json();
      expect(nextResponseBody).toEqual({
        id: nextResponseBody.id,
        username: "uniqueemail1",
        email: "uniqueemail2@email.com",
        password: nextResponseBody.password,
        created_at: nextResponseBody.created_at,
        updated_at: nextResponseBody.updated_at,
      });

      expect(uuidVersion(nextResponseBody.id)).toBe(4);
      expect(Date.parse(nextResponseBody.created_at)).not.toBeNaN();
      expect(Date.parse(nextResponseBody.updated_at)).not.toBeNaN();

      expect(nextResponseBody.updated_at > nextResponseBody.created_at).toBe(
        true,
      );
    });

    test("With new 'password'", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "newpassword1",
          email: "newpassword1@email.com",
          password: "newpassword1",
        }),
      });

      expect(user1Response.status).toBe(201);

      const response = await fetch(
        "http://localhost:3000/api/v1/users/newpassword1",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: "newpassword2",
          }),
        },
      );

      expect(response.status).toBe(200);

      const nextResponseBody = await response.json();
      expect(nextResponseBody).toEqual({
        id: nextResponseBody.id,
        username: "newpassword1",
        email: "newpassword1@email.com",
        password: nextResponseBody.password,
        created_at: nextResponseBody.created_at,
        updated_at: nextResponseBody.updated_at,
      });

      expect(uuidVersion(nextResponseBody.id)).toBe(4);
      expect(Date.parse(nextResponseBody.created_at)).not.toBeNaN();
      expect(Date.parse(nextResponseBody.updated_at)).not.toBeNaN();

      expect(nextResponseBody.updated_at > nextResponseBody.created_at).toBe(
        true,
      );

      const userInDatabase = await user.findOneByUsername("newpassword1");
      console.log(userInDatabase);
      const correctPasswordMatch = await password.compare(
        "newpassword2",
        userInDatabase.password,
      );

      const incorrectPasswordMatch = await password.compare(
        "newpassword1",
        userInDatabase.password,
      );

      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });
  });
});
