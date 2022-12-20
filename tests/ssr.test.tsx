import { h } from "preact";
import { render, screen } from "@testing-library/preact";
import App from "../src/components/app";

describe("SSR missing features", () => {
  beforeEach(() => {
    process.env.PREACT_APP_VERSION = "version-number";
  });

  const { window, navigator, document } = global;
  beforeAll(() => {
    delete (global as any).window;
    delete (global as any).navigator;
    delete (global as any).document;
  });
  afterAll(() => {
    global.window = window;
    global.navigator = navigator;
    global.document = document;
  });

  it("renders when window is not defined", () => {
    render(<App />);
    expect(screen.getByTestId("app")).toBeDefined();
  });
});
