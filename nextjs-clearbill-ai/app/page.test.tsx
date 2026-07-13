import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("ClearBill workspace", () => {
  it("shows safety boundaries before a question is asked", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: /ask about this statement/i })).toBeVisible();
    expect(screen.getByText(/do not enter protected health information/i)).toBeVisible();
    expect(screen.getByText(/no diagnosis or coverage determination/i)).toBeVisible();
  });

  it("answers a suggested question in labeled demo mode", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByRole("button", { name: /what is an explanation of benefits/i }));
    expect(screen.getByLabelText(/question for this statement/i)).toHaveValue(
      "What is an Explanation of Benefits?",
    );
    await user.click(screen.getByRole("button", { name: "Review" }));

    expect(await screen.findByText(/an explanation of benefits is not a bill/i, {}, { timeout: 2_000 })).toBeVisible();
    expect(screen.getAllByText("Demo corpus").length).toBeGreaterThan(0);
  });
});
