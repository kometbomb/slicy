export const mockClipboard = () => {
  Object.assign(navigator, {
    clipboard: {
      readText: jest.fn().mockResolvedValue("[[1],[2],[3],[4]]"),
      writeText: jest.fn(),
      write: jest.fn(),
    },
  });

  Object.assign(window, {
    ClipboardItem: () => {
      //
    },
  });
};
