import { MockContext } from "./mockContext";

export class MockCanvas {
  public width = 0;
  public height = 0;
  public getContext = (type: string) => {
    if (type === "2d") return new MockContext();
    return null;
  };
  public toDataURL = (type = "image/png") =>
    Promise.resolve(`data:${type};base64,hello-from-mock`);
}
