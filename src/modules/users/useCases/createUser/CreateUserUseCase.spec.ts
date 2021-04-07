import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("Should be able to create an user", async () => {
    const user = {
      name: "Test User",
      email: "test@test.com",
      password: "password_test"
    }

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

    expect(userCreated).toHaveProperty("id");
  })

  it("Should not be able to create two users with the same e-mail", async () => {
    await expect(async () => {
      await createUserUseCase.execute({
        name: "Test User 1",
        email: "test@test.com",
        password: "password_test"
      })

      await createUserUseCase.execute({
        name: "Test User 2",
        email: "test@test.com",
        password: "password_test"
      })
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
