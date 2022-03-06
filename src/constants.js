const SITE_ROOT = process.env.NODE_ENV == 'production'
    ? 'https://youtube-house-party.herokuapp.com/'
    : 'http://localhost:3001'

export const API_ROOT = `${SITE_ROOT}`
//export const API_ROOT = 'http://localhost:3001'
