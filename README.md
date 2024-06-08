# `<kno-tabs>` custom element

This is a **work in progress** tabs custom element that I’m building for
interest-sake. It uses manual slot assignment and so the `<kno-tab>` and
`<kno-panel>` elements are the API for setting tabs and their associated
panels. A goal is to avoid exposing internal ARIA attributes or
`tabindex` however that might not be possible in some browsers.

Here’s what the HTML API currently looks like:

```html
<kno-tabs>
  <kno-tab>Knocked Loose</kno-tab>
  <kno-panel>You Won’t Go Before You’re Supposed To</kno-panel>

  <kno-tab>Comeback Kid</kno-tab>
  <kno-panel>Heavy Steps</kno-panel>

  <kno-tab>Militarie Gun</kno-tab>
  <kno-panel>Life Under The Gun</kno-panel>
</kno-tabs>
```

The styling API is as follows:

```css
kno-tabs {
  /* Style the tabs container */
}

kno-tabs::part(tablist) {
  /* Style the tabs list */
}

kno-tab {
  /* Style the tab buttons */
}

kno-tab:state(current) {
  /* Style the current/selected tab button */
}

kno-panel {
  /* Style the tab panels */
}

kno-panel:state(current) {
  /* Style the current/selected tab panel */
}

/*
  Since light DOM order is respected you can style elements based on
  position using the `:nth-of-type()` pseudo-class selector.
*/

kno-tab:nth-of-type(2) {
  /* Style the second tab button */
}

kno-panel:nth-of-type(2) {
  /* Style the second tab panel */
}
```
