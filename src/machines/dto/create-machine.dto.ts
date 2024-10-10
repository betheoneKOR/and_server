import { IsNumber, IsString } from "class-validator";

export class CreateMachineDto {
    @IsString()
    machineName: string;

    @IsString()
    modelYear: string;

    @IsNumber()
    machineNumber: number;
}
