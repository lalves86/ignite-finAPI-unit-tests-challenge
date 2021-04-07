import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let getStatementOperationUseCase: GetStatementOperationUseCase

describe("Get statement operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    )
  })

  it("Should be able to get statement operation", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Test Name",
      email: "test@test.com",
      password: "test_password"
    })

    const statement = await inMemoryStatementsRepository.create({
      amount: 100.00,
      description: "Test description",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    })

    const result = await getStatementOperationUseCase.execute({
      statement_id: statement.id as string,
      user_id: user.id as string,
    })

    expect(result).toEqual(statement)
  })

  it("Should not be able to get statement from a non-existent user", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Test Name",
      email: "test@test.com",
      password: "test_password"
    })

    const statement = await inMemoryStatementsRepository.create({
      amount: 100.00,
      description: "Test description",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    })

    expect(async () => {
      await getStatementOperationUseCase.execute({
        statement_id: statement.id as string,
        user_id: "non_existent_user_id",
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError)
  })

  it("Should not be able to get non-existent statement", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Test Name",
      email: "test@test.com",
      password: "test_password"
    })

    const statement = await inMemoryStatementsRepository.create({
      amount: 100.00,
      description: "Test description",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    })

    expect(async () => {
      await getStatementOperationUseCase.execute({
        statement_id: "non_existing_statement_id",
        user_id: user.id as string,
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError)
  })
})
