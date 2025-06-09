export interface EmailPayload {
  id: string;
  to: string;
  subject: string;
  body: string;
}

export enum EmailStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}