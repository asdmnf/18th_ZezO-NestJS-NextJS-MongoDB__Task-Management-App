import { SetMetadata } from '@nestjs/common';

export const PRIVATE_ROUTE = 'PRIVATE_ROUTE';
export const PrivateRoute = () => SetMetadata(PRIVATE_ROUTE, true);
