$(function() {
    var winnerList, scrollInterval;
    var winnerList_tml = $("#winnerList_tpl").html();
    var pageTab_tml = $("#pageTab_tpl").html();
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

    $(document).on("click",".page_num",function(e){
      var pageindex=$(e.currentTarget).data("pageindex");
      getSelfRes(pageindex);
    });

    $(".my_result").on('click', function() {
        $(this).hide();
        $(".all_result").show();
        clearInterval(scrollInterval);
        getSelfRes();
    });

    $(".all_result").on('click', function() {
        $(this).hide();
        $(".my_result").show();
        getAllLotteryRes();
        msgScroll();
    });

    function renderList(winnerList) {
        var tpl = _.template(winnerList_tml);
        $(".winner_container").html(tpl(winnerList));
    }

    function renderPageTab(totalSize) {
        var obj = {};
        obj.totalSize = totalSize;
        var tpl = _.template(pageTab_tml);
        $(".winner_container").append(tpl(obj));
    }

    function getSelfRes(i) {
        var pageIndex;
        if(i!="undefined"){
          pageIndex=i;
        }else {
          pageIndex=0;
        }
        $.ajax({
                url: '/activity/query/allSelfResult',
                type: 'GET',
                dataType: 'json',
                data: {
                    orgId: 24348,
                    pageIndex: pageIndex,
                    pageSize: 16
                }
            })
            .done(function(data) {
                // console.log(data);
                winnerList = data.model;
                var obj = {};
                obj.List = data.model.activityLotteryResultDTOList;
                renderList(obj);
                renderPageTab(data.model.totalSize);
                $(".page_tab").find(".page_num").eq(pageIndex).addClass('page_active');
            })
            .fail(function() {
                console.log("error");
            });
    }

    function getAllLotteryRes() {
        $.ajax({
                url: '/activity/query/allLotteryResult?activityTypeIdList=1&pageIndex=0&pageSize=40',
                type: 'GET',
                dataType: 'json'
            })
            .done(function(data) {
                // console.log(data.model.activitySimpleVOList);
                winnerList = data.model;
                var obj = {};
                obj.List = data.model.activitySimpleVOList;
                renderList(obj);
                msgScroll();
            })
            .fail(function() {
                console.log("error");
            });

    }
    getAllLotteryRes();

    function msgScroll() {
        if (winnerList.totalSize < 32) {
            return;
        }
        scrollInterval = setInterval(function() {
            $(".list_table").eq(0).find(".list_td").eq(0).animate({
                marginTop: "-61px"
            }, 500);
            $(".list_table").eq(1).find(".list_td").eq(0).animate({
                marginTop: "-61px"
            }, 500, function() {
                winnerList.activitySimpleVOList.push(winnerList.activitySimpleVOList.shift());
                var obj={};
                obj.List=winnerList.activitySimpleVOList;
                renderList(obj);
            });

        }, 5000);
    }
});
