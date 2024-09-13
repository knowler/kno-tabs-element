import { KnoTabElement } from "./kno-tab-element.js";
import { KnoPanelElement } from "./kno-panel-element.js";

export class KnoTabsElement extends HTMLElement {
  static styleSheet = createStyleSheet(`
    :host {
      display: grid;
      row-gap: 1rem;
      inline-size: fit-content;
    }

    :host::part(tablist) {
      display: flex;
      column-gap: 0.5rem;
      padding: 0.5rem;
      border: 0.0625rem solid CanvasText;
      border-radius: 0.5rem;
    }
  `);

  constructor() {
    super();

    this.attachShadow({
      mode: "open",
      slotAssignment: "manual",
    });

    this.shadowRoot.innerHTML = `
      <slot name="tablist" part="tablist" role="tablist"></slot>
      <slot name="panel"></slot>
    `;

    this.shadowRoot.adoptedStyleSheets = [this.constructor.styleSheet];

    this.addEventListener("keydown", this);
  }

  get tabList() {
    return this.shadowRoot.querySelector("slot[name=tablist]");
  }

  get panelSlot() {
    return this.shadowRoot.querySelector("slot[name=panel]");
  }

  connectedCallback() {
    // If none are selected, then set the first one to be selected.
    this.tabs = this.querySelectorAll("kno-tab");
    this.panels = this.querySelectorAll("kno-panel");

    let selectedIndex = 0;
    for (let i = 0; i < this.tabs.length; i++) {
      const tab = this.tabs.item(i);
      const panel = this.panels.item(i);

      tab.deselect();
      tab.link(panel);

      if (tab.hasAttribute("selected")) selectedIndex = i;
    }
    const selectedTab = this.tabs.item(selectedIndex);
    selectedTab.select();

    this.tabList.assign(...this.tabs);
    this.panelSlot.assign(this.panels.item(selectedIndex));
  }

  handleEvent(event) {
    switch (event.type) {
      case "keydown":
        if (event.target.matches("kno-tab")) {
          switch (event.code) {
            case "ArrowRight": {
              const currentTab = event.target;
              const currentIndex = Array.from(this.tabs).indexOf(currentTab);
              const newIndex = currentIndex >= this.tabs.length - 1 ? 0 : currentIndex + 1;
              const nextTab = this.tabs.item(newIndex);
              this.panelSlot.assign(this.panels.item(newIndex));

              nextTab.select();
              currentTab.deselect();
              currentTab.blur();
              nextTab.focus();
              break;
            }
            case "ArrowLeft": {
              const currentTab = event.target;
              const currentIndex = Array.from(this.tabs).indexOf(currentTab);
              const newIndex = currentIndex > 0 ? currentIndex - 1 : this.tabs.length - 1;
              const prevTab = this.tabs.item(newIndex);
              this.panelSlot.assign(this.panels.item(newIndex));

              prevTab.select();
              currentTab.deselect();
              prevTab.focus();
              break;
            }
          }
        }
        break;
    }
  }

  static define() {
    KnoTabElement.define();
    KnoPanelElement.define();

    if (!window.customElements.get("kno-tabs")) {
      window[this.name] = this;
      window.customElements.define("kno-tabs", this);
    }
  }
}

function createStyleSheet(styles) {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(styles);
  return sheet;
}
