const fs = require('fs')

const getFilesInTheFolder = async (folderPath) => {
  return await fs.promises.readdir(folderPath)
}

module.exports = {
  getFilesInTheFolder
}
