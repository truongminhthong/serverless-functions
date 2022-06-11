import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Responses } from "../../libs/api-response";
import { validateModel } from "../../libs/validate";
import GetUserRequest from "./requests/get-user.request";
import RegisterRequest from "./requests/register.request";
import UpdateUserRequest from "./requests/update.request";
import UserService from "./user.service";

const userService = new UserService();
export const gets = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const queries = event.queryStringParameters;
    const getUserRequest = new GetUserRequest();
    Object.assign(getUserRequest, queries);
    const validate = await validateModel(getUserRequest);
    if (!validate.isValid) {
      return Responses._400({
        message: validate.errorMessages,
      });
    }

    return Responses._200({
      data: await userService.getUsers(getUserRequest)
    });
  } catch (error) {
    return Responses._500({ error: error.message });
  }
};

export const findOne = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters.id;
    const user = await userService.getById(id);
    if (!user) {
      return Responses._404({
        message: "User not found",
      });
    }

    return Responses._200(user);
  } catch (error) {
    return Responses._500({ error: error.message });
  }
};

export const createUser = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body);
    const registerRequest = new RegisterRequest();
    Object.assign(registerRequest, body);
    const validate = await validateModel(registerRequest);
    if (!validate.isValid) {
      return Responses._400({
        message: validate.errorMessages,
      });
    }

    const user = await userService.createUser(registerRequest);
    return Responses._201({
      data: user
    });
  } catch (error) {
    return Responses._500({ error: error.message });
  }
};

export const updateUser = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body);
    const id = event.pathParameters.id;
    const updateUserRequest = new UpdateUserRequest();
    Object.assign(updateUserRequest, body);
    const validate = await validateModel(updateUserRequest);
    if (!validate.isValid) {
      return Responses._400({
        message: validate.errorMessages,
      });
    }

    if (!await userService.getById(id)) {
      return Responses._404({
        message: "User not found",
      });
    }

    const user = await userService.updateUser(id, updateUserRequest);
    return Responses._200(user);
  } catch (error) {
    return Responses._500({ error: error.message });
  }
};

export const deleteUser = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters.id;
    await userService.deleteUser(id);
    return Responses._200({
      message: 'Delete user success'
    });
  } catch (error) {
    return Responses._500({ error: error.message });
  }
};
