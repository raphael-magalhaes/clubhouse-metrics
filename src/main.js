require('dotenv').config()

const ClubHouseRepository = require('./repositories/ClubHouseRepository')
const FileSystem = require('./infrastructure/FileSystem')

const main = async () => {
  const storyId = 9862
  const result = await ClubHouseRepository.getStoryHistoryById(storyId)

  FileSystem.save(result, `data/story-${storyId}-history.json`)
}

main()
