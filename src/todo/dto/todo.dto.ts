import { IsOptional, IsString } from "class-validator";

export class CreateTodoDto {
    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    complete: boolean;
}

export class UpdateTodoDto {
    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    complete: boolean;
}


