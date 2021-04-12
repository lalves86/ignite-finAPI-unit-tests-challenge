import { Request, Response } from "express";
import { container } from "tsyringe";
import { OperationType } from "../../entities/Statement";
import { CreateTransferUseCase } from "./CreateTransferUseCase";

class CreateTransferController {

  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { recipient_id } = request.params;
    const { amount, description } = request.body;

    const createTransferUseCase = container.resolve(CreateTransferUseCase);

    await createTransferUseCase.execute({
      amount,
      description,
      recipient_id,
      sender_id: id,
      type: OperationType.TRANSFER
    });

    return response.send();
  }
}

export { CreateTransferController }
