import { IsNumber } from "class-validator";

export class SubDto {
    @IsNumber()
    public partId: number;
}