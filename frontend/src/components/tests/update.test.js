import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Update from "../Profile/Update";

describe("Update", () => {
  test("renders Update component", () => {
    render(<Update />);
    screen.getByText("Name");
    expect(screen.getByText("Name")).toBeInTheDocument();
  });
  test("testing address input", () => {
    render(<Update />);
    const address = screen.getByTestId("address");
    fireEvent.change(address, { target: { value: "754,The Alameda, 95126" } });
    expect(address.value).toBe("754,The Alameda, 95126");
  });
});
