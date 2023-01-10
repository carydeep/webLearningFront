import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import RegisterForm from "./RegisterForm"

describe("test register form", () => {
  const onSubmit = jest.fn()

  beforeEach(() => {
    onSubmit.mockClear()
    render(<RegisterForm onSubmit={onSubmit}></RegisterForm>)
  })

  it("all field is required", async () => {
    clickSubmitButton()
    await waitFor(() => {
      expect(getUsernameInput()).toHaveErrorMessage("This field is required")
    })
  })

  it("show error message when password and confirm password not match", async () => {
    fireEvent.change(getPasswordInput(), {
      target: { value: "TestPassword123@" },
    })
    fireEvent.change(getConfirmPasswordInput(), {
      target: { value: "NotMatchPassword" },
    })
    await waitFor(() => {
      expect(getConfirmPasswordInput()).toHaveErrorMessage(
        "Passwords must match"
      )
    })
  })

  it("show error when password not complex", async () => {
    fireEvent.change(getPasswordInput(), {
      target: { value: "thispasswordissimple" },
    })
    await waitFor(() => {
      expect(getPasswordInput()).toHaveErrorMessage(
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      )
    })
  })

  it("show error when password is too short", async () => {
    fireEvent.change(getPasswordInput(), {
      target: { value: "shortpw" },
    })
    await waitFor(() => {
      expect(getPasswordInput()).toHaveErrorMessage("Password too short")
    })
  })

  it("show error when type wrong format email", async () => {
    fireEvent.change(getEmailInput(), {
      target: { value: "wrongemailformat" },
    })
    await waitFor(() => {
      expect(getEmailInput()).toHaveErrorMessage(
        "This field must be valid email"
      )
    })
  })

  it("submit form with value", async () => {
    fireEvent.change(getFirstnameInput(), {
      target: { value: "testfirstname" },
    })
    fireEvent.change(getLastnameInput(), {
      target: { value: "testlastname" },
    })
    fireEvent.change(getUsernameInput(), {
      target: { value: "testusername" },
    })
    fireEvent.change(getEmailInput(), {
      target: { value: "test@email.com" },
    })
    fireEvent.change(getPasswordInput(), {
      target: { value: "123456qQ@" },
    })
    fireEvent.change(getConfirmPasswordInput(), {
      target: { value: "123456qQ@" },
    })
    clickSubmitButton()
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        username: "testusername",
        firstname: "testfirstname",
        lastname: "testlastname",
        email: "test@email.com",
        password: "123456qQ@",
        confirmPassword: "123456qQ@",
      })
    })
  })
})

function getUsernameInput() {
  return screen.getByTestId("username")
}

function getFirstnameInput() {
  return screen.getByTestId("firstname")
}

function getLastnameInput() {
  return screen.getByTestId("lastname")
}

function getEmailInput() {
  return screen.getByTestId("email")
}

function getPasswordInput() {
  return screen.getByTestId("password")
}

function getConfirmPasswordInput() {
  return screen.getByTestId("confirmPassword")
}

function clickSubmitButton() {
  fireEvent.click(screen.getByRole("button", { name: /Register/i }))
}
