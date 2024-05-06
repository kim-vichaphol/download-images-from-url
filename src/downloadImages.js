const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const axios = require('axios')

const optimizeImage = async (imageBuffer) => {
  try {
    const optimizedBuffer = await sharp(imageBuffer)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer()

    return optimizedBuffer
  } catch (error) {
    throw error
  }
}

const downloadImages = async ({ csvFilePath, folderPath, optimizeImages = false }) => {
  const failedUrls = []

  try {
    const csvData = await fs.promises.readFile(csvFilePath, 'utf-8')
    const imageUrls = csvData.trim().split('\n')

    await fs.promises.mkdir(folderPath, { recursive: true })

    console.log('Total images to be downloaded', imageUrls.length)

    for (const imageUrl of imageUrls) {
      const fileName = path.basename(imageUrl)
      const filePath = path.join(folderPath, fileName)

      const isFileAlreadyExisted = await fs.promises.access(filePath, fs.constants.F_OK).then(
        () => true,
        () => false
      )
      if (isFileAlreadyExisted) {
        console.log(`Skipping ${filePath} as it already exists.`)
        continue
      }

      try {
        const response = await axios.get(imageUrl, {
          responseType: optimizeImages ? 'arraybuffer' : 'stream'
        })

        if (optimizeImages) {
          const optimizedBuffer = await optimizeImage(response.data)
          await fs.promises.writeFile(filePath, optimizedBuffer)
          console.log(`Downloaded and optimized: ${fileName}`)
        } else {
          const writer = fs.createWriteStream(filePath)
          response.data.pipe(writer)
          await new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
          })
          console.log(`Downloaded and saved: ${filePath}`)
        }
      } catch (error) {
        console.error(`Error downloading and optimizing ${imageUrl}: `, error)
        failedUrls.push(imageUrl)
      }
    }

    console.log(`\nAll images downloaded successfully!\n`)

    failedUrls.forEach((failedUrl) => {
      console.log(`Failed URL: ${failedUrl}`)
    })
  } catch (error) {
    console.error('Error downloading images:', error)
  }
}

module.exports = {
  downloadImages
}
