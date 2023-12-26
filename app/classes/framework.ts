import Scroll from "./scroll"

export default class Framework {
  scroll: Scroll
  content: Element
  template: string
  constructor() {
    this.content = document.querySelector(".content")
    this.template = this.content.getAttribute("data-template")
    this.scroll = new Scroll(this.template)
  }
}
