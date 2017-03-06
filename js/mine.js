$(document).ready(function() {
	var width = 0;
	var heigth = 0;
	var mine_num = 0;
	var mine_left = 0;
	var time_count = 0;
	var game_timer = null;
	var All = {};
	var ef_onoff = 0;
	var aShow = [];

	dif_choose();

	//游戏难度选择
	function dif_choose() {
		$($('input[type=radio]')[0]).click(function() {
			width = 9;
			heigth = 9;
			mine_num = 10;
			mine_left = 10;
			$('input[type=text]').attr('disabled', 'disabled');
		})
		$($('input[type=radio]')[1]).click(function() {
			width = 16;
			heigth = 16;
			mine_num = 40;
			mine_left = 40;
			$('input[type=text]').attr('disabled', 'disabled');
		})
		$($('input[type=radio]')[2]).click(function() {
			width = 30;
			heigth = 16;
			mine_num = 99;
			mine_left = 99;
			$('input[type=text]').attr('disabled', 'disabled');
		})
		$($('input[type=radio]')[3]).click(function() {
			$('input[type=text]').removeAttr('disabled');
		});

		set();

	}

	//游戏设置
	function set() {
		$($('input[type=button]')[0]).click(function() {
			$('input[type=text]').val('');
		})
		$($('input[type=button]')[1]).click(function() {
			if(!$('input[type=text]').attr('disabled')) {
				heigth = $($('input[type=text]')[0]).val();
				width = $($('input[type=text]')[1]).val();
				mine_num = $($('input[type=text]')[2]).val();
				mine_left = $($('input[type=text]')[2]).val();
			}

			if(width && heigth && mine_num && width >= 9 && width <= 30 && heigth >= 9 && heigth <= 24 && mine_num >= 10 && mine_num <= 99 && mine_num <= width * heigth * 0.6) {
				$('.set').css('display', 'none');
				$('.cont').css('display', 'block');

			} else {
				alert('1 地雷数请正确设置! 2 地雷数小于  长度X宽度X0.6 )')
				return false;
			}

			init();

		})

	}

	//初始化
	function init() {

		//雷数显示
		$('.mine_mun').text(mine_num + '/' + mine_left);
		//时间显示
		game_timer = setInterval(function() {
			time_count++;

			var min = parseInt(time_count / 60);
			var sec = time_count % 60

			if(min < 10) {
				min = '0' + min;
			}

			if(sec < 10) {
				sec = '0' + sec;
			}

			$('.game_time').text(min + ':' + sec)
		}, 1000);

		//创建json  以及   地图

		var td_width = parseInt(1170 / width);
		var td_height = parseInt(470 / heigth);
		var td_size = 0;
		var table_width = 0;

		td_width < td_height ? td_size = td_width : td_size = td_height;

		table_width = parseInt(td_size * width);

		var oTable = $('<table></table>');

		$('.main').css({
			'margin-left': '-' + ((table_width / 2) + 40) + 'px',
			'width': table_width
		});

		for(var i = 0; i < heigth; i++) {
			var oTr = $('<tr></tr>');
			oTable.append(oTr);
			for(var j = 0; j < width; j++) {
				var oTd = $('<td></td>');
				//底部投影
				oTd.append($('<div class="td_mask"></div>'))
				oTd.append($('<div class="td_shadow"></div>'))

				oTd.children('.td_mask').css({
					'width': td_size + 'px',
					'height': td_size + 'px',
					'position': 'absolute',
					'top': '0px',
					'left': '0px',
					'z-index': '1',
					'background-image': 'url(img/undig' + parseInt(Math.random() * 8) + '.png)',
					'background-size': 'contain'
				});

				oTd.children('.td_shadow').css({
					'width': td_size + 'px',
					'height': td_size / 4 + 'px',
					'position': 'absolute',
					'top': td_size + 'px',
					'left': '0px',
					'z-index': '1',
					'background-image': 'url(img/td_shadow.png)',
					'background-size': 'contain'
				});

				oTd.css({
					'width': td_size,
					'height': td_size,
					'background-image': 'url(img/auto_show_' + parseInt(Math.random() * 2) + '.png)',
				});
				oTd.attr('id', j + '_' + i)

				All[j + '_' + i] = {
					'obj': oTd,
					'id': oTd.attr('id'),
					'bg': oTd.css('background-image'),
					'ismine': false,
					'sumine': null,
					'clstate': 0
				};

				oTr.append(oTd);
			}
		}
		$('.main').append(oTable);

		init_creat_mine()
	}

	//生成地雷
	function init_creat_mine() {

		var mine_arr = [];

		while(mine_arr.length < parseInt(mine_num)) {
			var mine_id = parseInt(Math.random() * width) + '_' + parseInt(Math.random() * heigth);

			if($.inArray(mine_id, mine_arr) == -1) {
				mine_arr.push(mine_id);
			}
		}

		for(var i = 0; i < mine_arr.length; i++) {
			All[mine_arr[i]].ismine = true;
		}
		count_sumine();
	}
	//计算周围的炸弹数
	function count_sumine() {

		for(var i = 0; i < width; i++) {
			for(var j = 0; j < heigth; j++) {
				//是地雷 count = null ; 周围没有雷 count = null; 周围有雷 count = num
				var count = null;

				if(All[i + '_' + j].ismine == false) {
					if(All[(i + 1) + '_' + (j + 1)] && All[(i + 1) + '_' + (j + 1)].ismine == true) {
						count++;
					}
					if(All[(i + 1) + '_' + j] && All[(i + 1) + '_' + j].ismine == true) {
						count++;
					}
					if(All[(i + 1) + '_' + (j - 1)] && All[(i + 1) + '_' + (j - 1)].ismine == true) {
						count++;
					}
					if(All[i + '_' + (j + 1)] && All[i + '_' + (j + 1)].ismine == true) {
						count++;
					}
					if(All[i + '_' + (j - 1)] && All[i + '_' + (j - 1)].ismine == true) {
						count++;
					}
					if(All[(i - 1) + '_' + (j + 1)] && All[(i - 1) + '_' + (j + 1)].ismine == true) {
						count++;
					}
					if(All[(i - 1) + '_' + j] && All[(i - 1) + '_' + j].ismine == true) {
						count++;
					}
					if(All[(i - 1) + '_' + (j - 1)] && All[(i - 1) + '_' + (j - 1)].ismine == true) {
						count++;
					}

					All[i + '_' + j].sumine = count;
					//if(count != 0) {
					//						All[i + '_' + j].obj.text(count);
					//}

				}
			}
		}

		start();
		td_dbclick();
	}
	//点击开始扫雷
	function start() {
		for(var i = 0; i < $('.td_mask').length; i++) {
			$($('.td_mask')[i]).mousedown(function(ev) { //####
				var keycode = ev.which;
				if(keycode == 1 && All[$(this).parent('td').attr('id')].clstate == 0) {
					//可左键点击的情况只有0(默认状态)
					if(All[$(this).parent('td').attr('id')].ismine == true) {
						console.log('start 点到雷')
						effect($(this), true, 2); //####
					} else if(All[$(this).parent('td').attr('id')].ismine == false) {
						console.log('start 没点到雷')
						effect($(this), false, 3); //####
					}
				} else if(keycode == 3) {
					console.log('start 可右键点击的情况 0(默认状态)1(红旗)2(问号)')
					r_click($(this));
				}

			});

		}
	}
	//右键点击效果
	function r_click(obj) {

		obj.children('img') && obj.children('img').remove();

		var r = All[obj.parent('td').attr('id')].clstate;
		if(r == 3) { //已经点开的不作操作
			return false;
		} else if(r == 2) {
			All[obj.parent('td').attr('id')].clstate = 0;
		} else {
			All[obj.parent('td').attr('id')].clstate++;
		}
		//更新r
		r = All[obj.parent('td').attr('id')].clstate;
		obj.append($('<img />'));
		obj.children('img').css({
			'width': obj.css('width'),
			'height': obj.css('heigth'),
		})

		if(r == 0) { //不给img加src
		} else if(r == 1) {
			obj.children('img').attr('src', 'img/flag_new.png');
			mine_left--;
			$('.mine_mun').text(mine_num + '/' + mine_left);
		} else if(r == 2) {
			obj.children('img').attr('src', 'img/ques_new.png');
			mine_left++
			$('.mine_mun').text(mine_num + '/' + mine_left);
		}

		game_over();
	}
	//显示效果 obj(触发的对象) boolen(true:是 false:不是)
	function effect(obj, boolen, num) {
		//效果动画
		if(typeof obj == undefined) {
			return false;
		}
		console.log(obj)
		var td_this = obj.parent('td');
		var td_size = parseInt(td_this.css('width'));
		var All_this = All[td_this.attr('id')];
		ef_onoff == 0 ? ef_onoff = 1 : ef_onoff = 0;

		//点击效果实现层
		obj.css({
			'width': parseInt(8 * td_size / 6),
			'height': parseInt(8 * td_size / 6),
			'top': parseInt(-td_size / 6),
			'left': parseInt(-td_size / 6),
			'background-image': 'url(img/dig_ef.png)',
			'z-index': '2',
		})

		td_this.css('background-image', 'url(img/dig' + ef_onoff + '.png)');

		obj.ef_timer = setTimeout(function() {
			console.log('effect动画过后显示效果')
			console.log(JSON.stringify(All_this))
			console.log(td_this.attr('id'));
			console.log(num);

			td_this.css('background-image', All_this.bg); //显示td正常背景
			console.log(td_this.css('background-image'));
			All_this.clstate = 3;
			console.log(JSON.stringify(All_this))
			console.log("effect 数组点击状态改为3 点开")

			if(boolen) { //是炸弹
				blow(obj);
			} else if(!boolen) { //不是炸弹
				if(All_this.sumine) {
					console.log('effect 有数的td')

					show_num(td_this, All_this.sumine);

					game_over();
				} else {
					console.log('effect 无数的td--继续调用show')
					show_num(td_this, All_this.sumine);

					var d = 0;
					aShow = [];
					aShow[0] = All_this;
					show(aShow, d); //传入数组
				}
			}

		}, 200);
	}

	//点到炸弹 obj为效果层
	function blow(obj) {
		obj.next('div').remove();
		obj.css({
			'width': obj.parent('td').css('width'),
			'height': obj.parent('td').css('height'),
			'top': 0,
			'left': 0,
			'background-image': 'url(img/blow0.png)',
			'z-index': '2',
		});
		obj.timer = setTimeout(function() {
			obj.css({
				'background-image': 'url(img/blow1.png)',
				'z-index': '2',
			});

			obj.timer = setTimeout(function() {
				obj.css({
					'background-image': 'url(img/blow2.png)',
					'z-index': '2',
				});
				clearTimeout(obj.timer);
				game_over(true);
			}, 500)

		}, 500);

	}

	//点出不是炸弹 arr要计算的数组  num //从数组的第几个下标开始计算
	function show(arr, num) {

		var d1 = 0;
		d1 = arr.length;
		//		alert(num)
		for(var i = num; i < arr.length; i++) {

			var x = parseInt(arr[i].id.slice(0, arr[i].id.indexOf('_')));
			var y = parseInt(arr[i].id.slice(arr[i].id.indexOf('_') + 1, arr[i].id.length));
			//console.log(x + '_' + y)

			if(All[(x + 1) + '_' + (y + 1)] && All[(x + 1) + '_' + (y + 1)].clstate == 0 && find_in_ashow(All[(x + 1) + '_' + (y + 1)], aShow)) {
				aShow.push(All[(x + 1) + '_' + (y + 1)])
			}
			if(All[(x + 1) + '_' + y] && All[(x + 1) + '_' + y].clstate == 0 && find_in_ashow(All[(x + 1) + '_' + y], aShow)) {
				aShow.push(All[(x + 1) + '_' + y])
			}
			if(All[(x + 1) + '_' + (y - 1)] && All[(x + 1) + '_' + (y - 1)].clstate == 0 && find_in_ashow(All[(x + 1) + '_' + (y - 1)], aShow)) {
				aShow.push(All[(x + 1) + '_' + (y - 1)])
			}
			if(All[x + '_' + (y + 1)] && All[x + '_' + (y + 1)].clstate == 0 && find_in_ashow(All[x + '_' + (y + 1)], aShow)) {
				aShow.push(All[x + '_' + (y + 1)])
			}
			if(All[x + '_' + (y - 1)] && All[x + '_' + (y - 1)].clstate == 0 && find_in_ashow(All[x + '_' + (y - 1)], aShow)) {
				aShow.push(All[x + '_' + (y - 1)])
			}
			if(All[(x - 1) + '_' + (y + 1)] && All[(x - 1) + '_' + (y + 1)].clstate == 0 && find_in_ashow(All[(x - 1) + '_' + (y + 1)], aShow)) {
				aShow.push(All[(x - 1) + '_' + (y + 1)])
			}
			if(All[(x - 1) + '_' + y] && All[(x - 1) + '_' + y].clstate == 0 && find_in_ashow(All[(x - 1) + '_' + y], aShow)) {
				aShow.push(All[(x - 1) + '_' + y])
			}
			if(All[(x - 1) + '_' + (y - 1)] && All[(x - 1) + '_' + (y - 1)].clstate == 0 && find_in_ashow(All[(x - 1) + '_' + (y - 1)], aShow)) {
				aShow.push(All[(x - 1) + '_' + (y - 1)])
			}

			//console.log(JSON.stringify(aShow))

			for(var j = 0; j < aShow.length; j++) {
				if(aShow[j].ismine == false && aShow[j].sumine != null && aShow[j].clstate == 0) { //有数
					show_num(aShow[j].obj, aShow[j].sumine);
					aShow[j].clstate = 3;
					console.log(JSON.stringify(aShow[j]))
					console.log('show 有数 显示1')
					aShow.splice(j, 1);
					j--;
				} else if(aShow[j].ismine == false && aShow[j].sumine == null && aShow[j].clstate == 0) { //没数
					show_num(aShow[j].obj, aShow[j].sumine);
					aShow[j].clstate = 3;
					console.log(JSON.stringify(aShow[j]))
					console.log('show 无数 显示2')
				} else if(aShow[j].ismine == true && aShow[j].sumine == null) { //是雷
					aShow.splice(j, 1);
					j--;
				}
			}

			//console.log(JSON.stringify(aShow))

			if(aShow.length > d1) {
				show(aShow, d1 - 1);
			} else {
				//console.log(JSON.stringify(aShow))
				game_over();
				return false;

			}

		}

	}

	//td的双击
	function td_dbclick() {
		for(var i = 0; i < $('td').length; i++) {
			var td_arr = $($('td')[i]);
			td_arr.on('dblclick', function() {
				if(All[$(this).attr('id')].clstate == 3) {
					var sur = [];
					var flag_count = 0;
					var x = parseInt($(this).attr('id').slice(0, $(this).attr('id').indexOf('_')));
					var y = parseInt($(this).attr('id').slice($(this).attr('id').indexOf('_') + 1, $(this).attr('id').length));

					All[(x + 1) + '_' + (y + 1)] && sur.push(All[(x + 1) + '_' + (y + 1)])
					All[(x + 1) + '_' + y] && sur.push(All[(x + 1) + '_' + y])
					All[(x + 1) + '_' + (y - 1)] && sur.push(All[(x + 1) + '_' + (y - 1)])
					All[x + '_' + (y + 1)] && sur.push(All[x + '_' + (y + 1)])
					All[x + '_' + (y - 1)] && sur.push(All[x + '_' + (y - 1)])
					All[(x - 1) + '_' + (y + 1)] && sur.push(All[(x - 1) + '_' + (y + 1)])
					All[(x - 1) + '_' + y] && sur.push(All[(x - 1) + '_' + y])
					All[(x - 1) + '_' + (y - 1)] && sur.push(All[(x - 1) + '_' + (y - 1)])

					for(var j = 0; j < sur.length; j++) {
						sur[j].clstate == 1 ? flag_count++ : flag_count = flag_count;
					}

					if(flag_count == All[$(this).attr('id')].sumine) {
						for(var k = 0; k < sur.length; k++) {
							var this_mine = sur[k].ismine;
							var nothing = 0;
							console.log('td_dbclick 调用effect');
							console.log(JSON.stringify(sur[k]));
							sur[k].clstate == 0 ? effect(sur[k].obj.children('.td_mask'), this_mine, 1) : nothing = 0;
						}
					} else {
						for(var k = 0; k < sur.length; k++) {
							sur[k].clstate == 0 ? shake(sur[k].obj) : nothing = 0;
						}
					}
				}
			})
		}
	}

	//抖动效果
	function shake(obj) {

		var dis = parseInt($('#0_0').css('width'))
		var shake_arr = [dis / 6, 0 - dis / 6, dis / 8, 0 - dis / 8, dis / 10, 0 - dis / 10, 0];
		var d = 0;
		obj.timer = setInterval(function() {
			obj.children('.td_mask').css('left', shake_arr[d]);
			obj.children('.td_shadow').css('left', shake_arr[d]);
			d++;
			d == shake_arr.length ? clearInterval(obj.timer) : d = d;
		}, 100)
	}

	//判断是否在数组中
	function find_in_ashow(json, arr) {
		for(var i = 0; i < arr.length; i++) {
			if(json.id == arr[i].id) {
				return false;
			}
		}
		return true;
	}

	//游戏结束
	function game_over(boolen) {
		var result = null;
		if(boolen) {
			result = '游戏失败!!'
		} else {
			result = '恭喜过关!!'
		}

		game_over.timer = setTimeout(function() {
			var over_mine = 0;
			var over_blank = 0
			for(var i = 0; i < width; i++) {
				for(var j = 0; j < heigth; j++) {
					if(All[i + '_' + j].ismine == true && All[i + '_' + j].clstate == 1) {
						over_mine++;
					} else if(All[i + '_' + j].ismine == false && All[i + '_' + j].clstate == 3) {
						over_blank++;
					}
				}
			}

			if((over_mine + over_blank) == (width * heigth) || boolen == true) {
				$('.game_over').css('display', 'block');
				$('.result').text(result);
				$('.time').text('共用时间' + time_count + '秒,排除陷阱' + (mine_num - mine_left) + '个');
				clearInterval(game_timer);
			}
		}, 1000)
	}

	//显示数字
	function show_num(obj, num) {
		obj.text('');

		num && obj.append($('<img />'))
		num && obj.children('img').css('width', obj.css('width'))
		num && obj.children('img').attr('src', 'img/num_' + num + '.png');
	}
	//	阻止页面右键菜单
	$('body').bind('contextmenu', function() {
		return false;
	})

})