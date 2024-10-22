import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { ScoresService } from '../scores/scores.service';
import { UsersController } from './users.controller';
import { AuthController } from '../auth/auth.controller';
import { ScoresModule } from '../scores/scores.module';

@Module({
  imports: [ScoresModule],
  providers: [UsersService, ScoresService],
  controllers: [UsersController, AuthController]
})

export class UsersModule {}
