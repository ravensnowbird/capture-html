# Capture HTML

### Capture fullpage website

```bash
caphtml -m -T jpeg -Q 100 -F https://example.com
```

### Options

**`-m`**: 是否为手机模式

**`-T <type>`**: type取值为`jpeg`和`png`两种

**`-Q <quality>`**: quality取值范围1～100, 只有在设置了`-T`后此项才生效

**`-F`**: 是否截取全屏

**`-d <selector>`**: 截取内容参考的selector(同jquery的写法), 注: 字符#需写成编码后的值%23，如#app应写成%23app
