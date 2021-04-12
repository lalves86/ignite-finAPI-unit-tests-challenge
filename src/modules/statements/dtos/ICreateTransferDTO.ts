import { OperationType } from "../entities/Statement";

export interface ICreateTransferDTO {
  amount: number
  description: string
  type: OperationType
  recipient_id: string
  sender_id: string
}
