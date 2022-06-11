import { IsNotEmpty, IsString, Length, IsEmail, IsOptional } from "class-validator";

export default class GetUserRequest {
  @IsString()
  @IsOptional()
  public email: string;

  @IsString()
  @IsOptional()
  public fullName: string;

  @IsString()
  @IsOptional()
  public phoneNumber: string;
}