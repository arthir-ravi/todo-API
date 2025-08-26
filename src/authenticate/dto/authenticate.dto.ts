import { IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDTO{
    
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string; 

    @IsString()
    @IsOptional()
    @IsIn(['user', 'admin'])
    role?: string;
}

export class LoginDTO{

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string; 
}

export class SaveFcmTokenDto {
    @IsString()
    fcmToken: string;
}

