import { UUID, ISODateString } from './shared';

//Account entity in Charon
export interface Account {
  //A system account with comprehensive validation
  id: UUID; //Unique identifier for the account
  nameGiven: string; //Given name supporting international characters
  nameMiddle: string; //Middle name supporting international characters
  nameFamily: string; //Family name supporting international characters
  email: string; //Email address of the account
  phone: string; //Phone number in international format
  createdAt: ISODateString; //Timestamp when the account was created
  updatedAt: ISODateString; //Timestamp when the account was last updated
}
