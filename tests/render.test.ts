import { mocked } from "jest-mock";
import {
  createCanvas,
  createImage,
  createContext,
} from "../src/export/createElement";
import { renderPNG } from "../src/export/png";
import { MockCanvas } from "./fixtures/mockCanvas";
import { MockContext } from "./fixtures/mockContext";
import { MockImage } from "./fixtures/mockImage";
import { mockTree } from "./fixtures/mockTree";

jest.mock("../src/export/createElement");

const mockContext = new MockContext() as unknown as CanvasRenderingContext2D;

beforeEach(() => {
  jest.clearAllMocks();
  mocked(createCanvas).mockReturnValue(
    new MockCanvas() as unknown as HTMLCanvasElement
  );
  mocked(createImage).mockReturnValue(
    new MockImage() as unknown as HTMLImageElement
  );
  mocked(createContext).mockReturnValue(mockContext);
});

describe("render", () => {
  describe("renderPNG()", () => {
    it("renders node tree to PNG", async () => {
      const result = await renderPNG(mockTree);
      expect(result).toEqual("data:image/png;base64,hello-from-mock");
      expect(createContext).toHaveBeenCalledWith(
        expect.objectContaining({ width: 1024, height: 1024 })
      );
      expect(mockContext.drawImage).toHaveBeenCalledWith(
        expect.objectContaining({ width: 1024, height: 1024 }),
        0,
        0
      );
    });
  });
});
