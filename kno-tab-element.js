export class KnoTabElement extends HTMLElement {
  static styleSheet = new CSSStyleSheet();
  static {
    this.styleSheet.replaceSync(`
      :host {
        box-sizing: border-box;
        cursor: default;
        display: inline-block;
        padding-block: 0.25rem;
        padding-inline: 0.375rem;
        border-radius: 0.25rem;
        border: 0.0625rem solid CanvasText;
      }

      :host(:focus:state(focus-visible)) {
        outline: 1px solid DeepPink;
      }

      #focus-target {
        box-sizing: border-box;
        display: inherit;
        outline: none;
      }
    `);
  }

  #internals = this.attachInternals();

  constructor() {
    super();

    this.#internals.role = "tab";

    this.attachShadow({
      mode: "open",
      delegatesFocus: true,
    });

    this.shadowRoot.innerHTML = `<div id="focus-target"><slot></slot></div>`;
    this.shadowRoot.adoptedStyleSheets = [this.constructor.styleSheet];

    this.shadowRoot.addEventListener("focusin", this);
    this.shadowRoot.addEventListener("mousedown", this);
    this.shadowRoot.addEventListener("focusout", this);
    this.shadowRoot.addEventListener("click", this);
  }

  #mouseDown;

  handleEvent(event) {
    let mouseDown;
    switch (event.type) {
      case "click":
        this.parentElement.querySelector("kno-tab:state(current)")?.deselect();
        this.select();
        break;
      case "mousedown":
        this.#mouseDown = true;
        break;
      case "focusin":
        if (Object.is(event.target, this.shadowRoot.activeElement)) {
          if (this.#mouseDown) this.#internals.states.delete("focus-visible");
          else this.#internals.states.add("focus-visible");
          this.#mouseDown = false;
        }
        break;
      case "focusout":
        this.#internals.states.delete("focus-visible");
        break;
    }
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
    this.shadowRoot.querySelector("#focus-target").tabIndex = 0;
    this.#internals.ariaSelected = "true";
    this.#internals.states.add("current");
  }

  deselect() {
    this.shadowRoot.querySelector("#focus-target").tabIndex = -1;
    this.#internals.ariaSelected = "false";
    this.#internals.states.delete("current");
  }

  static define() {
    if (!window.customElements.get("kno-tab")) {
      window[this.name] = this;
      window.customElements.define("kno-tab", this);
    }
  }
}

