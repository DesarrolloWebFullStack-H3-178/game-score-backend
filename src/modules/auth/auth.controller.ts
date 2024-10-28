import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

export interface User {
  email: string;
  password: string;
  id: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() { email, password }: { email: string; password: string }) {
    return this.authService.login(email, password);
  }
}