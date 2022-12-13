import { act, renderHook } from "@testing-library/preact";
import { useUndo } from "../src/hooks/undo";

describe("useUndo()", () => {
  it("remembers history", () => {
    const { result } = renderHook(() => useUndo<string>("a"));
    expect(result.current.current).toBe("a");
    act(() => result.current.set("b"));
    expect(result.current.current).toBe("b");
    act(() => result.current.set("c"));
    expect(result.current.current).toBe("c");
    act(() => result.current.undo());
    expect(result.current.current).toBe("b");
    act(() => result.current.undo());
    expect(result.current.current).toBe("a");
    act(() => result.current.undo());
    expect(result.current.current).toBe("a");
  });

  it("remembers future", () => {
    const { result } = renderHook(() => useUndo<string>("a"));
    act(() => result.current.set("b"));
    act(() => result.current.set("c"));
    expect(result.current.current).toBe("c");
    act(() => result.current.undo());
    expect(result.current.current).toBe("b");
    act(() => result.current.undo());
    expect(result.current.current).toBe("a");
    act(() => result.current.redo());
    expect(result.current.current).toBe("b");
    act(() => result.current.redo());
    expect(result.current.current).toBe("c");
  });

  it("discards future", () => {
    const { result } = renderHook(() => useUndo<string>("a"));
    act(() => result.current.set("b"));
    act(() => result.current.set("c"));
    expect(result.current.current).toBe("c");
    act(() => result.current.undo());
    expect(result.current.current).toBe("b");
    act(() => result.current.set("x"));
    expect(result.current.current).toBe("x");
    act(() => result.current.redo());
    expect(result.current.current).toBe("x");
  });
});
