import { IsNumber } from "class-validator";

export class NewSubDto {
    @IsNumber()
    public partId: number;
}

export class DeleteSubDto {
    @IsNumber()
    public subId: number;
}