import { Request } from 'express';
import { User } from 'src/users/schema/user.schema';

export interface CustomExpressRequest extends Request {
  user?: User;
}
