const set = require('lodash/set')
const get = require('lodash/get')

const db = {
  'id': {
    some: 'data'
  }
}

module.exports = {
  video(user, data) {
    set(db, user, data)
    return get(db, user)
  },

  image(db, user, data) {
    set(db, user, data)
    return get(db, user)
  },

  location(db, user, data) {
    set(db, user, data)
    return get(db, user)
  },

  getUserData(user) {
    return get(db, user)
  }
}
