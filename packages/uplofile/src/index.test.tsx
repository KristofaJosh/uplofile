import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

function Hello() {
  return <span>Hello</span>;
}

describe("rtl works", () => {
  it("renders", () => {
    render(<Hello />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
