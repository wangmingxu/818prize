$(function(){

    //抽奖
    var iNow = -1,                               //当前值
        iCount = 8,                              //中奖的总个数
        iSpeed = 100,                           //速度
        iCycle = 64,                            //至少步数
        iStepNow = -1,                           //当前步
        timer = null,                           //定时器
        iKey = null,                               //中奖值  0-8对应9种奖品
        bMove = true,                           //是否在抽奖
        uid = null,                             //用户ID
        timesCount=null,                        //总抽奖次数
        timeNow=0,                              //当前抽奖次数
        activityIdList=[],                      //抽奖编号
        sWord='',                               //中奖文字
        arrLottery = [];                        //中奖数组

    var $timesCount=$(".rest_chance span");
    var $startBtn=$(".start_btn");

    for (var i=0;i<=iCount;i++){
        arrLottery.push($(".tab-"+i)[0]);// 排序数组
    }


    function getTimes(){
      $.ajax({
        url: '/activity/query/times',
        type: 'GET',
        dataType: 'json',
        data: {activityTypeId: 1}
      })
      .done(function(data) {
        activityIdList=data.model;
        timesCount=data.model.length;
        $timesCount.text(timesCount);
        if(timesCount>0){
          btnEnable($startBtn);
          $(".figer").show();
        }else {
          $(".start_btn img").eq(0).hide();
          $(".start_btn img").eq(1).show();
        }
      })
      .fail(function() {
        console.log("error");
      });

    }

    getTimes();

    function btnDisable(btn){
      btn.off('click');
    }

    function btnEnable(btn){
      btn.on("click",getIKey);
    }

    function getIKey(data){
      btnDisable($startBtn);
      if(timeNow<timesCount){
        $.ajax({
          url: '/activity/lottery',
          type: 'GET',
          dataType: 'json',
          data: {activityTicketId:activityIdList[timeNow] }
        })
        .done(function(data) {
          timeNow++;
          $timesCount.text(timesCount-timeNow);
          iKey=data.model.activityPrizeId-1;
          startLottery();
        })
        .fail(function() {
          console.log("error");
          btnEnable($startBtn);
        });
      }

    }

    function startLottery(){
      if(bMove){
          bMove=false;
          setClass();
      }
    }



    // //点击抽奖
    // $startBtn.on("click",getIKey);

    //立即领取
    $(".sureBtn").on("click",function(){
        $(".mask_layer").hide();
        bMove=true;
        if(timeNow==timesCount){
          $(".figer").hide();
          $(".start_btn img").eq(0).hide();
          $(".start_btn img").eq(1).show();
          return;
        }
        btnEnable($startBtn);
    });

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
                }
            }
            if (iSpeed<40) {
                iSpeed=40;        //中间固定速度;
            }
            $(arrLottery).removeClass("active");
            $(arrLottery).eq(iNow).addClass("active");
            if(iNow>=iCount){
                iNow=-1;           //超过还原值;
            }
            timer = setTimeout(setClass,iSpeed);
        }
    }

    function showPrize(id){
        switch(id){
            case 0:
                sWord="20元代金券";
                break;
            case 1:
                sWord="30元话费";
                break;
            case 2:
                sWord="电影票1张";
                break;
            case 3:
                sWord="面膜1盒";
                break;
            case 4:
                sWord="车载小冰箱1个";
                break;
            case 5:
                sWord="100元话费";
                break;
            case 6:
                sWord="车载吸尘空气净化器1个";
                break;
            case 7:
                sWord="长隆水上乐园门票1张";
                break;
            case 8:
                sWord="海洋王国门票1张";
                break;
        }
        $(".prize_box .now_prize").text(sWord);
        $(".mask_layer").show();
    }




});
