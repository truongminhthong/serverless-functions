import DynamoHepler from "../../libs/dynamo-hepler";
import UtilsService from "../../libs/utils";
import GetUserRequest from "./requests/get-user.request";
import RegisterRequest from "./requests/register.request";
import UpdateUserRequest from "./requests/update.request";
import IUser from "./user.model";
const dynamoHepler = new DynamoHepler<IUser>('Users');

export default class UserService {
  async getById(id: string) {
    return dynamoHepler.get('id', id);
  }

  async createUser(userRequest: RegisterRequest): Promise<IUser> {
    const user: IUser = Object.assign(userRequest, {
      id: UtilsService.generateGuid()
    });
    return dynamoHepler.write(user);
  }

  async getUsers(params: GetUserRequest): Promise<IUser[]> {
    return dynamoHepler.gets(params);
  }

  async deleteUser(id: string): Promise<boolean> {
    return dynamoHepler.delete('id', id);
  }

  async updateUser(id: string, userRequest: UpdateUserRequest): Promise<IUser> {
    return dynamoHepler.update(id, userRequest);
  }
}