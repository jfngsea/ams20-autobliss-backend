import { IsCreditCard, IsNumber, IsPostalCode, IsString, IsUUID, Max } from "class-validator";

export class NewCardDto {
    @IsString()
    cardName: string;

    @IsCreditCard()
    cardNumber: string;

    @IsNumber()
    @Max(12)
    expMonth: number;

    @IsNumber()
    expYear: number;

    @IsNumber()
    cvv: number
}

export class NewAddressDto {
    @IsString()
    name: string;

    @IsString()
    address: string;

    @IsPostalCode("PT")
    zipCode: string;

    @IsString()
    city: string;
}

export class DelUserDataDto {
    @IsString()
    @IsUUID()
    id: string
}

