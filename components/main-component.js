import { SimpleReactive } from '../simple-reactive.js'

export default class MainComponent extends SimpleReactive {

  created () {
    this.data.counter = 0
    this.data.checkbox = true
  }

  get template () {
    return `
    <div>received {{counter}} clicks <button onclick="add(event)">click me</button></div>
    <div class="${this.data.checkbox ? 'red' : ''}">checkbox checked {{checkbox}} <label>reactive checkbox <input type="checkbox" ${this.data.checkbox ? 'checked' : ''} onchange="check(event)"></label></div>`
  }

  add (event) {
    this.data.counter++
  }

  check (event) {
    this.data.checkbox = !this.data.checkbox
  }
}
