import { IsNotEmpty, IsString, Length, IsEmail } from "class-validator";

export default class RegisterRequest {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6)
  public password: string;

  @IsString()
  @IsNotEmpty()
  public fullName: string;

  @IsString()
  @IsNotEmpty()
  public phoneNumber: string;
}