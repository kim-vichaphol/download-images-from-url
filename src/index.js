const { checkForFilesExceedingLimit } = require('./checkForFilesExceedingLimit')
const { downloadImages } = require('./downloadImages')
const { getFilesInTheFolder } = require('./getFilesInTheFolder')

const CSV_FILE_NAME = 'image-urls.csv'
const DOWNLOADED_FOLDER = 'downloaded_images'

const main = async () => {
  await downloadImages({ csvFilePath: CSV_FILE_NAME, folderPath: DOWNLOADED_FOLDER, optimizeImages: true })
  // await downloadImages(CSV_FILE_NAME, DOWNLOADED_FOLDER)

  // Count total files downloaded
  const totalFiles = await getFilesInTheFolder(DOWNLOADED_FOLDER)
  const numberOfTotalFiles = totalFiles.length
  console.log(`Total number of files in the ${DOWNLOADED_FOLDER} folder: ${numberOfTotalFiles}`)

  // Check for files that has size exceeding limits
  await checkForFilesExceedingLimit(totalFiles, DOWNLOADED_FOLDER, 512)
}

main()
