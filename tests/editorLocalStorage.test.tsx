import { render, waitFor } from "@testing-library/preact"
import { mocked } from "jest-mock"
import { h } from "preact"
import { useContext } from "preact/hooks"
import { EditorContext, EditorContextProvider, Editor } from "../src/components/editor"
import { EditorContextType } from "../src/components/editor/context"
import { ToastProvider } from "../src/components/toast"
import { useLocalStorage } from "../src/hooks/localStorage"
import { useToast } from "../src/hooks/toast"

jest.mock("../src/hooks/localStorage")
jest.mock("../src/hooks/toast")

beforeEach(() => {
  jest.clearAllMocks();

  jest.useFakeTimers()

});

describe("localStorage", () => {
  const Helper = ({
    callback,
  }: {
    callback: (context: EditorContextType) => void;
  }) => {
    callback(useContext(EditorContext));
    return null;
  };

  const context: { data: EditorContextType } = {} as any;

  const renderEditor = () =>
    render(
      <ToastProvider>
        <EditorContextProvider>
          <Editor />
          <Helper callback={(editorContext) => (context.data = editorContext)} />
        </EditorContextProvider>
      </ToastProvider>
    );


  let localStorage: Storage
  beforeEach(() => {
    localStorage = useLocalStorage()
  })

  it("loads root node from localstorage on init", async () => {
    const { showToast } = useToast()
    mocked(localStorage.getItem).mockReturnValue("[1]")

    renderEditor()

    jest.advanceTimersByTime(1000)

    expect(localStorage.getItem).toHaveBeenCalledTimes(1)
    expect(localStorage.getItem).toHaveBeenCalledWith("root")
    await waitFor(() => expect(context.data.root).toEqual({ fg: 1, bg: 0, shape: 0 }))
    expect(showToast).toHaveBeenCalledWith(expect.stringMatching("restored"))
  })

  it("handles invalid root node", async () => {
    const { showToast } = useToast()
    mocked(localStorage.getItem).mockReturnValue("invalid")

    renderEditor()

    jest.advanceTimersByTime(1000)

    expect(localStorage.getItem).toHaveBeenCalledTimes(1)
    expect(localStorage.getItem).toHaveBeenCalledWith("root")
    expect(showToast).not.toHaveBeenCalledWith(expect.stringMatching("restored"), "info")
  })

  it("saves root node to localstorage 1000 ms after last edit", async () => {
    renderEditor()

    context.data.setRoot({ fg: 4, bg: 5, shape: 5 })
    await waitFor(() => expect(context.data.root).toEqual({ fg: 4, bg: 5, shape: 5 }))
    context.data.setRoot({ fg: 4, bg: 5, shape: 6 })
    await waitFor(() => expect(context.data.root).toEqual({ fg: 4, bg: 5, shape: 6 }))
    context.data.setRoot({ fg: 4, bg: 5, shape: 1 })
    await waitFor(() => expect(context.data.root).toEqual({ fg: 4, bg: 5, shape: 1 }))

    jest.advanceTimersByTime(10000)

    expect(localStorage.setItem).toHaveBeenCalledTimes(1)
    expect(localStorage.setItem).toHaveBeenCalledWith("root", "[4,1,5]")
  })
})
