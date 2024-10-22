import { Controller, Post, Body } from '@nestjs/common';
import { UsersService, User, LoginResponse } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Controller('auth')
export class AuthController {
    
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    register(@Body() createUserDto: CreateUserDto): User {
        return this.usersService.createUser(createUserDto);
    }

    @Post('login')
    login(@Body() loginUserDto: LoginUserDto): LoginResponse {
        return this.usersService.loginUser(loginUserDto);
    }
}
