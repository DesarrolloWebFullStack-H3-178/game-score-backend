export class CreateScoreDto {
    readonly playerId: string;
    readonly score: number;
    readonly game: string;
    readonly isActive: boolean;
}