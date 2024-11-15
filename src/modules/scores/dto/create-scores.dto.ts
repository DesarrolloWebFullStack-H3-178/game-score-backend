export class CreateScoresDto {
    readonly playerId: string;
    readonly score: number;
    readonly game: string;
    readonly isActive: boolean;
}