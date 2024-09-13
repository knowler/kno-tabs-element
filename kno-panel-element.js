let id = -1;

export class KnoPanelElement extends HTMLElement {
  static styleSheet = new CSSStyleSheet();

  static {
    this.styleSheet.replaceSync(`
:host {
  display: block;
  padding: 1rem;
  border: 0.0625rem solid CanvasText;
  border-radius: 0.5rem;
}
    `);
  }

  #internals = this.attachInternals();

  constructor() {
    super();

    this.#internals.role = "tabpanel";

    id++;

    this.attachShadow({
      mode: "open",
    });

    this.shadowRoot.innerHTML = `<slot></slot>`;
    this.shadowRoot.adoptedStyleSheets = [this.constructor.styleSheet];

    if (!("ariaControlsElements" in ElementInternals.prototype)) {
      this.setAttribute("id", `tabpanel-${id}`)
    }
  }

  static define() {
    if (!window.customElements.get("kno-panel")) {
      window[this.name] = this;
      window.customElements.define("kno-panel", this);
    }
  }
}

