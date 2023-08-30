Utility that allows to generate **Jetpack Compose** code for design tokens from **Token Studio**

As advanced feature it supports [Multi-dimensional themes](https://docs.tokens.studio/themes/themes-pro)

### Requirements
1. Install npm & node ([link](https://nodejs.org/en/download))

### How to use generate **.kt** files:
1. Change **packageName** in **config.js**
2. Replace data in **/tokens** package
3. Run **npm i** from the root of utility
4. Run **node config.js** from the root of utility
5. Copy content from **/build/compose** and move it into work project
6. In case of non empty **/build/compose/TokenFonts.kt**
 * Provide required ***.ttf** fonts into **/res/font** of work project
 * Add **R** import into **TokenFonts.kt** of work project

### Links:
* [Style Dictionary](https://github.com/amzn/style-dictionary)
* [Token Studio](https://tokens.studio/)
* [Style Dictionary utilities from Token Studio](https://github.com/tokens-studio/sd-transforms)