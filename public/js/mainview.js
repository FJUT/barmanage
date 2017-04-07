/**
 * Created by dengdongdong on 2017/4/5.
 */

const Vue = require('vue')
const $ = require('jquery')

//基于webpack正确引入jquery的方式之上，引入bootstap
import 'bootstrap/dist/js/bootstrap.min'

import Element from 'element-ui'
Vue.use(Element)

const vm = new Vue({
  el: '#app',
  data: function () {
    return {
      money: '12313',
      feedback: '',
      news: [], //所有新闻条数

      //总览展示的5条
      main5news: [],
      //当前页索引
      curPageIndex: 1,
      //新闻分页总数
      newsPages: 0,
      //每页展示的新闻数
      newsPerPageCount: 8,
      //当前页展示的8条新闻
      newsCurShow: [],

      //新闻内容显示
      newsTitle: '',
      newsContent: '',
    }
  },
  mounted: function () {
    //在这里赋值触发watch
    this.$data['news'] = window._jiufu_news
  },
  watch: {
    news: function (val) {
      //计算页数
      this.$data['newsPages'] = Math.ceil(val.length % this.$data['newsPerPageCount'])

      //首页展示的5条
      let _t_main5news = []
      if (val.length < 5) {
        $.extend(true, _t_main5news, val)
      } else {
        for (let _it in val) {
          if (_it > 4)
            break
          _t_main5news.push(val[_it])
        }
      }
      this.$data['main5news'] = _t_main5news

      //当前展示的新闻
      this.$data['newsCurShow'] = this.getCurShowNews()
    },

    curPageIndex: function (val) {
      //当前展示的新闻
      this.$data['newsCurShow'] = this.getCurShowNews()
    }
  },
  methods: {
    showBillDetail: function (event) {
      //使用bootstrap的组件modal
      $('#billdetailModel').modal()
    },
    showMoreNews: function (event) {
      $('#morenewsModel').modal()
    },

    Format : function(date, fmt) { //author: meizz
      var o = {
        "M+" : date.getMonth()+1,                 //月份
        "d+" : date.getDate(),                    //日
        "h+" : date.getHours(),                   //小时
        "m+" : date.getMinutes(),                 //分
        "s+" : date.getSeconds(),                 //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S"  : date.getMilliseconds()             //毫秒
      };
      if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
      for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      return fmt;
    },

    getCurShowNews: function () {
      let _news = this.$data['news']
      let _curNews = []
      let _curPageIndex = this.$data['curPageIndex']
      let _numPerPage = this.$data['newsPerPageCount']
      if (_news.length < _numPerPage) {
        $.extend(true, _curNews, _news)
      } else {
        for (let _it in _news) {
          if (_it >= (_curPageIndex - 1) * _numPerPage && _it < _curPageIndex * _numPerPage) {
            _curNews.push(_news[_it])
          }
        }
      }
      return _curNews
    },

    onPageChange: function (val) {
      this.$data['curPageIndex'] = val
    },

    timeformatter1: function (data, target) {
      if(target['property'] == "newsTime") {
        return this.Format(new Date(data['newsTime']), 'yyyy-MM-dd')
      }
    },

    timeformatter2: function (data, target) {
      if(target['property'] == "newsTime") {
        return this.Format(new Date(data['newsTime']), 'yyyy-MM-dd hh:mm')
      }
    },

    //点击首页的5条新闻
    main5newsClick: function (data, event, target) {
      this.showNew(data)
    },

    moreNewsClick: function (data, event, target) {
      this.showNew(data)
    },

    showNew: function (data) {
      this.$data['newsTitle'] = data['newsTitle']
      this.$data['newsContent'] = data['newsContent']
      $('#newdetailModel').modal()
    }
  }
})
