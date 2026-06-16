const Jimp = require('jimp')
const fs = require('fs')
const path = require('path')

const inputDir = './public/mockup-photos'
const files = fs.readdirSync(inputDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i))

async function compress() {
  for (const file of files) {
    const inputPath = path.join(inputDir, file)
    const beforeSize = fs.statSync(inputPath).size
    
    const image = await Jimp.read(inputPath)
    await image
      .resize(800, Jimp.AUTO)
      .quality(75)
      .writeAsync(inputPath)
    
    const afterSize = fs.statSync(inputPath).size
    console.log(`✓ ${file}: ${Math.round(beforeSize/1024)}KB → ${Math.round(afterSize/1024)}KB`)
  }
  console.log('All done!')
}

compress()