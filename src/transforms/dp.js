module.exports = {
  type: `value`,
  matcher: (token) => token.original.type === `borderRadius` || 
    token.original.type === `sizing` || 
    token.original.type === `spacing` || 
    token.original.type === `borderWidth`, 
  transformer: (prop) => {
    return `${prop.value}.dp`;
  }
}