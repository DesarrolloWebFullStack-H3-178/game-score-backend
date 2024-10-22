import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PaginationQueryDto } from 'src/commons/dto/pagination-query.dto';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';

export interface Score {
    scoreId: string;
    playerId: string;
    score: number;
    game: string;
    isActive: boolean;
}

export interface Paginator {
    data: [];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }

@Injectable()
export class ScoresService {
    private scores: Score[] = [];

    constructor() {
        this.generateMockScoresData();
    }

    private generateMockScoresData(): void {
        for (let i = 0; i < 1000; i++) {
            this.scores.push({
              scoreId: uuidv4(),
              playerId: uuidv4(),
              score: faker.number.int() * i,
              game: faker.helpers.arrayElement(['FIFA', 'Call Of Duty', 'Mortal Kombat', 'Final Fantasy', 'Crash']),
              isActive: true,
            });
        }
    }

    getAllScores(paginationQuery: PaginationQueryDto): Paginator {
        const { limit = 10, page = 1 } = paginationQuery;
        const start = (page - 1) * limit;
        const end = start + limit;
        const data = this.scores.slice(start, end);
        const total = this.scores.length;
        const totalPages = Math.ceil(total / limit);
        
        return <Paginator>{
            data,
            total,
            page,
            limit,
            totalPages,
        }
    }

    getScoreById(scoreId: string): Score {
        return this.scores.find(score => score.scoreId === scoreId);
    }

    createScore(CreateScoreDto: CreateScoreDto): Score {
        const newScore = {scoreId: faker.string.uuid(), ...CreateScoreDto};
        this.scores.push(newScore);
        return newScore;
    }

    updateScore(id: string, UpdateScoreDto: UpdateScoreDto): Score {
        const scoreIndex = this.scores.findIndex(Scores => Scores.scoreId === id);
        if (scoreIndex === -1) {
          return null;
        }
    
        this.scores[scoreIndex] = {...this.scores[scoreIndex], ...this.updateScore};
        return this.scores[scoreIndex];
      }

   
}
