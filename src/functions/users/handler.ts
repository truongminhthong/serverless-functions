import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Responses } from "../../libs/api-response";
import { validateModel } from "../../libs/validate";
import GetUserRequest from "./requests/get-user.request";
import RegisterRequest from "./requests/register.request";
import UpdateUserRequest from "./requests/update.request";
import UserService from "./user.service";
import AWS from "aws-sdk";
import UtilsService from "../../libs/utils";
import Sharp from 'sharp';

const S3 = new AWS.S3();
const userService = new UserService();
const FIT_OPTIONS = [
  'cover',    // Preserving aspect ratio, ensure the image covers both provided dimensions by cropping/clipping to fit. (default)
  'contain',  // Preserving aspect ratio, contain within both provided dimensions using "letterboxing" where necessary.
  'fill',     // Ignore the aspect ratio of the input and stretch to both provided dimensions.
  'inside',   // Preserving aspect ratio, resize the image to be as large as possible while ensuring its dimensions are less than or equal to both those specified.
  'outside',  // Preserving aspect ratio, resize the image to be as small as possible while ensuring its dimensions are greater than or equal to both those specified.
];

export const getUsers = async (
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

    return Responses._200(await userService.getUsers(getUserRequest));
  } catch (error) {
    return Responses._500({ error: error.message });
  }
};

export const getUserById = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters.id;
    const user = await userService.getById(id);
    if (!user) {
      return Responses._404({
        message: "User not found!",
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
    return Responses._201(user);
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

    if (!(await userService.getById(id))) {
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
    if (!(await userService.getById(id))) {
      return Responses._404({
        message: "User not found",
      });
    }
    await userService.deleteUser(id);
    return Responses._200({
      message: "Delete user success",
    });
  } catch (error) {
    return Responses._500({ error: error.message });
  }
};

export const uploadFn = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { body } = await UtilsService.parseFormDataToFile(event);

    const uploadResults = await Promise.all(
      body.files.map((file) => {
        return new Promise(async (resolve) => {
          const params = {
            Bucket: "update-to-s3-minhthong",
            Key: `images/${
              file.fileName.filename.split(".")[0]
            }${new Date().getTime()}.${file.fileName.filename.split(".")[1]}`,
            ContentType: file.contentType,
            Body: file.file,
          };
          const result = await S3.putObject(params).promise();
          resolve(result);
        });
      })
    );
    console.log("uploadResults: ", uploadResults);
    return Responses._200({
      message: "Upload Success",
    });
  } catch (error) {
    return Responses._500({ error: error.message });
  }
};

export const resizeImage = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log('resizeImage: ', resizeImage);
    console.log('event.body: ', event.body.substring(0, 50));
    let buff = Buffer.from(event.body, "base64");
    let eventBodyStr = buff.toString('utf-8');
    const body = JSON.parse(eventBodyStr);
    console.log('version: ', body.version);
    console.log('source: ', body.source);
    console.log('eventName: ', body.detail.eventName);
    return Responses._200({
      message: "Get Source Error Success",
    });
    // const { resourcePath } = body;
    // const action = body.action || "cover";
    // const allowedMimeTypes = [
    //   "image/jpeg",
    //   "image/gif",
    //   "image/png",
    //   "image/svg+xml",
    //   "image/tiff",
    //   "image/bmp",
    // ];
    // const unsupportedSharpMimeTypes = ["image/bmp"];
    // // Fit validation
    // if(action && (FIT_OPTIONS.indexOf(action) === -1)) {
    //   return Responses._200({
    //     message: "Get Source Error Success",
    //   });
    // }

    // let originalImage = await UtilsService.getResource(resourcePath);
    // if(!originalImage) { 
    //   return Responses._404({
    //     message: `Resource not found. Could not find resource: ${resourcePath}.`,
    //   });
    // }
    // const originalImageMime = originalImage.ContentType;
    // if(!allowedMimeTypes.includes(originalImageMime)) {
    //   return Responses._400({
    //     message: `Unsupported MIME type: ${originalImageMime}. Supported types: ${allowedMimeTypes.join(', ')}`,
    //   });
    // }

    // if(unsupportedSharpMimeTypes.includes(originalImageMime)) {
    //   return Responses._400({
    //     message: `Unsupported MIME type: ${originalImageMime}. Supported types: ${allowedMimeTypes.join(', ')}`,
    //   });
    // }

    // const width = 300;
    // const height = 300;
    // const fit = action || 'cover';

    // // create a new image using provided dimensions.
    // const result = await Sharp(originalImage.Body, { failOnError: false })
    //     .resize(width, height, { withoutEnlargement: true, fit })
    //     .rotate()
    //     .toBuffer();

    //  // save newly created image to S3.
    //  await S3.putObject({
    //   Body: result,
    //   Bucket: "update-to-s3-minhthong",
    //   ContentType: originalImageMime,
    //   Key: `resize-images/300x300/${resourcePath.split('/').pop()}`,
    //  }).promise();

    // return Responses._200({
    //   message: `Resize resource "${resourcePath} success"`,
    // });
  } catch (error) {
    return Responses._500({ error: error.message });
  }
};
