import Lenis from "@studio-freight/lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
gsap.registerPlugin(ScrollTrigger)

interface LenisEvent {
  animate: {
    value: number
    from: number
    to: number
    lerp: number
    duration: number
    isRunning: boolean
  }
  animatedScroll: number
  dimensions: { wrapper: Window; content: HTMLElement }
  direction: 1 | -1
  options: { wrapper: Window; content: HTMLElement }
  targetScroll: number
  time: number
  velocity: number
  __isLocked: boolean
  __isScrolling: boolean
  __isSmooth: true
  __isStopped: boolean
  actualScroll: number
  className: string
  isHorizontal: boolean
  isLocked: boolean
  isScrolling: boolean
  isSmooth: boolean
  isStopped: boolean
  limit: number
  progress: number
  scroll: number
}

export default class Scroll {
  lenis: Lenis
  constructor(page: string) {
    this.create(page)
  }

  create(page: string) {
    this.lenis = new Lenis({
      smoothTouch: page === "home" && innerWidth >= 768 ? true : false,
      wrapper: innerWidth >= 768 ? window : window.$(".app"),
    })

    this.lenis.on("scroll", ScrollTrigger.update)
    gsap.ticker.lagSmoothing(0)
    requestAnimationFrame(this.raf.bind(this))
  }

  navigate(page: string) {
    this.lenis.reset()
    this.create(page)
  }

  raf(time: number) {
    this.lenis.raf(time)
    requestAnimationFrame(this.raf.bind(this))
  }
}
