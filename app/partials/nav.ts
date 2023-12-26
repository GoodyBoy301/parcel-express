import { $App } from ".."

export default class Nav {
  app: $App
  elements: HTMLElement[]
  pages: {
    home: string
    // longPage: string
  }
  titles: {
    home: string
    // "long-page": string
  }
  constructor(app: $App) {
    this.app = app
    this.create()
    this.pages = {
      home: "",
      // longPage: "long-page",
    }
    this.titles = {
      home: "",
      // "long-page": "",
    }
  }

  create() {
    window.addEventListener("popstate", this.back.bind(this))

    this.elements = window.$$("a[nav]")
    this.elements.forEach((element, index) => {
      if (innerWidth < 760) return
      element.onclick = async (e) => {
        e.preventDefault()
        const target = e.target as HTMLAnchorElement
        await this.ready(target.href, true)
      }
    })
  }

  resize() {}
  destroy() {}

  navigate() {
    this.create()
  }

  async ready(href: string, push = true) {
    const [html, template] = await this.go(event)
    this.app.page.destroy()
    Object.values(this.app.partials).forEach((partial) => partial.destroy())
    this.app.content.innerHTML = html
    this.app.content.setAttribute("data-template", template)
    this.app.template = this.app.content.getAttribute("data-template")
    push && history.pushState({}, "", this.pages[template])
    this.app.page = this.app.pages[this.app.template]
    this.app.page.navigate()
    this.app.scroll.navigate(this.app.template)
    Object.values(this.app.partials).forEach((partial) => partial.navigate())
    document.title = this.titles[this.pages[this.app.template]]
    this.app.scroll.lenis.scrollTo(0, { immediate: true })
    this.menuClose()
  }

  async go({ target }) {
    const { href } = target
    const request = await fetch(href)
    if (request.ok) {
      const html = await request.text()
      const div = document.createElement("div")
      div.innerHTML = html
      const content = div.querySelector(".content")
      const template = content.getAttribute("data-template")
      return [content.innerHTML, template]
    } else {
      console.log(`could not fetch ${href}`)
    }
  }

  async back() {
    if (innerWidth < 760) return
    location.reload()
  }

  menuOpen() {
    this.app.scroll.lenis.stop()
  }

  async menuClose() {
    this.app.scroll.lenis.start()
  }
}
