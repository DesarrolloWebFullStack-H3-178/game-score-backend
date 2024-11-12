import { Controller, Get, Query, Param, Post,Body, Put, HttpCode, Patch, NotFoundException, UseGuards } from '@nestjs/common';
import { UsersService, User, SessionResponse } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponse } from './users.service';
import { PaginationQueryDto } from 'src/commons/dto/pagination-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // ============== Auth ================

    @Post('auth/register')
        userRegister(@Body() createUserDto: CreateUserDto): User {
        return this.usersService.createUser(createUserDto);
    }   
    @Post('auth/login')
        userLogin(@Body() loginUserDto: LoginUserDto): LoginResponse {
        return this.usersService.loginUser(loginUserDto);
    }

    // ========== User ===========
    @Get('profile/:id')
        getUserById(@Param('id') id: string ): User | undefined {
        return this.usersService.getProfileUserById(id);
    }

    @Put('profile/:id')
        userUpdate(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): User {
        return this.usersService.updateUser(id, updateUserDto);
    }

    @Get('session/:id')
        getUserSessionId(@Param('id') id: string): SessionResponse {
        return this.usersService.getSessionUserById(id);
    }

    // ========== Admin Users ==========

    @Put('admin/profile/:id')
        userAdminUpdate(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): User {
        return this.usersService.adminUpdateUser(id, updateUserDto);
    }

    @Patch('admin/:id')
        blockUserAdmin(@Param('id') id: string): User {
        const user = this.usersService.userStatus(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    
    @Get('admin')
    getAllUsersAdmin(@Query() paginationQuery: PaginationQueryDto) {
        return this.usersService.getAllUsers(paginationQuery);
    }
    
    /* @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Admin') */
    @Get('admin/:id')
        getUserByIdAdmin(@Param('id') id: string ): User | undefined {
        return this.usersService.getAdminUserById(id);
    }
}
