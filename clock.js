(function($){
	/**
	*翻页时钟
	*@param opt {object}配置参数
	*@param opt.timer {number} 剩余的秒数
	*@param opt.$el {Zepto dom} 整体dom对象
	*/
	function Clock(opt){
		$.extend(this, opt);
		this.init();
	}
	Clock.prototype = {
		/**
		*格式化时间H.M.S
		*@param timer {number} 剩余的秒数
		*@return formatTime
		*@return formatTime.hour 小时数
		*@return formatTime.minute 分钟数 
		*@return formatTime.second 秒数
		*/
		formatTimer: function(timer){
			var obj = {
				hour: 0,
				minute: 0,
				second: 0
			}
			if(!timer){
				return obj;
			}
			//求小时
			obj['hour'] = Math.floor(timer / 3600);
			//求分钟
			obj['minute'] = Math.floor((timer % 3600) / 60);
			//求秒数
			obj['second'] = (timer % 3600) % 60;
			return obj
		},
		//把setTimeout , setInterval封装一下
		run: function(fn, timer, isInterval){
			var me = this;
			return window[isInterval ? 'setInterval' : 'setTimeout'](function(){
				fn.call(me);
			}, timer);
		},
		/**
		*格式化数据
		*@param formatTime {object} {hour: 22, minute: 22, second: 22}
		*@return array [hour十位数, hour个位数, minute十位数, minute个位数, second十位数, second个位数]
		*/
		formatData: function(formatTime){
			var rule = [
				{
					name: 'hour'
				},
				{
					name: 'minute'
				},
				{
					name: 'second'
				}
			]
			var arr = rule
			.map(function(item, index){
				var value = formatTime[item['name']];
				var result = /^[\d]$/.test(value)? '0,' + value : value.toString().split('').join(',');
				return result;
			})
			.join(',')
			.split(',');
			return arr;
		},
		//取得需要的dom
		getDom: function(){
			var me = this;
			$el = me.$el;
			$el
			.find('.digit')
			.each(function(index, item){
				me['digit' + index] = $(item);
			});
		},
		initialData: function(){
			var me = this;
			$.each(this.data, function(index, item){
				me['digit' + index].find('.up, .down').text(item);
			})
		},
		init: function(){
			this.data = this.formatData(
				this.formatTimer(this.timer)
			);
			this.getDom();
			this.initialData();
			this.autoChange();
		},
		/**
		*取得当前数字
		*@param tar {dom} digit dom对象
		*@param index {number} 需要取得第几个(up|down)的值
		*@param classname {classname selector} 需要取得的class (up|down)
		*/
		getNumber: function(tar, index, classname){
			return $.trim($(tar).find(classname).eq(index).text()) - 0;
		},
		/**
		*设置当个时钟的状态
		*@param arg {object} 配置
		*@param arg.handle {bool} (true:addclass, visibility visible|false:removeclass visibility hidden)
		*@param arg.tar {dom} 需要修改的dom
		*/
		setStatus: function(arg){
			var me = this;
			if(arg instanceof(Array)){
				$.each(arg, function(index, item){
					me.setStatus(item);
				});
			}else{
				$(arg.tar)[arg.handle ? 'addClass' : 'removeClass']('done')
				.css('visibility', (arg.handle ? 'visible' : 'hidden'));

			}
		},
		/**
		*设置当个时钟的样式
		*@param n {number} 第n个digit
		*@param value {number} 下一个数字
		*/
		setClockItem: function(n, newValue){
			var me = this;
			var $digit = me['digit' + n];
			var $up  = $digit.find('.up');
			var $down = $digit.find('.down');
			$up
				.eq(0)
				.text(newValue);
			me.setStatus([
				{
					tar: $up.eq(1).get(0),
					handle: true
				},
				{
					tar: $down.eq(1).text(newValue).get(0),
					handle: true
				}
			]);
			me.run(
				function(){
					$up.text(newValue);
					$down.text(newValue);
					me.setStatus([
						{
							tar: $up.eq(1).get(0),
							handle: false
						},
						{
							tar: $down.eq(1).get(0),
							handle: false
						}
					])
				},
				520
			)
		},
		checkPrevious: function(curIndex){
			var me = this;
			while(curIndex--){
				var value = me.getNumber(me['digit' + curIndex].get(0), 0, '.up');
				if(value > 0){
					return true;
				}
			}
		},
		countClock: function(curIndex){
			var me = this;
			if(me.checkPrevious(5)){

				//取得秒的个位，计算一下个值
				var value = me.getNumber(me['digit' + curIndex].get(0), 0, '.up');
				if(value<=0){
					switch(curIndex){
						case 0: return;
						case 1:
						case 3:
						case 5: me.setClockItem(curIndex, 9);me.countClock(--curIndex);break;
						case 2:
						case 4: me.setClockItem(curIndex, 5);me.countClock(--curIndex);break;
					}
				}else{
					var newValue = --value;
					me.setClockItem(curIndex, newValue);
				}

			}else{
				clearInterval(me.runtimer);
			}
			
		},
		autoChange: function(){
			var me = this;
			me.runtimer = me.run(function(){ me.countClock(5); }, 1100, true);
		}
	}
	new Clock({
		$el: $("#clock"),
		timer: 101039
	});
})(Zepto)























































