import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SignIn from "../SignIn/SignIn";

describe("Login Page", () => {
  test("renders Signin component", () => {
    render(<SignIn />);
    screen.getByText("Please sign in");
    expect(screen.getByText("Please sign in")).toBeInTheDocument();
  });
  test("testing username input", () => {
    render(<SignIn />);
    const username = screen.getByTestId("username");
    fireEvent.change(username, { target: { value: "chokshiroshan" } });
    expect(username.value).toBe("chokshiroshan");
  });
});
