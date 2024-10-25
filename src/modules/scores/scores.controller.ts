import { Controller, Get, Query, Param, Post,Body, Put, HttpCode, Patch, NotFoundException } from '@nestjs/common';
import { ScoresService, Score } from './scores.service';
import { UpdateScoreDto } from './dto/update-score.dto';
import { CreateScoreDto } from './dto/create-score.dto';
import { PaginationQueryDto } from 'src/commons/dto/pagination-query.dto';

@Controller('scores')
export class ScoresController {
    constructor(private readonly scoresService: ScoresService) {}

    // ============== Score ================

    @Get('admin')
        getAllScoresAdmin(@Query() paginationQuery: PaginationQueryDto) {
        return this.scoresService.getAllScores(paginationQuery);
    }

    @Get('leaderboard')
        getScoresLeaderboard(@Query() PaginationQuery: PaginationQueryDto) {
        return this.scoresService.getAllScores(PaginationQuery);
    }
    @Put(':scoreId')
        updateScore(@Param('scoreId') id: string, @Body() UpdateScoreDto: UpdateScoreDto): Score {
        return this.scoresService.updateScore(id, UpdateScoreDto);
        }

    @Get(':scoreId')
        getScoreById(@Param('scoreId') scoreId: string): Score {
        return this.scoresService.getScoreById(scoreId);
    }

   @Post()
        createScore(@Body() CreateScoreDto: CreateScoreDto): Score {
        return this.scoresService.createScore(CreateScoreDto);
    }

    // ======= Admin ===========

    @Patch('admin/:scoreId')
        blockScoreByIdAdmin(@Param('scoreId') id: string): Score {
        const score = this.scoresService.scoreStatus(id);
        if (!score) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return score;
    }

    @Put('admin/:id')
        adminUpdateScore(@Param('id') id: string, @Body() UpdateScoreDto: UpdateScoreDto): Score {
        return this.scoresService.adminUpdateScore(id, UpdateScoreDto);
    }

    @Get('admin/:scoreId')
    getAdminScoreById(@Param('id') id: string ): Score | undefined {
        return this.scoresService.getAdminScoreById(id);
    }
}
