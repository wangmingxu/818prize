$(function() {
  var activityId;
  var master_tml=$("#master_tpl").html();
  var perWeek=604800000;
  var first_week=new Date(2016,7,19);
  var now_date=new Date();
  var nowWeek_order=Math.ceil((now_date-first_week)/perWeek);
  
  window.onscroll = function() {
      var scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrolltop > 500) {
          $(".go_top").show();
      } else {
          $(".go_top").hide();
      }
  };
  $(".go_top").on('click', function() {
      window.scrollTo(0, 0);
  });

  $(".slide_list .item").on("active",function(){
    var selectWeek_order=$(this).index()+1;
    if(selectWeek_order>nowWeek_order){
      $(".master_msg").empty();
      return;
    }
    getActivityId(selectWeek_order);
    $.ajax({
      url: '/activity/query/weekLotteryResult',
      type: 'GET',
      dataType: 'json',
      data: {activityId: activityId}
    })
    .done(function(res) {
      var data=res.model;
      data.nowWeek_order=nowWeek_order;
      data.selectWeek_order=selectWeek_order;
      renderMaster(data);
    })
    .fail(function() {
      console.log("error");
    });

  });

  $(".slide_list").Flide();

  function getActivityId(week_order){
    switch (week_order) {
      case 1:
        activityId=4;
        break;
      case 2:
        activityId=5;
        break;
      case 3:
        activityId=6;
        break;
      case 4:
        activityId=7;
        break;
      case 5:
        activityId=8;
        break;
      case 6:
        activityId=9;
        break;
      default:

    }
  }

  function renderMaster(data){
      var tpl = _.template(master_tml);
      $(".master_msg").html(tpl(data));
  }

});
