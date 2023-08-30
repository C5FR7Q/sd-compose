module.exports = {
  type: `value`,
  matcher: (token) => token.original.type === `fontSizes` ||
    token.original.type === `lineHeight` ||
    token.original.type === `letterSpacing` ||
    token.original.type === `paragraphSpacing`,
  transformer: (prop) => {
    let value = prop.value;
    if (value.endsWith(`%`)) {
      let percentValue = `${value}`.slice(0, -1);
      let numberValue = parseFloat(percentValue);
      return `${numberValue / 100}.em`;
    } else {
      return `${value}.sp`;
    }
  }
}