import gsap from "gsap"
import { images } from "./classes/assets"
import Framework from "./classes/framework"
import Scroll from "./classes/scroll"
import Home from "./pages/Home"
import Nav from "./partials/nav"

declare global {
  interface Window {
    app: App
    $(el: string): HTMLElement
    $$(el: string): HTMLElement[]
  }
}

export interface $App {
  page: Home
  pages: {
    home: Home
    // longPage: Home
  }
  partials: { nav: Nav }
  scroll: Scroll
  content: Element
  template: string
  createPages(): void
  createPartials(): void
}

class App extends Framework implements $App {
  pages: {
    home: Home
    // longPage: Home
  }
  partials: { nav: Nav }
  page: Home

  constructor() {
    super()
    this.createPages()
    this.createPartials()
    this.preload()
    window.onresize = () => this.onresize()
  }

  preload() {
    const length = images.length
    let counter = 1
    images.forEach((image) => {
      const img = new Image()
      img.src = image
      img.crossOrigin = "anonymous"
      img.onload = () => {
        if (counter === length) {
          window.$(".app").classList.remove("preloading")
        }
        counter++
      }
    })
    if (images.length === 0) window.$(".app").classList.remove("preloading")
  }

  createPartials() {
    this.partials = {
      nav: new Nav(this),
    }
  }
  createPages() {
    this.pages = {
      home: new Home(this),
      // longPage: new Home(this),
    }
    this.page = this.pages[this.template]
    this.page.create()
  }

  onresize() {
    Object.values(this.pages).forEach((page) => page.resize())
    Object.values(this.partials).forEach((partial) => partial.resize())
  }
}

window.$ = (el: string) => document.querySelector(el)
window.$$ = (el: string) => gsap.utils.toArray(el)
window.app = new App()
