import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Register from "../Register/Register";

describe("Register", () => {
  test("renders Register component", () => {
    render(<Register />);
    screen.getByText("Register");
    expect(screen.getByText("Register:")).toBeInTheDocument();
  });
  test("testing email input", () => {
    render(<Register />);
    const email = screen.getByTestId("inputEmail");
    fireEvent.change(email, { target: { value: "chokshiroshan@gmail.com" } });
    expect(email.value).toBe("chokshiroshan@gmail.com");
  });
});
