module.exports = {
  type: `value`,
  matcher: (token) => token.original.type === `opacity`,
  transformer: (prop) => {
    let value = prop.value;
    if (value.includes(`%`)) {
      let percentValue = `${value}`.slice(0, -1);
      let numberValue = parseFloat(percentValue);
      return `${numberValue / 100}f`;
    } else {
      return `${numberValue}f`;
    }
  }
}