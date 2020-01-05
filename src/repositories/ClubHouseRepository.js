const http = require('../infrastructure').HTTP
const FileSystem = require('../infrastructure/FileSystem')

const CLUBHOUSE_API_TOKEN = process.env.CLUBHOUSE_API_TOKEN

const CLUBHOUSE_ORGANIZATION = process.env.CLUBHOUSE_ORGANIZATION
const CLUBHOUSE_COMPANY = process.env.CLUBHOUSE_COMPANY
const CLUBHOUSE_ORGANIZATION_SLUG = process.env.CLUBHOUSE_ORGANIZATION_SLUG
const CLUBHOUSE_USER_SESSION_TOKEN = process.env.CLUBHOUSE_USER_SESSION_TOKEN

const doCall = async config => await http.call(config, async (error, response, body) => body)

const getProjects = async () => {
  const config = {
    url: 'https://api.clubhouse.io/api/beta/projects?token=' + CLUBHOUSE_API_TOKEN,
    headers: {
      'content-type': 'application/json; charset=utf-8'
    },
    json: true
  }

  return await doCall(config)
}

const getWorkflows = async () => {
  const config = {
    url: 'https://api.clubhouse.io/api/v3/workflows?token=' + CLUBHOUSE_API_TOKEN,
    headers: {
      'content-type': 'application/json; charset=utf-8'
    },
    method: 'GET',
    json: true
  }

  return await doCall(config)
}

const getIterations = async () => {
  const config = {
    url: 'https://api.clubhouse.io/api/v3/iterations?token=' + CLUBHOUSE_API_TOKEN,
    headers: {
      'content-type': 'application/json; charset=utf-8'
    },
    method: 'GET',
    json: true
  }

  return await doCall(config)
}

const getStoriesByProjectId = async id => {
  const config = {
    url: 'https://api.clubhouse.io/api/beta/stories/search?token=' + CLUBHOUSE_API_TOKEN,
    headers: {
      'content-type': 'application/json; charset=utf-8'
    },
    method: 'POST',
    json: true,
    body: { project_ids: [id] }
  }

  return await doCall(config)
}

const getStoryHistoryById = async (id, name) => {
  const config = {
    headers: {
      authority: 'app.clubhouse.io',
      pragma: 'no-cache',
      'cache-control': 'no-cache',
      'clubhouse-organization': CLUBHOUSE_ORGANIZATION,
      'clubhouse-page': 'story',
      'content-type': 'application/json; charset=utf-8',
      accept: '*/*',
      'x-requested-with': 'XMLHttpRequest',
      'clubhouse-company': CLUBHOUSE_COMPANY,
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'cors',
      referer: `https://app.clubhouse.io/${CLUBHOUSE_ORGANIZATION_SLUG}/story/${id}`,
      cookie: `clubhouse-session=${CLUBHOUSE_USER_SESSION_TOKEN};`
    },
    uri: `https://app.clubhouse.io/backend/api/private/stories/${id}/history`,
    method: 'GET'
  }

  return await doCall(config)
}

const saveProjects = projects => FileSystem.debug.saveAsJSON(projects, `debug/projects.json`)

const saveWorkflows = workflows => FileSystem.debug.saveAsJSON(workflows, `debug/workflows.json`)

const saveIterations = iterations => FileSystem.debug.saveAsJSON(iterations, `debug/iterations.json`)

const saveAllStoriesByProject = (stories, projectId) => FileSystem.debug.saveAsJSON(stories, `debug/allStoriesOfProject${projectId}.json`)

const saveEachStoryWithItsHistoryByProject = (story, projectId) => FileSystem.debug.saveAsJSON(story, `debug/stories/project${projectId}Story${story.id}.json`)

const saveClubhouseData = clubhouseData => FileSystem.saveAsJSON(clubhouseData, `data/clubhouseData.json`)

const ClubhouseRepository = {
  getProjects,
  getWorkflows,
  getIterations,
  getStoriesByProjectId,
  getStoryHistoryById,
  saveProjects,
  saveWorkflows,
  saveIterations,
  saveAllStoriesByProject,
  saveEachStoryWithItsHistoryByProject,
  saveClubhouseData
}

module.exports = ClubhouseRepository
