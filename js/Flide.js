/**
 * Created by wmx on 2016/8/12.
 */
/**
  默认html模板
  <div class="slide_list">
    <div class="item" data-role="item">
      <img1>
    </div>
    <div class="item" data-role="item">
      <img2>
    </div>
    ...
  </div>
 */
/*
默认CSS
.slide_list{
  overflow: hidden;
  display: flex;
  justify-content:space-between;
  align-items:center;
  .item{
    flex-shrink:0;
    margin-right: ??;
    width: ??;
    height: ??;
    img{
      width: 100%;
      height: 100%;
    }
  }
}
 */
(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS:
        factory(require('jquery'));
    } else {
        // Browser globals:
        factory(window.jQuery);
    }
})(this, function($) {

    var NAME = "Flide",
        VERSION = "1.0.0",
        FLIDE_KEY = 'flide',
        DATA_KEY = 'mx-flide',
        JQUERY_NO_CONFLICT = $.fn[NAME];

    var Default = {
        initfocus: 0, //默认焦点第一张
        sPicWidth: 310, //非焦点图宽度
        sPicHeight: 218, //非焦点图宽度
        bPicWidth: 418, //焦点图宽度
        bPicHeight: 295, //焦点图高度
        picMargin: 20, //图片间距
        showPicCount: 3, //容器内最多显示3张
        speed: 200, //滑动速度
        // perSlide: 1, //每次滑动1张
        // autoSlide: false //是否自动滑动
    };

    var Flide = (function($) {
        var Flide = function(element, option) {
            this._option = this._getOption(option);
            this._$element = $(element);
            this._$item= this._$element.find("[data-role='item']");
            this._$prev_btn=$("[data-role='prev']");
            this._$next_btn=$("[data-role='next']");
            this._$element.data(FLIDE_KEY, this);
            this.nowFocus = Default.initfocus;
            this.leftMax = 0;
            this.rightMax = this._$item.length - 1;
            this.sPicCount = this._option.showPicCount - 1;
            this.mLeft = 0;
            this.mRight = this._option.showPicCount - 1;
            this._init(this.nowFocus);
        };

        Flide.prototype._init = function() {
            // this._calcWidth();
            this.tabTo(this._option.initfocus);
            this._initEventHandle();
        };


        Flide.prototype._initEventHandle = function() {
            $(document).on('click', "[data-role='next']", $.proxy(this.next, this));
            $(document).on('click', "[data-role='prev']", $.proxy(this.prev, this));
            $(document).on('click', "[data-role='item']", $.proxy(this.clickTo, this));
        };

        Flide.prototype._offEventHandle = function() {
            $(document).off('click', "[data-role='next']");
            $(document).off('click', "[data-role='prev']");
            $(document).off('click', "[data-role='prev']");
        };

        Flide.prototype._calcWidth = function() {
            var wrapperWidth,
                picWidth,
                marginWidth;

            picWidth = this._option.bPicWidth + this._option.sPicWidth * (this._option.showPicCount - 1);
            marginWidth = this.picMargin * (this._option.showPicCount - 1);
            wrapperWidth = picWidth + marginWidth;
            this._$element.css('width', wrapperWidth + 'px');
        };

        Flide.prototype._calcOffset = function() {
            if (this.nowFocus < this._option.showPicCount) {
                return 0;
            }
            var leftOffset = -(this.nowFocus - this._option.showPicCount + 1) * (this._option.sPicWidth+this._option.picMargin);
            return leftOffset;
        };

        Flide.prototype.next = function() {
            this.nowFocus++;
            this.judgeMax();
            this.judgeSlide("next");
            var speed = this._option.speed;
            this._$item.eq(this.nowFocus - 1).animate({
                width: this._option.sPicWidth + "px",
                height: this._option.sPicHeight + "px"
            }, speed);
            this._$item.eq(this.nowFocus).animate({
                width: this._option.bPicWidth + "px",
                height: this._option.bPicHeight + "px"
            }, speed);
        };

        Flide.prototype.prev = function() {
            this.nowFocus--;
            this.judgeMax();
            this.judgeSlide("prev");
            var speed = this._option.speed;
            this._$item.eq(this.nowFocus + 1).animate({
                width: this._option.sPicWidth + "px",
                height: this._option.sPicHeight + "px"
            }, speed);
            this._$item.eq(this.nowFocus).animate({
                width: this._option.bPicWidth + "px",
                height: this._option.bPicHeight + "px"
            }, speed);
        };

        Flide.prototype.tabTo = function(i) {
            var oldFocus = this.nowFocus;
            this.nowFocus = i;
            this.judgeMax();
            this.judgeSlide("tabTo");
            var speed = this._option.speed;
            this._$item.eq(oldFocus).animate({
                width: this._option.sPicWidth + "px",
                height: this._option.sPicHeight + "px"
            }, speed);
            this._$item.eq(this.nowFocus).animate({
                width: this._option.bPicWidth + "px",
                height: this._option.bPicHeight + "px"
            }, speed);
        };

        Flide.prototype.clickTo=function(e){
          var i=$(e.currentTarget).index();
          if(this.nowFocus==i){
            return;
          }
          this.tabTo(i);
        };

        Flide.prototype.judgeSlide = function(type) {
            var Offset = this._calcOffset() + "px";
            var nowFocus = this.nowFocus;
            if (nowFocus >= this.mLeft && nowFocus <= this.mRight) {
                return;
            }
            switch (type) {
                case "prev":
                    this.mLeft=this.nowFocus;
                    this.mRight--;
                    break;
                case "next":
                    this.mLeft++;
                    this.mRight=this.nowFocus;
                    break;
                case "tabTo":
                    if(this.nowFocus<this.mLeft){
                      this.mLeft=this.nowFocus;
                      this.mRight=this.mLeft+this.sPicCount;
                    }
                    if(this.nowFocus>this.mRight){
                      this.mLeft=this.mRight-this.sPicCount;
                      this.mRight=this.nowFocus;
                    }
                    break;
            }
            var speed = this._option.speed;
            this._$item.eq(0).animate({
                marginLeft: Offset
            }, speed);
        };

        Flide.prototype.judgeMax = function() {
            var leftMax = 0;
            var rightMax = this._$item.length - 1;
            var speed = this._option.speed;
            if (this.nowFocus == this.leftMax) {
                this._$prev_btn.hide();
            } else {
                this._$prev_btn.show();
            }
            if (this.nowFocus == this.rightMax) {
                this._$next_btn.hide();
            } else {
                this._$next_btn.show();
            }
        };

        Flide.prototype._getOption = function(option) {
            return $.extend(true, {}, Default, option);
        };

        Flide.prototype.destroy = function() {
            this._$element.removeData(FLIDE_KEY);
            this._offEventHandle();
            delete this;
        };

        Flide._jQueryInterface = function(config) {
            var args = [].slice.call(arguments, 1);
            return this.each(function(i, elem) {

                var data,
                    _config,
                    flide;

                data = $(elem).data(DATA_KEY);
                _config = $.extend(true, {}, data, typeof config === 'object' ? config : null);
                flide = $(elem).data(FLIDE_KEY);
                if (!flide) {
                    flide = new Flide(elem, _config);
                }
                if (typeof config == "string") {
                    flide[config](args);
                }
            });
        };
        return Flide;
    })($);

    $.fn[NAME] = Flide._jQueryInterface;
    $.fn[NAME].Constructor = Flide;
    $.fn[NAME].noConflict = function() {
        $.fn[NAME] = JQUERY_NO_CONFLICT;
        return Flide._jQueryInterface;
    };

    typeof module == 'object' && (module.exports = Flide);
});
