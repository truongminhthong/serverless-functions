import IBaseModel from "../../libs/base.model";

export default interface IUser  extends IBaseModel {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}