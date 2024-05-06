const fs = require('fs')
const path = require('path')

const checkForFilesExceedingLimit = async (folderContents, folderPath, limit) => {
  let largeFiles = 0
  for (const fileName of folderContents) {
    const filePath = path.join(folderPath, fileName)
    const fileStats = await fs.promises.stat(filePath)
    if (fileStats.size > limit * 1024 * 1024) {
      console.log(`Found a file larger than ${limit} MB: ${fileName} (${(fileStats.size / 1024 / 1024).toFixed(2)} MB)`)
      largeFiles++
    }
  }

  if (largeFiles > 0) {
    console.log(`\nThere are ${largeFiles} file(s) larger than ${limit} MB in the ${folderPath} folder.`)
  } else {
    console.log(`\nAll files in the download folder are smaller than ${limit} MB.`)
  }
}

module.exports = {
  checkForFilesExceedingLimit
}
