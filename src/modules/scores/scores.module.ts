import { Module } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoresController } from './scores.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Scores, ScoreSchema } from './scores.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Scores.name, schema: ScoreSchema }]),
      ],
    providers: [ScoresService],
    controllers: [ScoresController]
})

export class ScoresModule {}
