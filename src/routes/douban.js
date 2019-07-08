const router = require('koa-router')();
const DouBanControler = require('../controllers/douban')
router.prefix('/douban')
//首页
// 腾讯视频推荐
router.get('/movieinfo', DouBanControler.default.getMovieInfo);
// 豆瓣tag
router.get('/tag', DouBanControler.default.getTag);
// 详情
router.get('/taginfo', DouBanControler.default.getList);

module.exports = router
// https://movie.douban.com/j/search_tags?type=tv&tag=%E7%83%AD%E9%97%A8&source=