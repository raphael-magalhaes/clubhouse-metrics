const Logger = require('../infrastructure').Logger

const ClubhouseRepository = require('../repositories/ClubhouseRepository')

const getProjects = async () => {
  Logger('Fetching all projects.', 'fetchProjects')
  const projects = await ClubhouseRepository.getProjects()
  Logger('Fetched all projects in #{time} seconds.', 'fetchProjects')

  ClubhouseRepository.saveProjects(projects)
  return projects
}

const getWorkflows = async () => {
  Logger(`Fetching all workflows.`, 'fetchWorkflows')
  const workflows = await ClubhouseRepository.getWorkflows()
  Logger(`Fetched all workflows in #{time} seconds.`, 'fetchWorkflows')

  ClubhouseRepository.saveWorkflows(workflows)
  return workflows
}

const getIterations = async () => {
  Logger(`Fetching all iterations.`, 'fetchIterations')
  const iterations = await ClubhouseRepository.getIterations()
  Logger(`Fetched all iterations in #{time} seconds.`, 'fetchIterations')

  ClubhouseRepository.saveIterations(iterations)
  return iterations
}

getAllStoriesByProject = async projects => {
  for (const project of projects) {
    Logger(`Fetching all stories for project ${project.id}: ${project.name}`, `fetchAllStoriesByProject${project.id}`)
    project.stories = await ClubhouseRepository.getStoriesByProjectId(project.id)
    Logger(`Fetched all stories for project ${project.id}: ${project.name} in #{time} seconds.`, `fetchAllStoriesByProject${project.id}`)

    ClubhouseRepository.saveAllStoriesByProject(project.stories, project.id)
  }
}

const getEachStoryHistoryByProject = async (projects, onlyStoriesInAnIteration) => {
  Logger(`Starting to fetch every stories' history for all projects.`, 'fetchStoriesHistoryForAllProjects')

  for (const projectProperty in projects) {
    const projectId = projectProperty
    const project = projects[projectId]

    Logger(`Fetching every stories' history for project ${project.name}.`, `fetchStoriesHistoryForProject${project.id}`)

    const total = project.stories.length
    for (const story of project.stories) {
      if (onlyStoriesInAnIteration && !story.iteration_id) {
        Logger(
          `${project.name} | Story ${story.id} history will not be fetched because it does not have an iteration id. It is possible to disable this by setting the parameter onlyStoriesInAnIteration to false.`
        )
        continue
      }

      const current = project.stories.indexOf(story) + 1
      Logger(`${project.name} | Fetching story ${story.id} history (${current}/${total}): ${story.name}`)

      const history = await ClubhouseRepository.getStoryHistoryById(story.id, story.name)
      story.history = JSON.parse(history)

      ClubhouseRepository.saveEachStoryWithItsHistoryByProject(story, projectId)
    }

    Logger(`Fetched every stories' history for project ${project.name} in #{time} seconds.`, `fetchStoriesHistoryForProject${project.id}`)
  }

  Logger(`Fetched every stories' history for all projects in #{time} seconds.`, 'fetchStoriesHistoryForAllProjects')
}

class ClubhouseDataController {
  getClubhouseData = async ({ onlyStoriesInAnIteration = false }) => {
    const clubhouseData = {
      projects: [],
      workflows: [],
      iterations: []
    }

    Logger('Starting to fetch data from Clubhouse.', 'fetchAllClubhouseData')

    clubhouseData.projects = await getProjects()
    clubhouseData.workflows = await getWorkflows()
    clubhouseData.iterations = await getIterations()

    await getAllStoriesByProject(clubhouseData.projects)
    await getEachStoryHistoryByProject(clubhouseData.projects, onlyStoriesInAnIteration)

    Logger(`Finished fetching data in #{time} seconds.`, 'fetchAllClubhouseData')

    ClubhouseRepository.saveClubhouseData(clubhouseData)

    return clubhouseData
  }
}

module.exports = new ClubhouseDataController()
