var tab;
layui.config({
    base: 'js/',
    version: new Date().getTime()
}).use(['element', 'layer', 'navbar', 'tab'], function() {
    var element = layui.element(),
        $ = layui.jquery,
        layer = layui.layer,
        navbar = layui.navbar();
    tab = layui.tab({
        elem: '.admin-nav-card', //设置选项卡容器
        contextMenu: true,
        onSwitch: function(data) {},
        closeBefore: function(obj) { //tab 关闭之前触发的事件
            return true;
        }
    });
    //设置navbar
    renderNav();
    //渲染navbar
    navbar.render();
    //监听点击事件
    navbar.on('click(side)', function(data) {
        tab.tabAdd(data.field);
    });
    //左侧导航显隐
    $('.admin-side-toggle').on('click', function() {
        var sideWidth = $('#admin-side').width();
        if (sideWidth === 200) {
            $('#admin-body').animate({
                left: '0'
            }); //admin-footer
            $('#admin-footer').animate({
                left: '0'
            });
            $('#admin-side').animate({
                width: '0'
            });
        } else {
            $('#admin-body').animate({
                left: '200px'
            });
            $('#admin-footer').animate({
                left: '200px'
            });
            $('#admin-side').animate({
                width: '200px'
            });
        }
    });
    //全屏
    $('.admin-side-full').on('click', function() {
        var docElm = document.documentElement;
        //W3C  
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        }
        //FireFox  
        else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        }
        //Chrome等  
        else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        }
        //IE11
        else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
        layer.msg('按Esc即可退出全屏');
    });

    function renderNav() {
        navbar.set({
            spreadOne: true,
            elem: '#admin-navbar-side',
            cached: true,
            data: document.documentElement.clientWidth > 750 ? pc : mobile
        });
        navbar.render();
    }
    $(window).on("resize", function() {
        //  renderNav();
    })

    //手机设备的简单适配
    var treeMobile = $('.site-tree-mobile'),
        shadeMobile = $('.site-mobile-shade');
    treeMobile.on('click', function() {
        $('body').addClass('site-mobile');
    });
    shadeMobile.on('click', function() {
        $('body').removeClass('site-mobile');
    });
});