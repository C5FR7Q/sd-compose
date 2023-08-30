module.exports = function ({ dictionary, options, file }) {
    const fs = require('fs');
    const toPascalCase = require('../utils/toPascalCase');

    let metadata = fs.readFileSync('tokens/$metadata.json', 'utf8');
    let tokenSetOrder = JSON.parse(metadata).tokenSetOrder;

    let str = `package ${file.packageName}\n` +
        `\n` +
        `import ${file.packageName}.TokenConfiguration.*\n` +
        `import ${file.packageName}.themes.*\n` +
        `\n` +
        `private val configurationToThemeMap = mapOf(\n`;

    tokenSetOrder = tokenSetOrder.filter(tokenSet => tokenSet.includes(`/`));

    let groups = tokenSetOrder.reduce((group, tokenSet) => {
        let category = tokenSet.split(`/`)[0];
        let value = tokenSet.split(`/`)[1];
        group[category] = group[category] ?? [];
        group[category].push(value);
        return group;
    }, {});

    let combinations = allCombinations(groups);

    combinations.forEach(combination => {
        str = str + `\tTokenConfiguration(`;
        let themeName = `TokenTheme_`;
        Object
            .entries(combination)
            .forEach(prop => {
                let key = toPascalCase(prop[0]);
                let value = toPascalCase(prop[1]);
                str = str + `${key}.${value}, `;
                themeName = themeName + value;
            });

        str = str.slice(0, -2);
        str = str + `) to ${themeName},\n`;
    });

    str = str.slice(0, -2);
    str = str + `\n`;


    str = str + `)\n` +
        `\n` +
        `internal fun TokenTheme.Companion.from(configuration: TokenConfiguration): TokenTheme {\n` +
        `\treturn configurationToThemeMap.getValue(configuration)\n` +
        `}`;

    return str;
}


function allCombinations(obj) {
    let combos = [{}];
    Object.entries(obj).forEach(([key, values]) => {
        let all = [];
        values.forEach((value) => {
            combos.forEach((combo) => {
                all.push({ ...combo, [key]: value });
            });
        });
        combos = all;
    });
    return combos;
}
