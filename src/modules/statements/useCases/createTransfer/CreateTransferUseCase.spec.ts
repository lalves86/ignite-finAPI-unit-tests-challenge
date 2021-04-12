import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateTransferError } from "./CreateTransferError";
import { CreateTransferUseCase } from "./CreateTransferUseCase"

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createTransferUseCase: CreateTransferUseCase;

describe("Create transfer", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createTransferUseCase = new CreateTransferUseCase(
      usersRepository,
      statementsRepository
    );
  })

  it("Should be able to make a transfer between users", async () => {
    const sender = await usersRepository.create({
      email: "test@test.com",
      name: "Sender User",
      password: "test_password",
    });

    const receiver = await usersRepository.create({
      email: "email@email.com",
      name: "Receiver user",
      password: "another_password"
    });

    await statementsRepository.create({
      amount: 100.00,
      description: "Test statement",
      type: OperationType.DEPOSIT,
      user_id: sender.id as string,
    })

    await createTransferUseCase.execute({
      amount: 50.00,
      description: "Test transfer",
      type: OperationType.TRANSFER,
      recipient_id: receiver.id as string,
      sender_id: sender.id as string,
    });

    const rcvrBalbance = await statementsRepository.getUserBalance({
      user_id: receiver.id as string,
    })

    expect(rcvrBalbance.balance).toBe(50.00)
  })

  it("Should not be able to make a transfer from a non-existent sender", async () => {
    const receiver = await usersRepository.create({
      email: "email@email.com",
      name: "Receiver user",
      password: "another_password"
    });

    await expect(createTransferUseCase.execute({
      amount: 50.00,
      description: "Test transfer",
      type: OperationType.TRANSFER,
      recipient_id: receiver.id as string,
      sender_id: "any_sender_id",
    })).rejects.toEqual(new CreateTransferError.UserNotFound())
  })

  it("Should not be able to make a transfer to a non-existent receiver", async () => {
    const sender = await usersRepository.create({
      email: "test@test.com",
      name: "Sender User",
      password: "test_password",
    });

    await expect(createTransferUseCase.execute({
      amount: 50.00,
      description: "Test transfer",
      type: OperationType.TRANSFER,
      recipient_id: "any_receiver_id",
      sender_id: sender.id as string,
    })).rejects.toEqual(new CreateTransferError.ReceiverNotFoundError())
  })

  it("Should not be able to transfer an amount greater than sender's balance", async () => {
    const sender = await usersRepository.create({
      email: "test@test.com",
      name: "Sender User",
      password: "test_password",
    });

    const receiver = await usersRepository.create({
      email: "email@email.com",
      name: "Receiver user",
      password: "another_password"
    });


    await statementsRepository.create({
      amount: 100.00,
      description: "Test statement",
      type: OperationType.DEPOSIT,
      user_id: sender.id as string,
    })

    await expect(createTransferUseCase.execute({
      amount: 200.00,
      description: "Test transfer",
      type: OperationType.TRANSFER,
      recipient_id: receiver.id as string,
      sender_id: sender.id as string,
    })).rejects.toEqual(new CreateTransferError.InsufficientFunds())
  })
})
