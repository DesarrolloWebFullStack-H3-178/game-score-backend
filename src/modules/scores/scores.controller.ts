import { Controller, Get, Query, Param, Post, Body, Put, Patch, NotFoundException } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { Scores } from './scores.schema';
import { UpdateScoresDto } from './dto/update-scores.dto';
import { CreateScoresDto } from './dto/create-scores.dto';
import { PaginationQueryDto } from 'src/commons/dto/pagination-query.dto';
import {ApiTags, ApiOperation, ApiResponse} from '@nestjs/swagger';

@ApiTags('Scores')
@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  // ============== Score ================

  @Get('admin')
  @ApiOperation({summary: 'Get the list of All Scores as Admin'})
  @ApiResponse({status: 201, description: 'List users with highest scores', type: Scores} )
  async getAllScoresAdmin(@Query() paginationQuery: PaginationQueryDto): Promise<{ data: Scores[], total: number, page: number, limit: number, totalPages: number }> {
    return this.scoresService.getAllScores(paginationQuery.limit, paginationQuery.page);
  }

  @Get('leaderboard')
  @ApiOperation({summary: 'Get the list of best players'})
  @ApiResponse({status: 200, description: 'List users with highest scores', type: Scores} )
  async leaderBoard(@Query('limit') limit: string): Promise<Scores[]> {
    const topScoresLimit = parseInt(limit, 10) || 10;
    return this.scoresService.leaderBoard(topScoresLimit);
  }

  @Put(':scoreId')
  @ApiOperation({summary: 'Update data for one score'})
  @ApiResponse({status: 200, description: 'Score Blocked / Unblocked', type: Scores} )
  async updateScore(@Param('scoreId') id: string, @Body() updateScoreDto: UpdateScoresDto): Promise<Scores> {
    return this.scoresService.updateScore(id, updateScoreDto);
  }

  @Get(':scoreId')
  @ApiOperation({summary: 'get Score by Id'})
  @ApiResponse({status: 200, description: 'Get One Score', type: Scores} )
  async getScoreById(@Param('scoreId') scoreId: string): Promise<Scores> {
    return this.scoresService.getScoreById(scoreId);
  }

  @Post()
  @ApiOperation({summary: 'Create a score to an User'})
  @ApiResponse({status: 201, description: 'Score created successfully', type: Scores} )
  async createScore(@Body() createScoreDto: CreateScoresDto): Promise<Scores> {
    return this.scoresService.createScore(createScoreDto);
  }

  // ======= Admin ===========

  @Patch('admin/:scoreId')
  @ApiOperation({summary: 'Block or Unblock an Score as Admin'})
  @ApiResponse({status: 200, description: 'Score Blocked / Unblocked', type: Scores} )
  async blockScoreByIdAdmin(@Param('scoreId') id: string): Promise<Scores> {
    const score = await this.scoresService.scoreStatus(id);
    if (!score) {
      throw new NotFoundException(`Score with ID ${id} not found`);
    }
    return score;
  }

  @Put('admin/:id')
  @ApiOperation({summary: 'Update data for one score as Admin permissions'})
  @ApiResponse({status: 200, description: 'Score Blocked / Unblocked', type: Scores} )
  async adminUpdateScore(@Param('id') id: string, @Body() updateScoreDto: UpdateScoresDto): Promise<Scores> {
    return this.scoresService.adminUpdateScore(id, updateScoreDto);
  }

  @Get('admin/:id')
  @ApiOperation({summary: 'Block or Unblock an Score as Admin'})
  @ApiResponse({status: 200, description: 'Score Blocked / Unblocked', type: Scores} )
  async getAdminScoreById(@Param('id') id: string): Promise<Scores> {
    return this.scoresService.getAdminScoreById(id);
  }
}
