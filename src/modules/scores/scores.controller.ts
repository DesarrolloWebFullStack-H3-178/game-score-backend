import { Controller, Get, Query, Param, Post,Body, Put, HttpCode, Patch } from '@nestjs/common';
import { ScoresService, Score } from './scores.service';
import { UpdateScoreDto } from './dto/update-score.dto';
import { PaginationQueryDto } from 'src/commons/dto/pagination-query.dto';
import { CreateScoreDto } from './dto/create-score.dto';

@Controller('scores')
export class ScoresController {
    constructor(private readonly scoresService: ScoresService) {}
   @Get('leaderboard')
   getAllScores(@Query() PaginationQuery: PaginationQueryDto) {
    return this.scoresService.getAllScores(PaginationQuery);
   }

   @Get(':scoreId')
    getScoreById(@Param('scoreId') scoreId: string): Score {
        return this.scoresService.getScoreById(scoreId);
    }

   @Post()
    register(@Body() CreateScoreDto: CreateScoreDto): Score {
        return this.scoresService.createScore(CreateScoreDto);
    }





}
