const ExtendableError = require('es6-error')

class LanguageError extends ExtendableError {
  constructor (message, code) {
    super(message)
    this.code = code || 1
  }
}

class LoopbackError extends LanguageError {
  constructor (message, code) {
    super(message)
    this.code = code || 2
  }
}

module.exports = {
  LanguageError,
  LoopbackError
}
