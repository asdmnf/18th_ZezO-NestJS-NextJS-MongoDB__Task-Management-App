import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose({ name: 'id' })
  readonly _id: string;

  readonly name: string;

  readonly email: string;

  @Exclude()
  readonly password: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
