import DynamoHepler from "../../libs/dynamo-hepler";
import UtilsService from "../../libs/utils";
import GetUserRequest from "./requests/get-user.request";
import RegisterRequest from "./requests/register.request";
import UpdateUserRequest from "./requests/update.request";
import IUser from "./user.model";
export default class UserService {
  private readonly dynamoHepler: DynamoHepler<IUser>;
  constructor() {
    this.dynamoHepler = new DynamoHepler<IUser>('users');
  }
  
  async getById(id: string): Promise<IUser> {
    return this.dynamoHepler.get('id', id);
  }

  async createUser(userRequest: RegisterRequest): Promise<IUser> {
    const user: IUser = Object.assign(userRequest, {
      id: UtilsService.generateGuid()
    });
    return this.dynamoHepler.write(user);
  }

  async getUsers(params: GetUserRequest): Promise<{
    users: IUser[],
    lastEvaluatedKey: string
  }> {
    const usersResult = await this.dynamoHepler.gets(params);
    // remove password filed from response
    usersResult.data.forEach(c => {
      delete c.password;
    });
    
    return {
      users: usersResult.data,
      lastEvaluatedKey: usersResult.lastEvaluatedKey
    };
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.dynamoHepler.delete('id', id);
  }

  async updateUser(id: string, userRequest: UpdateUserRequest): Promise<IUser> {
    return this.dynamoHepler.update(id, userRequest);
  }
}