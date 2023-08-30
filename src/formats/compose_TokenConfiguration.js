module.exports = function ({ dictionary, options, file }) {
    const toPascalCase = require(`../utils/toPascalCase`);
    const fs = require(`fs`);

    let metadata = fs.readFileSync(`tokens/$metadata.json`, `utf8`);
    let tokenSetOrder = JSON.parse(metadata).tokenSetOrder;

    let str = `package ${file.packageName}\n` +
        `\n` +
        `import androidx.compose.runtime.compositionLocalOf\n` +
        `\n` +
        `val LocalTokenConfiguration = compositionLocalOf<TokenConfiguration> { error("No configuration provided") }\n` +
        `\n` +
        `data class TokenConfiguration(\n`;

    tokenSetOrder = tokenSetOrder.filter(tokenSet => tokenSet.includes(`/`));

    let types = new Set(tokenSetOrder.map(tokenSet => tokenSet.split(`/`)[0]));
    types.forEach(type => {
        str = str + `\tval ${type}: ${toPascalCase(type)},\n`;
    })

    str = str.slice(0, -2);
    str = str + `\n` +
        `) {\n` +
        `\n`;

    types.forEach(type => {
        str = str + `\tenum class ${toPascalCase(type)} {\n`;
        
        tokenSetOrder
            .filter(tokenSet => tokenSet.split(`/`)[0] == type)
            .map(tokenSet => tokenSet.split(`/`)[1])
            .forEach(variant => {
                str = str + `\t\t${toPascalCase(variant)},\n`;
            });
        
        str = str.slice(0, -2);
        str = str + `\n` +
            `\t}\n` + 
            `\n`;
    });

    str = str + `}`;

    return str;
}