import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase

describe("Show user profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  })

  it("Should be able to list the user profile", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Test Name",
      email: "test@test.com",
      password: "test_password"
    })

    const list = await showUserProfileUseCase.execute(user.id as string)

    expect(list).toEqual(user)
  })

  it("Should not be able to list a non-existing user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("non_existing_user_id")
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})
