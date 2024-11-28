import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Scores } from './scores.schema';
import { CreateScoresDto } from './dto/create-scores.dto';
import { UpdateScoresDto } from './dto/update-scores.dto';

interface Paginator {
  data: Scores[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ScoresService {
  constructor(@InjectModel(Scores.name) private scoreModel: Model<Scores>) {}

  async getAllScores(limit: number = 10, page: number = 1): Promise<Paginator> {
    const skip = (page - 1) * limit;
    const total = await this.scoreModel.countDocuments().exec();
    const totalPages = Math.ceil(total / limit);

    const data = await this.scoreModel
      .find()
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async createScore(createScoreDto: CreateScoresDto) {
    const score = new this.scoreModel(createScoreDto);
    return score.save();
  }

  async getScoreById(scoreId: string): Promise<Scores> {
    const score = await this.scoreModel
      .findOne({ scoreId })
      .select({ scoreId: 1, _id: 0, game: 1, score: 1 });

    if (!score) {
      throw new NotFoundException('Score not found');
    }
    return score;
  }

  async updateScore(scoreId: string, updateScoreDto: UpdateScoresDto): Promise<Scores> {
    const updatedScore = await this.scoreModel.findOneAndUpdate(
      { scoreId },
      updateScoreDto,
      { new: true }
    );

    if (!updatedScore) {
      throw new NotFoundException('Score not found');
    }
    return updatedScore;
  }

  async leaderBoard(limit: number = 10): Promise<Scores[]> {
    return this.scoreModel
      .find()
      .sort({ score: -1 }) // Order Max - Min
      .limit(limit)
      .exec();
  }

  async scoreStatus(scoreId: string): Promise<Scores> {
    const score = await this.scoreModel.findOne({ scoreId });

    if (!score) {
      throw new NotFoundException('Score not found');
    }

    score.isActive = !score.isActive;
    await score.save();
    return score;
  }

  async adminUpdateScore(scoreId: string, updateScoreDto: UpdateScoresDto): Promise<Scores> {
    const updatedScore = await this.scoreModel.findOneAndUpdate(
      { scoreId },
      updateScoreDto,
      { new: true }
    );

    if (!updatedScore) {
      throw new NotFoundException('Score not found');
    }
    return updatedScore;
  }

  async getAdminScoreById(scoreId: string): Promise<Scores> {
    const score = await this.scoreModel.findOne({ scoreId });

    if (!score) {
      throw new NotFoundException('Score not found');
    }
    return score;
  }
}
