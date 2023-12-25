module.exports = {
    // 使用react官方规则
    presets: [
        "@babel/preset-env",
        "@babel/preset-react",
        // 按需加载core-js的polyfill, 有一些低版本的浏览器不支持ES6语法，下面语句会找出有兼容性问题的代码，然后从corejs里面按需打包具体的实现代码
        { useBuiltIns: "usage", corejs: { version: "3", proposals: true } },
    ],
    options: {
        cacheDirectory: true, // 开启babel编译缓存
        cacheCompression: false, // 缓存文件不要压缩
    },
};