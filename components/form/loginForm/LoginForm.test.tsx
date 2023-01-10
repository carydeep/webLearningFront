import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import LoginForm from "./LoginForm"

describe("testing login form", () => {
  const onSubmit = jest.fn()

  beforeEach(() => {
    onSubmit.mockClear()
    render(<LoginForm onSubmit={onSubmit}></LoginForm>)
  })

  it("test username and password are required", async () => {
    clickSubmitButton()
    await waitFor(() => {
      expect(getUsernameInput()).toHaveErrorMessage("Username is required")
      expect(getPasswordInput()).toHaveErrorMessage("Password is required")
    })
  })

  it("test submit form with value", async () => {
    fireEvent.change(getUsernameInput(), {
      target: { value: "TestUsername" },
    })
    fireEvent.change(getPasswordInput(), {
      target: { value: "TestPassword" },
    })
    clickSubmitButton()
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        username: "TestUsername",
        password: "TestPassword",
      })
    })
  })
})

function getUsernameInput() {
  return screen.getByTestId("username")
}

function getPasswordInput() {
  return screen.getByTestId("password")
}

function clickSubmitButton() {
  fireEvent.click(screen.getByRole("button", { name: /Đăng nhập/i }))
}
