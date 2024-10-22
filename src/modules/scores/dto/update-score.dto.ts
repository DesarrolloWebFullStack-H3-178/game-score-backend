export class UpdateScoreDto {
    readonly playerId: string;
    readonly score: number;
    readonly game: string;
    readonly isActive: boolean;
}