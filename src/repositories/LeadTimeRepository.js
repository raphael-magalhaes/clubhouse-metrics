const FileSystem = require('../infrastructure/FileSystem')
const Logger = require('../infrastructure').Logger

const saveStoriesLeadTimeByStateAsCSV = async data => {
  const config = {
    header: true,
    columns: [
      { key: 'projectName', header: 'Project' },
      { key: 'iterationName', header: 'Iteration' },
      { key: 'archived', header: 'Archived' },
      { key: 'completed', header: 'Completed' },
      { key: 'storyId', header: 'Story Id' },
      { key: 'storyName', header: 'Story Name' },
      { key: 'Inbox' },
      { key: 'Backlog' },
      { key: 'Doing' },
      { key: 'Reviewing' },
      { key: 'Project Done' },
      { key: 'Complete' },
      { key: 'Product Backlog' },
      { key: 'Backlog (prioritized)' },
      { key: 'Backlog (Prioritized)' },
      { key: 'Ready' },
      { key: 'Ready for Development' },
      { key: 'Developing' },
      { key: 'Copy Review' },
      { key: 'Done' },
      { key: 'Staged' },
      { key: 'Released' },
      { key: 'Closed' },
      { key: 'Hi-Fidelity Prototyping' }
    ]
  }

  await FileSystem.saveAsCSV(data, 'data/output.csv', config)
  Logger('The output was saved in data/output.csv.')
}

const LeadTimeRepository = {
  saveStoriesLeadTimeByStateAsCSV
}

module.exports = LeadTimeRepository
