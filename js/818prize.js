$(function(){

    //抽奖
    var iNow = -1;                               //当前值
        iCount = 9,                              //中奖的总个数
        iSpeed = 100,                           //速度
        iCycle = 64,                            //至少步数
        iStepNow = -1,                           //当前步
        timer = null,                           //定时器
        iKey = 2,                               //中奖值  1-8对应8种奖品
        bMove = true,                           //是否在抽奖
        uid = null,                             //用户ID
        sWord='',                               //中奖文字
        arrLottery = [];                        //中奖数组

    for (var i=1;i<=iCount;i++){
        arrLottery.push($(".tab-"+i)[0]);// 排序数组
    };

    //点击抽奖
    $(".start_btn").on("click",function(){
        if(bMove){
            bMove=false;
            setClass();
        }
    });

    //立即领取
    $(".sureBtn").on("click",function(){
        $(".shadows").hide();
        $(".popBox").hide();
        bMove=true;
    });
   //关闭
   $(".closeR span").on("click",function(){
        $(".shadows").hide();
        $(".popBox").hide();
   })

    function setClass(){
        iNow++;
        iStepNow++;
        if(iStepNow==iCycle+iKey){
            //抽奖动作停止  重置
            clearTimeout(timer);
            iSpeed = 100;
            iNow=-1;
            iStepNow = -1;
            setTimeout(function(){
                showPrize(iKey);
            },100);
        }else {
            if(iStepNow<iCycle+iKey-10){
                iSpeed-=10;       //加速
            }else if(iStepNow>iCycle+iKey-10){
                iSpeed+=60;       //减速
                if(iSpeed>500){
                    iSpeed=500;   //结尾固定减速
                };
            };
            if (iSpeed<40) {
                iSpeed=40;        //中间固定速度;
            };
            $(arrLottery).removeClass("active");
            $(arrLottery).eq(iNow).addClass("active");
            if(iNow>=iCount){
                iNow=-1;           //超过还原值;
            };
            timer = setTimeout(setClass,iSpeed);
        };
    };

    function showPrize(id){
        switch(id){
            case 1:
                sWord="0.1%加息券";
                break;
            case 2:
                sWord="10888元旅游基金";
                break;
            case 3:
                sWord="奥维尼 洗漱包";
                break;
            case 4:
                sWord="小米自拍杆";
                break;
            case 5:
                sWord="手机防水袋潜水套";
                break;
            case 6:
                sWord="188元旅游基金";
                break;
            case 7:
                sWord="爱华仕（OIWAS）旅行箱";
                break;
            case 8:
                sWord="1888元旅游基金";
                break;
        }
        $(".shadows").show();
        $(".popBox #gxText2").text(sWord);
        $(".popBox").show();
    }




})
