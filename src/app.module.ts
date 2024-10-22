import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ScoresService } from './modules/scores/scores.service';
import { ScoresController } from './modules/scores/scores.controller';
import { ScoresModule } from './modules/scores/scores.module';
@Module({
  imports: [UsersModule, ScoresModule],
  controllers: [AppController, ScoresController],
  providers: [AppService, ScoresService],
})
export class AppModule {}
