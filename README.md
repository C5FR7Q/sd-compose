Utility that allows to generate **Jetpack Compose** code for design tokens from **Tokens Studio**

As advanced feature it supports [Multi-dimensional themes](https://docs.tokens.studio/themes/themes-pro)

### Requirements
1. Install npm & node ([link](https://nodejs.org/en/download))

### How to use generate **.kt** files
1. Change **packageName** in **config.js**
2. Replace data in **/tokens** package
3. Run **npm i** from the root of utility
4. Run **node config.js** from the root of utility
5. Copy content from **/build/compose** and move it into work project
6. In case of non empty **/build/compose/TokenFonts.kt**
    * Provide required ***.ttf** fonts into **/res/font** of work project
    * Add **R** import into **TokenFonts.kt** of work project

### Generated code usage example

```Kotlin
@Composable
fun Example() {
    var tokenConfiguration by remember {
        mutableStateOf(
            TokenConfiguration(
                corner = TokenConfiguration.Corner.Rounded,
                size = TokenConfiguration.Size.Normal,
                color = TokenConfiguration.Color.Light
            )
        )
    }
    CompositionLocalProvider(
        LocalTokenConfiguration provides tokenConfiguration
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(color = Color.LightGray),
            contentAlignment = Alignment.Center
        ) {
            Button(
                onClick = {
                    tokenConfiguration = TokenConfiguration(
                        corner = TokenConfiguration.Corner.entries.random(),
                        size = TokenConfiguration.Size.entries.random(),
                        color = TokenConfiguration.Color.entries.random()
                    )
                }
            )
        }
    }
}

@Composable
private fun Button(onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(Tokens.buttonBorderRadius))
            .border(
                width = Tokens.buttonBorderWidth,
                color = Tokens.buttonColorBorder,
                shape = RoundedCornerShape(Tokens.buttonBorderRadius)
            )
            .background(
                color = Tokens.buttonColorBackground
            )
            .clickable(onClick = onClick)
            .padding(
                vertical = Tokens.buttonSpacingOuterVertical,
                horizontal = Tokens.buttonSpacingOuterHorizontal
            )
    ) {
        Text(
            text = "Example",
            style = Tokens.typoRegular,
            color = Tokens.buttonColorContent
        )
    }
}
```


### Links
* [Style Dictionary](https://github.com/amzn/style-dictionary)
* [Tokens Studio](https://tokens.studio/)
* [Style Dictionary utilities from Tokens Studio](https://github.com/tokens-studio/sd-transforms)
