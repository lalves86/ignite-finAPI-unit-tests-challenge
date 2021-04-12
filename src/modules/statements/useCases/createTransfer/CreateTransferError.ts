import { AppError } from "../../../../shared/errors/AppError";

export namespace CreateTransferError {
  export class UserNotFound extends AppError {
    constructor() {
      super('User not found', 404);
    }
  }

  export class ReceiverNotFoundError extends AppError {
    constructor() {
      super('Receiver id not found', 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super('Insufficient funds', 400);
    }
  }
}
