const packageName = `my.example.com`;

const { registerTransforms, permutateThemes } = require(`@tokens-studio/sd-transforms`);
const StyleDictionary = require(`style-dictionary`);
const fs = require(`fs`);
const toPascalCase = require(`./src/utils/toPascalCase`);

const fontsPath = `./build/compose/themes`;
const fontsFile = `${fontsPath}/TokenFonts.kt`;

registerTransforms(StyleDictionary);

let sd;

fs.mkdirSync(fontsPath, { recursive: true });
fs.writeFileSync(fontsFile, ``);

let $themes = JSON.parse(fs.readFileSync(`tokens/$themes.json`, `utf-8`));
let themes = permutateThemes($themes, { seperator: `_` });

let tokenThemesConfig = Object.entries(themes).map(([_, tokensets]) => {
  let metadata = fs.readFileSync(`tokens/$metadata.json`, `utf8`);
  let tokenSetOrder = JSON.parse(metadata).tokenSetOrder;
  let structuredName = ``;
  tokenSetOrder = tokenSetOrder.filter(tokenSet => tokenSet.includes(`/`));
  tokenSetOrder.forEach(orderSet => {
    tokensets
      .filter(set => orderSet == set)
      .forEach(set => { 
        structuredName = structuredName + set.split(`/`)[1] + `-`;
      });
  });
  structuredName = structuredName.slice(0, -1);
  
  return ({
    source: tokensets.map(tokenset => `tokens/${tokenset}.json`),
    format: {
      composeTokenThemes: require(`./src/formats/compose_TokenThemes`),
    },
    transform: {
      textUnit: require(`./src/transforms/textUnit`),
      dp: require(`./src/transforms/dp`),
      textStyle: require(`./src/transforms/textStyle`),
      opacity: require(`./src/transforms/opacity`),
    },
    platforms: {
      compose: {
        buildPath: `build/compose/themes/`,
        transforms: [
          `attribute/cti`, `name/cti/camel`, `color/composeColor`,
          `textUnit`, `dp`, `textStyle`, `opacity`
        ],
        files: [
          {
            destination: `TokenTheme_${toPascalCase(structuredName)}.kt`,
            format: `composeTokenThemes`,
            className: `TokenTheme_${toPascalCase(structuredName)}`,
            packageName: packageName,
            options: {
              outputReferences: true
            }
          }
        ]
      }
    }
  })
});

tokenThemesConfig.forEach(cfg => {
  sd = StyleDictionary.extend(cfg);
  sd.buildAllPlatforms();
});

let possibleTokensets = Object.entries(themes)[0][1];

let tokenThemeConfig = {
  source: possibleTokensets.map(tokenset => `tokens/${tokenset}.json`),
  format: {
    composeTokenTheme: require(`./src/formats/compose_TokenTheme`),
  },
  platforms: {
    compose: {
      buildPath: `build/compose/`,
      transforms: [
        `attribute/cti`, `name/cti/camel`,
      ],
      files: [
        {
          destination: `TokenTheme.kt`,
          format: `composeTokenTheme`,
          className: `TokenTheme`,
          packageName: packageName
        }
      ]
    }
  }
};

sd = StyleDictionary.extend(tokenThemeConfig);
sd.buildAllPlatforms();

let tokensConfig = {
  source: possibleTokensets.map(tokenset => `tokens/${tokenset}.json`),
  format: {
    composeTokens: require(`./src/formats/compose_Tokens`),
  },
  platforms: {
    compose: {
      buildPath: `build/compose/`,
      transforms: [
        `attribute/cti`, `name/cti/camel`,
      ],
      files: [
        {
          destination: `Tokens.kt`,
          format: `composeTokens`,
          className: `Tokens`,
          packageName: packageName
        }
      ]
    }
  }
};

sd = StyleDictionary.extend(tokensConfig);
sd.buildAllPlatforms();

let tokenConfigurationConfig = {
  source: possibleTokensets.map(tokenset => `tokens/${tokenset}.json`),
  format: {
    composeTokenConfiguration: require(`./src/formats/compose_TokenConfiguration`),
  },
  platforms: {
    compose: {
      buildPath: `build/compose/`,
      transforms: [
        `attribute/cti`, `name/cti/camel`,
      ],
      files: [
        {
          destination: `TokenConfiguration.kt`,
          format: `composeTokenConfiguration`,
          className: `TokenConfiguration`,
          packageName: packageName
        }
      ]
    }
  }
};

sd = StyleDictionary.extend(tokenConfigurationConfig);
sd.buildAllPlatforms();

let tokenThemeMappingConfig = {
  source: possibleTokensets.map(tokenset => `tokens/${tokenset}.json`),
  format: {
    composeTokenThemeMapping: require(`./src/formats/compose_TokenThemeMapping`),
  },
  platforms: {
    compose: {
      buildPath: `build/compose/`,
      transforms: [
        `attribute/cti`, `name/cti/camel`,
      ],
      files: [
        {
          destination: `TokenThemeMapping.kt`,
          format: `composeTokenThemeMapping`,
          className: `TokenThemeMapping`,
          packageName: packageName
        }
      ]
    }
  }
};

sd = StyleDictionary.extend(tokenThemeMappingConfig);
sd.buildAllPlatforms();

let fontsContent = fs.readFileSync(fontsFile, `utf-8`);
let lines = fontsContent.split(`\n`);
let distinctFonts = new Set(lines);
let tokenFontsText = `package ${packageName}.themes\n` +
  `\n` + 
  `object TokenFonts {\n`;

distinctFonts.forEach(font => {
  if (font != ``) {
    tokenFontsText = tokenFontsText + `\tval ${font} = R.font.${font}\n`;
  }
});

tokenFontsText = tokenFontsText + `}`;

fs.writeFileSync(fontsFile, tokenFontsText);