const Koa = require('koa')
const views = require('koa-views')
const staticRes = require('koa-static')
const Router = require('koa-router')
// 导入wechat-jssdk
const { Wechat } = require('wechat-jssdk')
// 创建wechat验证实例：传入微信公众号测试appId和appSecret
const wx = new Wechat({
  appId: 'wxe733093faa04b8aa',
  appSecret: '24f11b6815515016170c4ffeb6977e65'
});

// 创建Koa实例
const app = new Koa()
// 创建路由实例
const router = new Router()

// 定义接口
router.get('/check', async (ctx) => {
  let res = await wx.jssdk.getSignature('http://localhost:8000')
  ctx.body = res
})
// 使用路遇
app.use(router.routes())

// 配置静态资源目录
app.use(staticRes(__dirname + '/assets'))

// 配置页面：指定页面路径和模版引擎
app.use(views(__dirname + '/views', {
  map: {
    hbs: 'handlebars'
  }
}))

app.use(async ctx => {
  // 获取验证信息
  let res = await wx.jssdk.getSignature('http://localhost:8000')
  // 同步渲染页面并返回
  await ctx.render('index.hbs', res)
})

app.listen(8000, () => console.log('run...'))