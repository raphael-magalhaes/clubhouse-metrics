require('dotenv').config()

const FileSystem = require('./infrastructure').FileSystem
const ClubhouseController = require('./controllers/ClubhouseController')
const LeadTimeController = require('./controllers/LeadTimeController')

const main = async () => {
  let clubhouseData = null
  if (process.env.USE_LOCAL_CLUBHOUSE_DATA === 'true') {
    clubhouseData = FileSystem.readFile('./data/clubhouseData.json')
  } else {
    const config = { onlyStoriesInAnIteration: false }
    clubhouseData = await ClubhouseController.getClubhouseData(config)
  }

  LeadTimeController.getStoriesLeadTimeByStates(clubhouseData)
}

main()
