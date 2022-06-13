import UserService from "../../../functions/users/user.service";

jest.mock("../../../libs/dynamo-hepler", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      get: jest.fn().mockImplementation(() => {
        return {};
      }),
      gets: jest.fn().mockImplementation(() => {
        return {
          data: [],
          lastEvaluatedKey: null
        };
      }),
      write: jest.fn().mockImplementation(() => {
        return {};
      }),
      update: jest.fn().mockImplementation(() => {
        return {};
      }),
      delete: jest.fn().mockImplementation(() => {
        return true;
      }),
    };
  })
}));

describe("User Service", () => {
  const userService = new UserService();

  it("getUsers: should return the list of users", async () => {
    const result = await userService.getUsers({
      fullName: "Minh Thong",
      email: "",
      phoneNumber: "",
    });
    expect(result).toBeDefined();
  });

  it("getById: should return user by id", async () => {
    const result = await userService.getById("3434");
    expect(result).toBeDefined();
  });

  it("should return user", async () => {
    const result = await userService.createUser({
      fullName: "Minh Thong",
      email: "",
      password: "",
      phoneNumber: "",
    });
    expect(result).toBeDefined();
  });

  it("updateUser: should return user", async () => {
    const result = await userService.updateUser('123', {
      fullName: "Minh Thong",
      email: "",
      phoneNumber: "",
    });
    expect(result).toBeDefined();
  });

  it("deleteUser: should return user", async () => {
    const result = await userService.deleteUser('123');
    expect(result).toBeDefined();
  });
});
