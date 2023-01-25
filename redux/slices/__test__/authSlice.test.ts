import authReducer, { loginSuccess } from "../authSlice"

describe("test authSlice", () => {
  it("should add user information to state", () => {
    const initialState = {
      currentUser: null,
      loading: false,
      error: false,
    }
    const userInfo = {
      _id: "739512",
      username: "testusername",
      email: "test@gmail.com",
      firstname: "testfirstname",
      lastname: "testlastname",
      role: "testrole",
      accessToken: "thisIsTestAccessToken",
    }
    const action = loginSuccess(userInfo)
    const result = authReducer(initialState, action)
    expect(result).toEqual({
      currentUser: {
        _id: "739512",
        username: "testusername",
        email: "test@gmail.com",
        firstname: "testfirstname",
        lastname: "testlastname",
        role: "testrole",
        accessToken: "thisIsTestAccessToken",
      },
      loading: false,
      error: false,
    })
  })
})
