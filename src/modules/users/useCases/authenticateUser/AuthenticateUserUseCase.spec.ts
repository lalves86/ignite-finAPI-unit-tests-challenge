import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("Should be able to authenticate an user", async () => {
    const user = {
      name: "Test User",
      email: "test@test.com",
      password: "test_password",
    }

    await createUserUseCase.execute(user);

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: "test@test.com",
      password: "test_password",
    });

    expect(authenticatedUser).toHaveProperty("token");
  })

  it("Should not be able to authenticate with wrong e-mail", async () => {
    const user = {
      name: "Test User",
      email: "test@test.com",
      password: "test_password",
    }

    await createUserUseCase.execute(user);

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "wrong@test.com",
        password: "test_password",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  })

  it("Should not be able to authenticate with wrong password", async () => {
    const user = {
      name: "Test User",
      email: "test@test.com",
      password: "test_password",
    }

    await createUserUseCase.execute(user);

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "test@test.com",
        password: "wrong_password",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  })
})
