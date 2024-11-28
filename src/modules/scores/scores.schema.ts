import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';

@Schema()
export class Scores extends Document {
  
  @Prop()
  scoreId: string;

  @Prop()
  playerId: string;

  @Prop()
  game: string;

  @Prop()
  score: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  createdAt: string;
  
}

export const ScoreSchema = SchemaFactory.createForClass(Scores);
