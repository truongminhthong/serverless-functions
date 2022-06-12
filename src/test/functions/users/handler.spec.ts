import { createUser, deleteUser, gets, findOne, updateUser } from "../../../functions/users/handler";

jest.mock("../../../functions/users/user.service", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => {
    return {
      getById: jest.fn().mockImplementation(() => {
        return {};
      }),
      getUsers: jest.fn().mockImplementation(() => {
        return [];
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
  })
}));

describe("User Handeler", () => {

  it("getUsers: should return the list of users", async () => {
    const result = await createUser({
      body: JSON.stringify({
        fullName: "Minh Thong",
        email: "minhthong",
        phoneNumber: "",
      })
    });
    expect(result).toBeDefined();
  });

  it("getUsers: should return the list of users", async () => {
    const result = await createUser({
      body: JSON.stringify({
        "phoneNumber": "05453534324",
        "password": "123456",
        "email": "minhthong4@yopmail.com",
        "fullName": "MinhThong"
      })
    });
    expect(result).toBeDefined();
  });

  it("getUsers: should return the list of users", async () => {
    const result = await createUser({
      body: {
        "phoneNumber": "05453534324"
      }
    });
    expect(result).toBeDefined();
  });
});
