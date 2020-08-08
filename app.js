const Koa = require('koa')
const views = require('koa-views')
const staticRes = require('koa-static')
const Router = require('koa-router')
// const axios = require('axios')
// 导入wechat-jssdk
const { Wechat } = require('wechat-jssdk')
// 创建wechat验证实例：传入微信公众号测试appId和appSecret
const wx = new Wechat({
  appId: 'wxe733093faa04b8aa',
  appSecret: '24f11b6815515016170c4ffeb6977e65'
  // appId: 'wx7cfd1bd1af42d511',
  // appSecret: '2fae9e51b3c6e89678db2ae74cf64bc3'
})

// node调用其它服务API获取数据
// axios.get('http://api.douban.com/v2/movie/in_theaters?apikey=0df993c66c0c636e29ecbb5344252a4a').then((res) => {
//   console.log('film:', res.data)
// })


// 创建Koa实例
const app = new Koa()
// 创建路由实例
const router = new Router()

// 定义后台接口=》做js-sdk的签名验证
router.get('/api/sign', async (ctx) => {
  // 获取前台传递的params参数
  // console.log(ctx.request.query)
  let signUrl = ctx.request.query.signUrl || 'http://localhost:3000/'
  // 获取授权数据，然后返回给前端
  const res = await wx.jssdk.getSignature(signUrl)
  // 返回response
  ctx.body = { status: 200, msg: '获取签名数据成功！', data: res }
})
// 使用路由
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
  let res = await wx.jssdk.getSignature('http://localhost:3000/')
  // 同步渲染页面并返回
  await ctx.render('index.hbs', res)
})

app.listen(3000, () => console.log('run...'))