export class UpdateScoresDto {
    readonly playerId: string;
    readonly score: number;
    readonly game: string;
    readonly isActive: boolean;
}