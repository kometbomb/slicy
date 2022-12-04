import { h } from "preact";
import Router, { RouterProps } from "preact-router";

// itch.io puts app in https://cdn.address.example.com/html/12345-12345/index.html
const subfolder = /^\/html\/\d+-\d+(\/?.+)$/;

export class SubdirRouter extends Router {
  render(props: RouterProps, state: any) {
    const match = subfolder.exec(state.url);

    if (match) {
      state = {
        ...state,
        url: match[1],
      };
    }

    return super.render(props, state);
  }
}
