import { Controller, Get, Query, Param, Post, Body, Put, HttpCode, Patch, NotFoundException, UseGuards } from '@nestjs/common';
import { UsersService, User, SessionResponse, UserProfile } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponse } from './users.service';
import { PaginationQueryDto } from 'src/commons/dto/pagination-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ============== Auth ================

  @Post('auth/register')
  @ApiOperation({summary: 'Create User (Register)'})
  @ApiResponse({status: 201, description: 'User created successfully', type: UsersService})
  async userRegister(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.createUser(createUserDto);
  }

  @Post('auth/login')
  @ApiOperation({summary: 'Login user (Auth)'})
  @ApiResponse({status: 201, description: 'User Login successfull', type: UsersService})
  async userLogin(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    return await this.usersService.loginUser(loginUserDto);
  }

  // ========== User ===========

  @Get('profile/:id')
  @ApiOperation({summary: 'Get detailed data of user'})
  @ApiResponse({status: 200, description: 'User data', type: UsersService})
  async getUserById(@Param('id') id: string): Promise<UserProfile | undefined> {
    return await this.usersService.getProfileUserById(id);
  }

  @Put('profile/:id')
  @ApiOperation({summary: 'Update user'})
  @ApiResponse({status: 200, description: 'User information successfully modified', type: UsersService})
  async userUpdate(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @Get('session/:id')
  @ApiOperation({summary: 'Session of User status'})
  @ApiResponse({status: 200, description: 'Session of User status', type: UsersService})
  async getUserSessionId(@Param('id') id: string): Promise<SessionResponse> {
    return await this.usersService.getSessionUserById(id);
  }

  // ========== Admin Users ==========

  @Put('admin/profile/:id')
  @ApiOperation({summary: 'Update user as Admin'})
  @ApiResponse({status: 200, description: 'User information successfully modified', type: UsersService})
  async userAdminUpdate(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.usersService.adminUpdateUser(id, updateUserDto);
  }

  @Patch('admin/:id')
  @ApiOperation({summary: 'Block or Unblock an User as Admin'})
  @ApiResponse({status: 200, description: 'User Blocked / Unblocked', type: UsersService})
  async blockUserAdmin(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.userStatus(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Get('admin')
  @ApiOperation({summary: 'Get detailed data of user as Admin'})
  @ApiResponse({status: 200, description: 'Users data', type: UsersService})
  async getAllUsersAdmin(@Query() paginationQuery: PaginationQueryDto) {
    return await this.usersService.getAllUsers(paginationQuery);
  }

  @Get('admin/:id')
  @ApiOperation({summary: 'Get detailed data of user as Admin'})
  @ApiResponse({status: 200, description: 'User data', type: UsersService})
  async getUserByIdAdmin(@Param('id') id: string): Promise<User | undefined> {
    return await this.usersService.getAdminUserById(id);
  }
}
