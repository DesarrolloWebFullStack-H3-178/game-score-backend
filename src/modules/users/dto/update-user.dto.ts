export class UpdateUserDto {
    readonly name: string;
    readonly username: string;
    readonly email: string;
    readonly password: string;
    readonly role: string;
    readonly avatar: string;
    readonly isActive: boolean;
  }