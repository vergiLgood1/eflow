import { afterAll, beforeAll } from "bun:test";
import { JSDOM } from "jsdom";

let dom: JSDOM | null = null;

beforeAll(() => {
  dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost",
  });

  const { window } = dom;
  globalThis.window = window as unknown as Window & typeof globalThis;
  globalThis.document = window.document;
  globalThis.navigator = window.navigator;
  globalThis.HTMLElement = window.HTMLElement;
  globalThis.Node = window.Node;
  globalThis.getComputedStyle = window.getComputedStyle;
  globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
    return window.setTimeout(() => callback(Date.now()), 0);
  };
  globalThis.cancelAnimationFrame = (id: number) => {
    window.clearTimeout(id);
  };
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

afterAll(() => {
  dom?.window.close();
  dom = null;
});

// Enable React act environment for testing-library
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
