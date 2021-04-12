import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { ICreateTransferDTO } from "../../dtos/ICreateTransferDTO";
import { OperationType } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferError"

@injectable()
class CreateTransferUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    amount,
    description,
    type,
    recipient_id,
    sender_id
  }: ICreateTransferDTO): Promise<void> {
    const sender = await this.usersRepository.findById(sender_id);

    if (!sender) {
      throw new CreateTransferError.UserNotFound();
    }

    const receiver = await this.usersRepository.findById(recipient_id);

    if (!receiver) {
      throw new CreateTransferError.ReceiverNotFoundError();
    }

    let { balance } = await this.statementsRepository.getUserBalance({
      user_id: sender_id
    });

    if (balance < amount) {
      throw new CreateTransferError.InsufficientFunds();
    }

    await this.statementsRepository.create({
      amount,
      description,
      type: OperationType.WITHDRAW,
      user_id: sender_id,
    })

    await this.statementsRepository.create({
      amount,
      description,
      type: OperationType.DEPOSIT,
      user_id: recipient_id,
    })
  }
}

export { CreateTransferUseCase }
