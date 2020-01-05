const FileSystem = require('../infrastructure').FileSystem

const StoryHistoryReasoner = require('../reasoners/StoryHistoryReasoner')
const LeadTimeRepository = require('../repositories/LeadTimeRepository')

const getIterationNameById = (id, iterations) => {
  let iterationName = null

  for (const iteration of iterations) {
    if (iteration.id === id) iterationName = iteration.name
  }
  return iterationName
}

class LeadTimeController {
  getStoriesLeadTimeByStates = clubhouseData => {
    const storiesByIterationByProject = {}

    for (const project of clubhouseData.projects) {
      storiesByIterationByProject[project.id] = {}

      for (const story of project.stories) {
        if (!storiesByIterationByProject[project.id][story.iteration_id]) storiesByIterationByProject[project.id][story.iteration_id] = []

        storiesByIterationByProject[project.id][story.iteration_id].push({
          ...story,
          iterationName: getIterationNameById(story.iteration_id, clubhouseData.iterations),
          projectName: project.name
        })
      }
    }

    FileSystem.debug.saveAsJSON(storiesByIterationByProject, `debug/storiesByIterationByProject.json`)

    this.processStoryHistory(storiesByIterationByProject)
  }

  processStoryHistory = async projects => {
    const storiesHistory = {}

    for (const projectId in projects) {
      if (projects.hasOwnProperty(projectId)) {
        const project = projects[projectId]

        for (const iterationId in project) {
          if (project.hasOwnProperty(iterationId)) {
            const iteration = project[iterationId]

            for (const story of iteration) {
              const processedData = StoryHistoryReasoner.getStateChanges(story)
              storiesHistory[story.id] = processedData
            }
          }
        }
      }
    }

    const storiesLeadTimeByStates = await StoryHistoryReasoner.processStateChanges(storiesHistory)

    await FileSystem.debug.saveAsJSON(storiesHistory, `debug/processedStoryHistory.json`)
    await FileSystem.debug.saveAsJSON(storiesLeadTimeByStates, `debug/processedStatesChanges.json`)

    LeadTimeRepository.saveStoriesLeadTimeByStateAsCSV(storiesLeadTimeByStates)
  }
}

module.exports = new LeadTimeController()
