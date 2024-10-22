import { Controller, Get, Query, Param, Post,Body, Put, HttpCode, Patch, NotFoundException } from '@nestjs/common';
import { UsersService, User, SessionResponse } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ScoresService, Score } from '../scores/scores.service';
import { PaginationQueryDto } from 'src/commons/dto/pagination-query.dto';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly scoresService: ScoresService
    ) {}

    // ========== Admin Users ==========
    @Get('admin')
    adminGetAllUsers(@Query() paginationQuery: PaginationQueryDto) {
        return this.usersService.getAllUsers(paginationQuery);
    }

    /* @Put('admin/:id')
    adminUpdateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): User {
        return this.usersService.adminUpdateUser(id, updateUserDto);
    } */
    

    /* @Patch('admin/:id')
    updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): User {
        return this.usersService.updateUser(id, updateUserDto);
    } */

   // ========== User  ==========
    @Get('profile/:id')
    getUserProfileById(@Param('id') id: string ): User | undefined {
        return this.usersService.getProfileUserById(id);
    }
    @Get('session/:id')
    getUserSessionById(@Param('id') id: string): SessionResponse {
    return this.usersService.getSessionUserById(id);
    }

    @Put('profile/:id')
    updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): User {
        return this.usersService.updateUser(id, updateUserDto);
    }

    @Get('scores/:scoreId')
    getScoreById(@Param('scoreId') scoreId: string): Score {
        const score = this.scoresService.getScoreById(scoreId);
        if (!score) {
            throw new NotFoundException(`Score with ID ${scoreId} not found`);
        }
        return score;
    }
    
}
