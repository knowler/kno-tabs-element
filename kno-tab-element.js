export class KnoTabElement extends HTMLElement {
  static styleSheet = new CSSStyleSheet();
  static {
    this.styleSheet.replaceSync(`
:host {
  display: inline-block;
  padding-block: 0.25rem;
  padding-inline: 0.375rem;
  border-radius: 0.25rem;
}

:host(:focus) {
  outline: 0.125rem solid DeepPink;
}

slot:focus-visible {
  outline: none;
}
    `);
  }

  index;

  #internals = this.attachInternals();

  constructor() {
    super();

    this.#internals.role = "tab";

    this.attachShadow({
      mode: "open",
      delegatesFocus: true,
    });

    this.shadowRoot.innerHTML = `<slot style="display: inherit"></slot>`;
    this.shadowRoot.adoptedStyleSheets = [this.constructor.styleSheet];
  }

  link(panelElement) {
    if (!panelElement.matches("kno-panel")) throw "Cannot link non-<kno-panel> element";

    if ("ariaControlsElements" in ElementInternals.prototype) {
      this.#internals.ariaControlsElements = [panelElement];
    } else {
      // TODO: we need to confirm there’s an ID
      this.setAttribute("aria-controls", panelElement.id);
    }
  }

  select() {
    this.shadowRoot.querySelector("slot").tabIndex = 0;
    this.focus();
    this.#internals.states.add("current");
  }

  deselect() {
    this.shadowRoot.querySelector("slot").removeAttribute("tabindex");
    this.#internals.states.delete("current");
  }

  static define() {
    if (!window.customElements.get("kno-tab")) {
      window[this.name] = this;
      window.customElements.define("kno-tab", this);
    }
  }
}

