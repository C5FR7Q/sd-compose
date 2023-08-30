module.exports = function ({ dictionary, options, file }) {
    const lodash = require('lodash');
    const fs = require('fs');
    const { createPropertyFormatter } = require('style-dictionary/lib/common/formatHelpers');

    let tokenSetOrder;
    let metadata = fs.readFileSync('tokens/$metadata.json', 'utf8');
    tokenSetOrder = JSON.parse(metadata).tokenSetOrder;
    tokenSetOrder = tokenSetOrder.map(item => `tokens/${item}.json`);

    let allProperties = [...dictionary.allProperties];

    let str = `package ${file.packageName}.themes\n` +
        `\n` +
        `import androidx.compose.ui.graphics.Color\n` +
        `import androidx.compose.ui.text.TextStyle\n` +
        `import androidx.compose.ui.text.font.Font\n` +
        `import androidx.compose.ui.text.font.FontFamily\n` +
        `import androidx.compose.ui.text.font.FontStyle\n` +
        `import androidx.compose.ui.text.font.FontWeight\n` +
        `import androidx.compose.ui.unit.dp\n` +
        `import androidx.compose.ui.unit.em\n` +
        `import androidx.compose.ui.unit.sp\n` +
        `\n` +
        `import ${file.packageName}.TokenTheme\n` +
        `\n` +
        `object ${file.className}: TokenTheme {\n`;

    let groupedProperties = lodash.groupBy(allProperties, 'filePath');
    let outputReferences = options.outputReferences;
    let formatProperty = createPropertyFormatter({
        outputReferences,
        dictionary,
        formatting: {
          suffix: '',
          commentStyle: 'none' // We will add the comment in the format template
        }
      });

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
                    `\t// ${key}\n`;
                
                tokens.forEach(token => {
                    str = str + `\toverride val ${formatProperty(token)}\n`;
                });
            });
    }

    str = str + `}`;

    return str;
}