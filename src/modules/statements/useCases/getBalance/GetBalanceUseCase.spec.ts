import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceUseCase } from "./GetBalanceUseCase"
import { OperationType } from "../../entities/Statement";
import { GetBalanceError } from "./GetBalanceError";

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let getBalanceUseCase: GetBalanceUseCase

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    )
  })

  it("Should be able to get the balance of an user", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Test User",
      email: "email@email.com",
      password: "test_password",
    })

    const statement = await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      amount: 100.00,
      description: "Test Statement",
      type: OperationType.DEPOSIT
    })

    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string,
    })

    expect(balance.statement).toEqual([statement])
  })

  it("Should not be able to get the balance of non-existing user", () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "non-existing-id"
      })
    }).rejects.toBeInstanceOf(GetBalanceError)
  })
})
