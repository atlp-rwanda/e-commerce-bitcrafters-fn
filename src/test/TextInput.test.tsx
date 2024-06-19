import "@testing-library/jest-dom";
import { render, fireEvent } from "@testing-library/react";

import TextInput from "../components/TextInput";

describe("TextInput Component", () => {
  test("Toggle Password Visibility", () => {
    const mockProps = {
      secured: true,
      placeholder: "Password",
      onChange: jest.fn(),
      onBlur: jest.fn(),
    };

    const { getByRole } = render(<TextInput {...mockProps} />);

    expect(getByRole("textbox")).toBeInTheDocument();

    const toggleButton = getByRole("button");
    fireEvent.click(toggleButton);

    expect(getByRole("textbox")).toBeDefined();

    fireEvent.click(toggleButton);

    expect(getByRole("textbox")).toBeInTheDocument();
  });
});
