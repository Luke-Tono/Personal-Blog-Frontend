module.exports = {
  css: {
    loaderOptions: {
      less: {
        // Less 配置
        javascriptEnabled: true,
        // 如果使用 CSS 变量，可能需要额外配置
        additionalData: `
          @import "~@/styles/variables.less";
        `
      }
    }
  }
}