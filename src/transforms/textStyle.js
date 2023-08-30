const toPascalCase = require(`../utils/toPascalCase`);
const fs = require(`fs`);

module.exports = {
  type: `value`,
  matcher: (token) => token.original.type === `typography`,
  transformer: (prop) => {
    
    let properties = prop.value;
    let str = `TextStyle(`;

    Object
      .entries(properties)
      .forEach(entry => {
        let key = entry[0];
        let value = entry[1];

        if (key == `fontSize`) {
          str = str + `\n\t\tfontSize = ${spOrEm(value)},`;
        }
        if (key == `lineHeight`) {
          str = str + `\n\t\tlineHeight = ${spOrEm(value)},`;
        }
        if (key == `letterSpacing`) {
          str = str + `\n\t\tletterSpacing = ${spOrEm(value)},`;
        }
        if (key == `fontWeight`) {
          str = str + `\n\t\tfontWeight = ${mapFontWeight(value)},`;
        }
        if (key == `fontStyle`) {
          str = str + `\n\t\tfontStyle = ${mapFontStyle(value)},`;
        }
        if (key == `fontFamily` && value != `Roboto`) {
          str = str + `\n\t\tfontFamily = FontFamily(${mapFont(value, properties.fontWeight, properties.fontStyle)}),`;
        }
      });

    str = str.slice(0, -1);
    str = str + `\n\t)`;
    return str;
  }
}

function spOrEm(value) {
  if (value.endsWith(`%`)) {
    let percentValue = `${value}`.slice(0, -1);
    let numberValue = parseFloat(percentValue);
    return `${numberValue / 100}.em`;
  } else {
    return `${value}.sp`;
  }
}

function mapFontWeight(value) {
  if (value == `Thin`) {
    return `FontWeight.Thin`;
  }
  if (value == `ExtraLight`) {
    return `FontWeight.ExtraLight`;
  }
  if (value == `Light`) {
    return `FontWeight.Light`;
  }
  if (value == `Regular`) {
    return `FontWeight.Normal`;
  }
  if (value == `Medium`) {
    return `FontWeight.Medium`;
  }
  if (value == `SemiBold`) {
    return `FontWeight.SemiBold`;
  }
  if (value == `Bold`) {
    return `FontWeight.Bold`;
  }
  if (value == `ExtraBold`) {
    return `FontWeight.ExtraBold`;
  }
  if (value == `Black`) {
    return `FontWeight.Black`;
  }
  return `FontWeight.Normal`;
}

function mapFontStyle(value) {
  if (value == `italic`) {
    return `FontStyle.Italic`;
  }
  return `FontStyle.Normal`;
}

function mapFont(font, fontWeight, fontStyle) {
  let secondResourcePart;
  if (fontWeight === undefined || fontWeight == `Regular`) {
    if (fontStyle == `italic`) {
      secondResourcePart = `Italic`;
    } else {
      secondResourcePart = `Regular`;
    }
  } else {
    secondResourcePart = toPascalCase(fontWeight);
    if (fontStyle == `italic`) {
      secondResourcePart = secondResourcePart + `Italic`;
    }
  }

  let resourcePart = `${toPascalCase(font)}_${secondResourcePart}`;
  fs.appendFileSync(`./build/compose/themes/TokenFonts.kt`, `${resourcePart}\n`);

  let weightPart = mapFontWeight(fontWeight);
  let stylePart = mapFontStyle(fontStyle);

  return `Font(TokenFonts.${resourcePart}, ${weightPart}, ${stylePart})`;
}