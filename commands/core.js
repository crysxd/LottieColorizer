const fs = require('fs');
const { exit } = require('process');

function loadLut(lutFile) {
    const json = fs.readFileSync(lutFile)
    const lut = JSON.parse(json)
    const colorRegex = new RegExp('^#[0-9a-fA-F]{8}$');

    const invalidEntries = [];
    Object.keys(lut).forEach((key) => {
        if (!key.match(colorRegex)) {
            invalidEntries.push(`${key} is not a valid source color, must be a ARGB hex color: #00000000`)
        } else if (typeof lut[key] !== 'string') {
            invalidEntries.push(`Replacement value for ${key} is not a valid replacement color, must be a ARGB hex string`)
        } else if (!lut[key].match(colorRegex)) {
            invalidEntries.push(`Replacement value ${lut[key]} for original color ${key} is not a valid replacement color, must be a ARGB hex color: #00000000`)
        } else {
            lut[key] = lut[key].toUpperCase()
        }
    });

    if(invalidEntries.length == 0) {
        return lut
    } else {
        console.error(`${lutFile} contains errors:`)
        invalidEntries.forEach((line) => {
            console.error(line)
        })
        exit(1)
    }
}

function processFile(lutFile, source, dest) {
    const lut = loadLut(lutFile)
    const json = fs.readFileSync(source)
    const lottie = JSON.parse(json)
    var replacementCount = 0
    
    const replaceInObject = (obj, jsonPath) => {
        Object.keys(obj).forEach((key) => {
            if (key == 'k' && isColor(obj['k'])) {
                const oldColor = jsonToHex(obj['k'])
                const newColor = lut[oldColor] || oldColor
                if (oldColor != newColor) {
                    obj['k'] = hexToJson(newColor)
                    replacementCount++
                }
            } else if (typeof obj[key] === 'object') {
                replaceInObject(obj[key])
            }
        })
    }

    replaceInObject(lottie, new Array())
    fs.writeFileSync(dest, JSON.stringify(lottie))
    console.log(`Replaced ${replacementCount} colors in ${source} => ${dest}`)
}    

function isColor(json) {
    return Array.isArray(json) && json.length == 4 && typeof json[0] == 'number'
}

function hexToJson(hex) {
    return [
        parseInt(hex.substring(3, 4), 16) / 255.0, // R
        parseInt(hex.substring(5, 6), 16) / 255.0, // G
        parseInt(hex.substring(7, 8), 16) / 255.0, // B
        parseInt(hex.substring(1, 2), 16) / 255.0, // A
    ]
}

function jsonToHex(json) {
    const parse = (index) => {
        const hex =  Math.round((json[index] || 0) * 255).toString(16)
        const fixed = `0${hex}`
        return fixed.substring(fixed.length - 2)
    }

    const r = parse(0)
    const g = parse(1)
    const b = parse(2)
    const a = parse(3)
    return `#${a}${r}${g}${b}`.toUpperCase()
}

module.exports.loadLut = loadLut
module.exports.processFile = processFile