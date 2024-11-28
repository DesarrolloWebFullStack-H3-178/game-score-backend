import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.service';

@Injectable()
export class AuthService {

  constructor(private userService: UsersService, private jwtService: JwtService) {
  }

  validateUser(email: string, password: string) {
    const user = this.userService.validateUser(email, password);
    if(user) {
      return user;
    }
    return null;
  }

  login(email: string, password: string) {
    const payload = { email: email, id: "bd587f7c-408c-46d0-9eb4-b24c22c09fb2", roles: ['admin'] };
    return {
      token: this.jwtService.sign(payload),
      user: payload // Temporal, eliminar
    }
  }
}