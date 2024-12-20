export class CreateUserDto {
    readonly name: string;
    readonly username: string;
    readonly email: string;
    readonly password: string;
    readonly roles: string[];
    readonly avatar: string;
    readonly isActive: boolean;
  }