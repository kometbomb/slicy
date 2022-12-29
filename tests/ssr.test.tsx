import { h } from "preact";
import { render, screen } from "@testing-library/preact";
import App from "../src/components/app";

describe("SSR missing features", () => {
  beforeEach(() => {
    process.env.PREACT_APP_VERSION = "version-number";
  });

  const { window, navigator } = global;
  beforeAll(() => {
    delete (global as any).window;
    delete (global as any).navigator;
  });
  afterAll(() => {
    global.window = window;
    global.navigator = navigator;
  });

  it("renders when window is not defined", () => {
    render(<App />);
    expect(screen.getByTestId("app")).toBeDefined();
  });
});
