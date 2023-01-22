# Lottie Colorizer

This is a simple tool to recolor a Lottie JSON file. It's ment to quickly generate dark mode variants of Lottie animations by replacing a set of colors with other colors. The colors are defined in a config file (see example-config.json). The colors are defined as ARGB hex strings.

### Installation
```
git clone https://github.com/crysxd/LottieColorizer
cd LottieColorizer
npm install -g
```

### Test your configuration
```
colorize show-config path/to/config.json
```

### Colorize a Lottie file
```
colorize single path/to/config.json input-lottie.json output-lottie.json
```
