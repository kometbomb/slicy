import { h } from "preact";
import { screen, render, waitFor } from "@testing-library/preact";
import App from "../src/components/app";
import { route } from "preact-router";

describe("<SubdirRouter/>", () => {
  describe("found route", () => {
    it("works when path has no subdir", () => {
      render(<App />);
      route("/");
      expect(screen.queryByText("404 Not Found")).toBeNull();
    });

    it("works when path has subdir", () => {
      render(<App />);
      route("/html/12334-123123/");
      expect(screen.queryByText("404 Not Found")).toBeNull();
    });
  });

  describe("route not found", () => {
    it("works when path has no subdir", async () => {
      render(<App />);
      route("/not-found");
      await waitFor(() =>
        expect(screen.queryByText("404 Not Found")).not.toBeNull()
      );
    });

    it("works when path has subdir", async () => {
      render(<App />);
      route("/html/1234-1234/not-found");
      await waitFor(() =>
        expect(screen.queryByText("404 Not Found")).not.toBeNull()
      );
    });
  });
});
