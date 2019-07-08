const oxios = require('../utls/http.request');
const utils = require('../utls/utils')
const cheerio = require('cheerio');
const fs = require('fs');
class  DouBanControler {
	static async getMovieInfo(ctx) {
		await oxios.default.get(`${ctx.request.query.url}`).then(res=>{
			utils.mkdirFile(res)
			// const $ = cheerio.load(res);
			// let arr = [];
			// $('.slider_nav._quicklink.slider_nav_watched').find('a').each((index,item) => {
			// 	let obj = {
			// 		title: $(item).find('span').text(),
			// 		picUrl: $(item).attr('data-bgimage'),
			// 		link: $(item).attr('href')
			// 	}
			// 	if(obj.title!=='大家在看')arr.push(obj)
			// })
            ctx.body = {
                res: 0, 
                result:'arr',
		        message: '请求成功' 
            }
        })
	}
	static async getTag(ctx) {
		let {video} = ctx.request.query;
		await oxios.default.get(`https://movie.douban.com/j/search_tags?type=${video}&tag=%E7%83%AD%E9%97%A8&source=`).then(res=>{
			ctx.body = {
				res: 0,
				result: JSON.parse(res).tags,
				message: '请求成功'
			}
		})
	}
	static async getList(ctx) {
		let {tag, sort,start,limit,video} = ctx.request.query;
		await oxios.default.get(`https://movie.douban.com/j/search_subjects?type=${video}&tag=${encodeURI(tag)}&sort=${sort}&page_limit=${limit}&page_start=${start}`).then(res=>{
			ctx.body = {
				res: 0,
				result: JSON.parse(res).subjects,
				message: '请求成功'
			}
		})
	}
}
exports.default = DouBanControler
