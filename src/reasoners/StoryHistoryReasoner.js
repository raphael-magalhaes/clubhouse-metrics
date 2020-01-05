const moment = require('moment')
const Logger = require('../infrastructure/Logger')

const isWorkflowStateAction = actionEntry =>
  (actionEntry.entity_type === 'story' && actionEntry.action != null) ||
  (actionEntry.changes && actionEntry.changes.workflow_state_id != null) ||
  actionEntry.action === 'create'

const isWorkflowStateIdEqual = (actionEntry, referenceEntry) =>
  actionEntry.changes && actionEntry.changes.workflow_state_id != null ? actionEntry.changes.workflow_state_id.new === referenceEntry.id : true

const getWorkflowName = (references = [], actionEntry) => {
  let workflowName = null

  references.forEach(referenceEntry => {
    if (!isWorkflowStateIdEqual(actionEntry, referenceEntry) || referenceEntry.entity_type !== 'workflow-state') return

    workflowName = referenceEntry.name
  })

  return workflowName
}

const getStateChanges = story => {
  const { projectName, iterationName, archived, completed, name: storyName, id: storyId, history } = story
  const processedData = []

  if (!history) {
    Logger(
      `The story id ${storyId} "${storyName}" does not have a history so it will be skipped. That may was caused by fetching only stories that have an iteration id.`
    )
  }

  history.forEach(historyEntry => {
    historyEntry.actions.forEach(actionEntry => {
      if (!isWorkflowStateAction(actionEntry)) return

      let workflowStateName = getWorkflowName(historyEntry.references, actionEntry)

      if (workflowStateName) {
        processedData.push({
          projectName,
          iterationName,
          archived,
          completed,
          storyId,
          storyName,
          actionType: actionEntry.action,
          stateName: workflowStateName,
          changed_at: historyEntry.changed_at
        })
      }
    })
  })
  return processedData
}

const processStateChanges = stories => {
  const storiesLeadTime = []

  for (const storyIdProperty in stories) {
    if (stories.hasOwnProperty(storyIdProperty)) {
      const storyId = storyIdProperty
      const story = stories[storyId]
      let storyLeadTime = {}

      story.forEach((stateChangeEntry, index) => {
        if (index + 1 === story.length) return
        const hours = calculateDaysBetween(stateChangeEntry.changed_at, story[index + 1].changed_at)

        storyLeadTime.projectName = stateChangeEntry.projectName
        storyLeadTime.iterationName = stateChangeEntry.iterationName
        storyLeadTime.archived = String(stateChangeEntry.archived)
        storyLeadTime.completed = String(stateChangeEntry.completed)
        storyLeadTime.storyId = stateChangeEntry.storyId
        storyLeadTime.storyName = `${stateChangeEntry.storyId} ${stateChangeEntry.storyName}`
        storyLeadTime[stateChangeEntry.stateName] =
          storyLeadTime[stateChangeEntry.stateName] != null ? storyLeadTime[stateChangeEntry.stateName] + hours : hours
      })

      storiesLeadTime.push(storyLeadTime)
    }
  }
  return storiesLeadTime
}

const calculateDaysBetween = (start, end) => {
  const startDate = moment(start)
  const endDate = moment(end)

  const duration = moment.duration(endDate.diff(startDate))

  return duration.asDays()
}

const StoryHistoryReasoner = {
  getStateChanges,
  processStateChanges
}

module.exports = StoryHistoryReasoner
