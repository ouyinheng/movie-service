const router = require('koa-router')();
const MovieControler = require('../controllers/movie')
router.prefix('/movie')
//首页
// 腾讯视频推荐
router.get('/qqrecomm', MovieControler.default.getRecomm);

router.get('/search', MovieControler.default.getMovieUrl)//--查询
router.get('/sourth', async (ctx) => {
  const {sourth} = ctx.request.query;
		if(sourth == 'qq') {
			await MovieControler.default.getMovieUrl(ctx)
		} else {
			await MovieControler.default.getMGMovuel(ctx)
		}
})//--查询
router.get('/showmore', MovieControler.default.getMore)//--查询详情
router.get('/getAuto', MovieControler.default.getAutoWords)//--自动补全
router.get('/data', MovieControler.default.getData)//--自动补全

module.exports = router