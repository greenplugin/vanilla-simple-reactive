export class SimpleReactive {
  element = 'simple-reactive'
  id = Math.random().toString(36).substr(2, 9)

  constructor () {
    if (!document.simpleReactiveRegistry) {
      document.simpleReactiveRegistry = {}
    }
    document.simpleReactiveRegistry[this.instanceKey] = this
    const instance = this
    Object.defineProperty(this, 'data', {
      value: new Proxy({}, {
        get (target, name) {
          if (target[name] === undefined) {
            throw new Error(`${name} not found in data`)
          }
          console.info(name, target[name])
          return target[name]
        },
        set (target, p, value, proxy) {
          target[p] = value
          if (instance._created) {
            instance.render()
          }
          return true
        }
      }),
      writable: false
    })
    if (this.created instanceof Function) {
      this.created()
    }
  }

  get myPathInRegistry () {
    return `document.simpleReactiveRegistry['${this.instanceKey}']`
  }

  get instanceName () {
    return this.constructor.name
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
      .toLowerCase()
  }

  get instanceKey () {
    return '_' + this.instanceName + '_' + this.id
  }

  get preparedTemplate () {
    return this.template.replace(/on([a-z].+?)="(.+?)"/g, (match, event, method) => {
      return `on${event}="${this.myPathInRegistry}.${method}"`
    }).replace(/{{(.+?)}}/g, (match, p1) => {
      if (p1 === undefined) {
        throw new Error(`${p1} not found in component`)
      }
      return this.data[p1]
    })
  }

  get wrappedTemplate () {
    return `<${this.instanceName} simple-reactive="${this.instanceKey}">${this.preparedTemplate}</${this.instanceName}>`
  }

  render () {
    if (this.element) {
      const element = document.querySelector(`[simple-reactive="${this.instanceKey}"]`)
      console.info(element)
      element.innerHTML = this.preparedTemplate
    }
  }

  _beforeBind () {
    if (this.beforeBind instanceof Function) {
      this.beforeBind()
    }
    Object.defineProperty(this, '_created', {value: true, writable: true})
  }

  bind (selector) {
    this._beforeBind()
    document.querySelector(selector).innerHTML = this.wrappedTemplate
  }

  toString () {
    this._beforeBind()
    return this.wrappedTemplate
  }
}
