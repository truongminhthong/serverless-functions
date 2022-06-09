import { APIGatewayProxyEvent } from "aws-lambda";
import {
  createUser,
  deleteUser,
  getUsers,
  getUserById,
  updateUser,
} from "../../../functions/users/handler";
import { STATUS_CODE } from "../../../libs/api-response";

jest.mock("../../../functions/users/user.service", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      getById: jest.fn().mockImplementation((id: string) => {
        if(id === "1") {
          return  {
            phoneNumber: "05453534324",
            password: "123456",
            email: "minhthong4@yopmail.com",
            fullName: "MinhThong",
            id: "3673d41c-fc79-4992-a67d-d4a75eb248c4",
          };
        }
        return null;
      }),
      getUsers: jest.fn().mockImplementation(() => {
        return [
          {
            phoneNumber: "05453534324",
            password: "123456",
            email: "minhthong4@yopmail.com",
            fullName: "MinhThong",
            id: "3673d41c-fc79-4992-a67d-d4a75eb248c4",
          },
          {
            phoneNumber: "05453534324",
            password: "123456",
            email: "minhthong5@yopmail.com",
            fullName: "MinhThong123",
            id: "e52abf89-3c1b-4271-b9fc-f9eba87f81de",
          },
          {
            phoneNumber: "05453534324",
            fullName: "MinhThong",
            id: "3673d41c-fc79-4992-a67d-d4a75eb248",
          },
          {
            phoneNumber: "05453534324",
            password: "123456",
            fullName: "MinhThong123",
            id: "a4da78c8-97fa-4be3-8408-33969fdddd89",
            email: "minhthong11@yopmail.com",
          }
        ];
      }),
      createUser: jest.fn().mockImplementation(() => {
        return {};
      }),
      updateUser: jest.fn().mockImplementation(() => {
        return {};
      }),
      deleteUser: jest.fn().mockImplementation(() => {
        return true;
      }),
    };
  }),
}));

const event: APIGatewayProxyEvent = {
  headers: undefined,
  multiValueHeaders: undefined,
  httpMethod: "",
  isBase64Encoded: false,
  path: "",
  pathParameters: undefined,
  queryStringParameters: undefined,
  multiValueQueryStringParameters: undefined,
  stageVariables: undefined,
  requestContext: undefined,
  resource: "",
  body: "",
};

describe("#getUsers", () => {
  it("Get Users With No Params", async () => {
    const result = await getUsers(Object.assign(event, { queryStringParameters: null }));
    expect(result.statusCode).toEqual(STATUS_CODE.OK);
  });

  it("Get Users With Params", async () => {
    const result = await getUsers(
      Object.assign(event, { 
        queryStringParameters: {
          fullName: "Minh Thong"
        } 
    }));
    expect(result.statusCode).toEqual(STATUS_CODE.OK);
  });
});

describe("#getUserById", () => {
  it("Get User With No Id Parameter", async () => {
    const result = await getUserById(Object.assign(event, { pathParameters: null }));
    expect(result.statusCode).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
  });

  it("Get User With Incorrect Id Parameter", async () => {
    const result = await getUserById(
      Object.assign(event, { 
        pathParameters: {
          id: "12"
        } 
    }));
    expect(result.statusCode).toEqual(STATUS_CODE.NOT_FOUND);
  });

  it("Get User With Correct Id Parameter", async () => {
    const result = await getUserById(
      Object.assign(event, { 
        pathParameters: {
          id: "1"
        } 
    }));
    expect(result.statusCode).toEqual(STATUS_CODE.OK);
  });
});

describe("#createUser", () => {
  it("Create User With No Body", async () => {
    const result = await createUser(Object.assign(event, { body: "" }));
    expect(result.statusCode).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
  });

  it("Create User With Invalid Body", async () => {
    const result = await createUser(
      Object.assign(event, {
        body: JSON.stringify({
          phoneNumber: "05453534324",
          password: "123",
          email: "minhthong",
          fullName: "",
        }),
      })
    );
    expect(result.statusCode).toEqual(STATUS_CODE.BAD_REQUEST);
  });

  it("Create User With Valid Body", async () => {
    const result = await createUser(
      Object.assign(event, {
        body: JSON.stringify({
          phoneNumber: "05453534324",
          password: "123456",
          email: "minhthong@yopmail.com",
          fullName: "MinhThong",
        }),
      })
    );
    expect(result.statusCode).toEqual(STATUS_CODE.CREATED);
  });
});


describe("#updateUser", () => {
  it("Update User With No Body", async () => {
    const result = await updateUser(Object.assign(event, { body: "" }));
    expect(result.statusCode).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
  });

  it("Update User With No Id Parameter", async () => {
    const result = await updateUser(
      Object.assign(event, {
        body: JSON.stringify({
          phoneNumber: "05453534324",
          email: "minhthong",
          fullName: "",
        }),
        pathParameters: null
      })
    );
    expect(result.statusCode).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
  });

  it("Update User With Invalid Body", async () => {
    const result = await updateUser(
      Object.assign(event, {
        body: JSON.stringify({
          phoneNumber: "05453534324",
          email: "minhthong",
          fullName: "",
        }),
        pathParameters: {
          id: '3673d41c-fc79-4992-a67d-d4a75eb248c4'
        }
      })
    );
    expect(result.statusCode).toEqual(STATUS_CODE.BAD_REQUEST);
  });

  it("Update User With Valid Body And Not Exists User", async () => {
    const result = await updateUser(
      Object.assign(event, {
        body: JSON.stringify({
          phoneNumber: "05453534324",
          email: "minhthong@yopmail.com",
          fullName: "MinhThong",
        }),
        pathParameters: {
          id: '12'
        }
      })
    );
    expect(result.statusCode).toEqual(STATUS_CODE.NOT_FOUND);
  });

  it("Update User With Valid Body And Exists User", async () => {
    const result = await updateUser(
      Object.assign(event, {
        body: JSON.stringify({
          phoneNumber: "05453534324",
          email: "minhthong@yopmail.com",
          fullName: "MinhThong",
        }),
        pathParameters: {
          id: '1'
        }
      })
    );
    expect(result.statusCode).toEqual(STATUS_CODE.OK);
  });
});

describe("#deleteUserById", () => {
  it("Delete User With No Id Parameter", async () => {
    const result = await deleteUser(Object.assign(event, { pathParameters: null }));
    expect(result.statusCode).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
  });

  it("Delete User With Incorrect Id Parameter", async () => {
    const result = await deleteUser(
      Object.assign(event, { 
        pathParameters: {
          id: "12"
        } 
    }));
    expect(result.statusCode).toEqual(STATUS_CODE.NOT_FOUND);
  });

  it("Delete User With Correct Id Parameter", async () => {
    const result = await deleteUser(
      Object.assign(event, { 
        pathParameters: {
          id: "1"
        } 
    }));
    expect(result.statusCode).toEqual(STATUS_CODE.OK);
  });
});