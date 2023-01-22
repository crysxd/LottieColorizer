const { loadLut } = require('./core')

function list (lutFile) {
    const lut = loadLut(lutFile)
    console.log(`Following colors are listed in ${lutFile}:`)
    Object.keys(lut).forEach((key) => {
        console.log(`  - ${key} => ${lut[key]}`)
    })
}

module.exports = list
