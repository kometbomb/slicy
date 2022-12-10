export class MockImage {
  public width = 0;
  public height = 0;
  public src = "";

  constructor() {
    setTimeout(() => this.onload(), 1);
  }

  public onload = () => {
    //
  };
}
