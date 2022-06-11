import { IsNotEmpty, IsString, IsOptional, IsUrl, IsEmail } from "class-validator";

export default class UpdateUserRequest {
  @IsString()
  @IsEmail()
  @IsOptional()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  public fullName: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  public phoneNumber: string;
}