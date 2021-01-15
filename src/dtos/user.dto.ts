import { IsNumberString, IsPostalCode, IsString, IsUUID } from "class-validator";

export class NewCardDto {
    @IsString()
    cardName: string;

    //@IsCreditCard()
    @IsNumberString()
    cardNumber: string;

    @IsNumberString()
    expMonth: number;

    @IsNumberString()
    expYear: number;

    @IsNumberString()
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

