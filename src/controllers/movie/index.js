const oxios = require('../../utls/http.request');
const utils = require('../../utls/utils')
const cheerio = require('cheerio');
const fs = require('fs');
class  MovieControler {
	static async getMovieUrl(ctx) {
		console.log(ctx.request.query);
	    let searchArr = [];
	    await oxios.default.get(`https://v.qq.com/x/search/?q=${encodeURI(ctx.request.query.moviename)}`).then(res=>{
	    	// utils.mkdirFile(res)
    		const $ = cheerio.load(res);
    		$('.result_item.result_item_v').each((index, item)=>{
    			let list  = [];
    			$(item).find('._playlist').find('.item').each((index, item) => {
    				list.push({
    					title: $(item).children('a').text(),
    					url: $(item).children('a').attr('href')
    				})
    			})
			    let obj = {
		            id: $('.result_item.result_item_v').attr('data-id'),
	                href: $(item).children('._infos').find('a.figure.result_figure').attr('href'),
					cover: $(item).find('a.figure.result_figure').children('img').attr('src'),
					source: {
						img: $(item).find('.result_source').find('img').attr('src'),
						text: $(item).find('.result_source').find('.icon_text').text()
					},
	                introduce: {
	                	title: {
	                		pri: $(item).find('.result_title').find('.hl').text(),
	                		sub: $(item).find('.result_title').find('.sub').text(),
	                		type: $(item).find('.result_title').find('.type').text(),
	                	},
	                	info_item_odd: $(item).find('.info_item.info_item_odd').find('.content').eq(1).text(),
	                	info_item_even: $(item).find('.info_item.info_item_even').find('.content').text(),
	                	info_item_desc: $(item).find('.info_item.info_item_desc').find('.desc_text').text(),
	                },
	                rating: $(item).children('._infos').find('.result_score').text(),
	                list
		        }
		        searchArr.push(obj);
    		})
            ctx.body = {
                res: 0, 
                result:searchArr,
		        message: '请求成功' 
            }
	    }).catch(err=>{
	      ctx.body = { res: 1, result: null, message: err.error }
	    })
	}
	static async getMore(ctx) {
		await oxios.default.get(`https://s.video.qq.com/get_playsource?id=${ctx.request.query.id}&type=4&range=1-1000`).then(res=> {
			// utils.mkdirFile(res);
    		const $ = cheerio.load(res);
    		let arr = [];
    		let str = $('PlaylistItem').find('totalEpisode').text();
    		console.log(str)
    		$('videoPlayList').each((index, item)=>{
    			let obj = {
    				id: $(item).find('id').text(),
    				pic: $(item).find('pic').text(),
    				playUrl: $(item).find('playUrl').text(),
    				title: $(item).find('title').text(),
    				episode_number: $(item).find('episode_number').text()
    			}
    			arr.push(obj)
    		})
			ctx.body = {
                res: 0, 
                result:arr,
		        message: '请求成功' 
            }
	    }).catch(err=>{
	      ctx.body = { res: 1, result: null, message: err.error }
	    })
	}
    static async getAutoWords(ctx) {
        await oxios.default.get(`https://s.video.qq.com/smt_wap?plat=2&ver=3&num=10&otype=json&query=${encodeURI(ctx.request.query.moviename)}&_=1547562063894&callback=jsonp2`).then(res=>{
            let val = res.substr(7,res.length-1)
            val = val.substring(0, val.lastIndexOf(')'));
            ctx.body = {
                res: 0, 
                result:JSON.parse(val).item,
		        message: '请求成功' 
            }
        })
    }
    static async getData(ctx) {
        let data = fs.readFileSync('./src/controllers/movie/data.xml');
        const $ = cheerio.load(data);
        let arr = [];
        let brr = $('string-array').find('item')
        // utils.mkdirFile(res);
        ctx.body = {
            res: 0, 
            result:JSON.stringify(brr),
            message: '请求成功' 
        }
	}
	static async getRecomm(ctx) {
		await oxios.default.get(`https://v.qq.com/`).then(res=>{
            // let val = res.substr(7,res.length-1)
			// val = val.substring(0, val.lastIndexOf(')'));
			// utils.mkdirFile(res)
			const $ = cheerio.load(res);
			let arr = [];
			$('.slider_nav._quicklink.slider_nav_watched').find('a').each((index,item) => {
				let obj = {
					title: $(item).find('span').text(),
					picUrl: $(item).attr('data-bgimage'),
					link: $(item).attr('href')
				}
				if(obj.title!=='大家在看')arr.push(obj)
			})
            ctx.body = {
                res: 0, 
                result:arr,
		        message: '请求成功' 
            }
        })
	}
	// 芒果TV
	static async getMGMovuel(ctx) {
		await oxios.default.get(`https://so.mgtv.com/so/k-${encodeURI(ctx.request.query.moviename)}`).then(res=> {
			// utils.mkdirFile(res);
    		const $ = cheerio.load(res);
    		let arr = [];
			$('.so-result-info .result-content').each((index, item) =>{
				let list = []
				$(item).find('.searchresult-foldup .so-result-alist.playSeriesList').find('a').each((indexs, items) => {
					list.push({
						title: $(items).text(),
						url: $(items).attr('href')
					})
				})
				let intro = {};
				$(item).find('.text-1 span').each((index,item) => {
					if(index==0)intro.info_item_desc = $(item).find('.cont').text()
					if(index==1)intro.info_item_even = $(item).find('.cont').text()
				})
				let obj = {
					href: $(item).find('.result-pic').find('a').attr('href'),
					cover: $(item).find('.result-pic').find('a').find('img').attr('src'),
					title: $(item).find('.result-pic').find('a').find('img').attr('alt'),
					rating: $(item).find('.result-box').find('.result-til').find('score').text(),
					list,
					introduce: Object.assign(intro, {
						info_item_odd:$(item).find('.desc_text').text(),
						title: {
							pri: $(item).find('.result-pic').find('a').find('img').attr('alt'),
							sub:  $(item).find('.result-box').find('.result-til').find('.year').text(),
	                	},
					})
				}
				arr.push(obj)
			})
			ctx.body = {
                res: 0, 
                result:arr,
		        message: '请求成功' 
            }
		})
	}
}
exports.default = MovieControler
