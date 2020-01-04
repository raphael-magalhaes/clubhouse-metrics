require('dotenv').config()

const FileSystem = require('./infrastructure/FileSystem')
const ClubhouseController = require('./controllers/ClubhouseController')
const LeadTimeController = require('./controllers/LeadTimeController')

const main = async () => {
  const localClubhouseData = FileSystem.readFile('./data/clubhouseData.json')
  let clubhouseData = null

  if (localClubhouseData) {
    clubhouseData = localClubhouseData
  } else {
    const config = { onlyStoriesInAnIteration: false }
    clubhouseData = await ClubhouseController.getClubhouseData(config)
  }

  LeadTimeController.getStoriesLeadTimeByStates(clubhouseData)
}

main()
