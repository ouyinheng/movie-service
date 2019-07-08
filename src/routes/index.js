const router = require('koa-router')()
const utils = require('../utls/utils');
const oxios = require('../utls/http.request');
const jwt = require('jsonwebtoken');
const fs = require('fs');
router.get('/string', async (ctx, next) => {
  console.error('asdf', ctx.response)
  console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
  ctx.response.redirect('/');
  ctx.response.body = '<a href="/json">Index Page</a>';
  // ctx.body = 'koa2 string'
})
router.get('/json', async (ctx, next) => {
  ctx.throw(500);
  ctx.body = {
    title: 'koa2 json'
  }
})

router.get('/404', async (ctx, next) => {
  ctx.response.status = 404;
  ctx.response.body = 'Page Not Found';
})

router.get('/cookies', async (ctx, next) => {
  const n = Number(ctx.cookies.get('view') || 0) + 1;
  ctx.cookies.set('view', n);
  ctx.response.body = n + ' views';
})

router.get('/times', async(ctx, next) => {
  let s = utils.getTime('yyyy-MM-dd hh:mm:ss')
  ctx.body = s
  next();
})

router.get('/jwt', async (ctx, next) => {
  var token = jwt.sign('', app.get('superSecret'), {
      expiresIn : 60*60*24// 授权时效24小时
  });
  ctx.json({
    success: true,
    message: '请使用您的授权码',
    token: token
  })
})

router.get('/real', async(ctx, next) => {
  await oxios.default.get(ctx.request.query.url).then(res=>{
    // utils.mkdirFile(res)
    // console.log(res)
    ctx.body = '404'
  })
  // test.login();
})
router.get('/image', async (ctx, next) => {
  await oxios.default.get(ctx.request.query.url).then(res=>{
    console.log(res)
    ctx.body = fs.createReadStream(res.toString());    
  })
})
module.exports = router
