import { screen, render, waitFor } from "@testing-library/preact";
import { h } from "preact";
import { ToastContextType, ToastProvider } from "../src/components/toast";
import { useToast } from "../src/hooks/toast";

describe("toast", () => {
  const Helper = ({
    callback,
  }: {
    callback: (context: ToastContextType) => void;
  }) => {
    callback(useToast());
    return null;
  };

  const context: { data: ToastContextType } = {} as any;

  beforeEach(() => {
    jest.useFakeTimers();
    render(
      <ToastProvider>
        <Helper callback={(editorContext) => (context.data = editorContext)} />
        <div>Content</div>
      </ToastProvider>
    );
  });

  it("displays and hides a toast", async () => {
    context.data.showToast("test message", "success");
    await waitFor(() =>
      expect(screen.queryByText("test message")).not.toBeNull()
    );
    expect(
      screen.queryByText("test message")?.parentElement?.className.split(" ")
    ).toEqual(expect.arrayContaining(["toast-item", "success"]));

    jest.advanceTimersByTime(1000);
    context.data.showToast("test message 2");
    await waitFor(() =>
      expect(screen.queryByText("test message 2")).not.toBeNull()
    );
    expect(
      screen.queryByText("test message 2")?.parentElement?.className.split(" ")
    ).toEqual(expect.arrayContaining(["toast-item", "info"]));
    await waitFor(() =>
      expect(screen.queryByText("test message")).not.toBeNull()
    );

    jest.advanceTimersByTime(5000);
    await waitFor(() =>
      expect(screen.queryByText("test message 2")).not.toBeNull()
    );
    await waitFor(() => expect(screen.queryByText("test message")).toBeNull());

    jest.advanceTimersByTime(5000);
    await waitFor(() =>
      expect(screen.queryByText("test message 2")).toBeNull()
    );
    await waitFor(() => expect(screen.queryByText("test message")).toBeNull());
  });
});
