import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase

describe("Create statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    )
  })

  it("Should be able to create a statement", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Test Name",
      email: "test@test.com",
      password: "test_password"
    })

    const statement = await createStatementUseCase.execute({
      amount: 100.00,
      description: "Test description",
      type: OperationType.DEPOSIT,
      user_id: user.id as string
    })

    expect(statement.user_id).toEqual(user.id)
  })

  it("Should not be able to create a statement from a non-existent user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        amount: 100.00,
        description: "Test description",
        type: OperationType.DEPOSIT,
        user_id: "non_existent_user_id"
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it("Should not be able to withdraw with insufficient funds", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Test Name",
      email: "test@test.com",
      password: "test_password"
    })

    expect(async () => {
      await createStatementUseCase.execute({
        amount: 100.00,
        description: "Test description",
        type: OperationType.WITHDRAW,
        user_id: user.id as string
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})
