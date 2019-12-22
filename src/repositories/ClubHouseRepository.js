const http = require('../infrastructure/HTTP')

const getStoryHistoryByIdConfig = storyId => ({
  headers: {
    authority: 'app.clubhouse.io',
    pragma: 'no-cache',
    'cache-control': 'no-cache',
    'clubhouse-organization': process.env.CLUBHOUSE_ORGANIZATION,
    'clubhouse-page': 'story',
    'content-type': 'application/json; charset=utf-8',
    accept: '*/*',
    'x-requested-with': 'XMLHttpRequest',
    'clubhouse-company': process.env.CLUBHOUSE_COMPANY,
    'sec-fetch-site': 'same-origin',
    'sec-fetch-mode': 'cors',
    referer: `https://app.clubhouse.io/${process.env.CLUBHOUSE_ORGANIZATION_SLUG}/story/${storyId}`,
    cookie: `clubhouse-session=${process.env.CLUBHOUSE_USER_SESSION_TOKEN};`
  },
  uri: `https://app.clubhouse.io/backend/api/private/stories/${storyId}/history`,
  method: 'GET'
})

const getStoryHistoryById = async id => {
  const config = getStoryHistoryByIdConfig(id)
  const callback = (error, response, body) => body

  const response = await http.call(config, callback)

  return JSON.parse(response)
}

const ClubHouseRepository = {
  getStoryHistoryById
}

module.exports = ClubHouseRepository
