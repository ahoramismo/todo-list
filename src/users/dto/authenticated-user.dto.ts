import { IsUUID, IsString } from 'class-validator';

export class AuthenticatedUserDto {
  @IsUUID()
  id: string;

  @IsString()
  username: string;
}
