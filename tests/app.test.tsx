import { h } from "preact";
import { render, screen } from "@testing-library/preact";
import App from "../src/components/app";

describe("<App/>", () => {
  beforeEach(() => {
    process.env.PREACT_APP_VERSION = "version-number";
  });

  it("renders version number", () => {
    render(<App />);
    expect(screen.getByTestId("version-info").textContent).toContain(
      "version-number"
    );
  });
});
