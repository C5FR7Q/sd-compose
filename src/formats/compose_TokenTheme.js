module.exports = function ({ dictionary, options, file }) {
    const lodash = require('lodash');
    const fs = require('fs');
    const toPascalCase = require('../utils/toPascalCase');

    let metadata = fs.readFileSync('tokens/$metadata.json', 'utf8');
    let tokenSetOrder = JSON.parse(metadata).tokenSetOrder;

    tokenSetOrder = tokenSetOrder.map(item => `tokens/${item}.json`);

    let allProperties = [...dictionary.allProperties];

    let str = `package ${file.packageName}\n` +
        `\n` +
        `import androidx.compose.ui.graphics.Color\n` +
        `import androidx.compose.ui.unit.Dp\n` +
        `import androidx.compose.ui.unit.TextUnit\n` +
        `import androidx.compose.ui.text.TextStyle\n` +
        `\n` +
        `interface TokenTheme {\n` +
        `\n` +
        `\tcompanion object\n`;

    let groupedProperties = lodash.groupBy(allProperties, 'filePath');

    for (key of tokenSetOrder) {
        Object
            .entries(groupedProperties)
            .filter(entry => entry[0] == key)
            .forEach(entry => {
                let key = entry[0];
                let tokens = entry[1];

                key = key.replace(`tokens/`, ``);
                key = key.replace(`.json`, ``);
                
                str = str +
                    `\n` +
                    `\t// ${toPascalCase(key.split("/")[0])}\n`;
                
                tokens.forEach(token => {
                    let originalType = token.original.type;
                    
                    let convertedType;
                    
                    if (originalType == `color`) {
                        convertedType = `Color`;
                    }

                    if (originalType == `borderRadius` ||
                        originalType == `sizing` ||
                        originalType == `spacing` ||
                        originalType == `borderWidth`
                    ) {
                        convertedType = `Dp`;
                    }

                    if (originalType == `opacity`) {
                        convertedType = `Float`;
                    }

                    if (originalType == `typography`) {
                        convertedType = `TextStyle`;
                    }

                    if (originalType == `fontSizes` ||
                        originalType == `lineHeight` ||
                        originalType == `letterSpacing` ||
                        originalType == `paragraphSpacing`
                    ) {
                        convertedType = `TextUnit`;
                    }


                    str = str + `\tval ${token.name}: ${convertedType}\n`;
                });
            });
    }

    str = str + `}`;

    return str;
}