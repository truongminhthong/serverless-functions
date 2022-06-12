import DynamoHepler from "../../libs/dynamo-hepler";
import UtilsService from "../../libs/utils";
import GetUserRequest from "./requests/get-user.request";
import RegisterRequest from "./requests/register.request";
import UpdateUserRequest from "./requests/update.request";
import IUser from "./user.model";
export default class UserService {
  private readonly dynamoHepler: DynamoHepler<IUser>;
  constructor() {
    this.dynamoHepler = new DynamoHepler<IUser>('Users');
  }
  
  async getById(id: string) {
    return this.dynamoHepler.get('id', id);
  }

  async createUser(userRequest: RegisterRequest): Promise<IUser> {
    const user: IUser = Object.assign(userRequest, {
      id: UtilsService.generateGuid()
    });
    return this.dynamoHepler.write(user);
  }

  async getUsers(params: GetUserRequest): Promise<IUser[]> {
    return this.dynamoHepler.gets(params);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.dynamoHepler.delete('id', id);
  }

  async updateUser(id: string, userRequest: UpdateUserRequest): Promise<IUser> {
    return this.dynamoHepler.update(id, userRequest);
  }
}