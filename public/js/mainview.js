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
      money: 0,
      feedback: '',
      news: [], //所有新闻条数

      //总览展示的5条
      main5news: [],
      //当前页索引
      newsPageIndex: 1,
      //新闻分页总数
      newsPages: 0,
      //每页展示的新闻数
      newsPerPageCount: 8,
      //当前页展示的8条新闻
      newsCurShow: [],

      //新闻内容显示
      newsTitle: '',
      newsContent: '',

      //订单
      order: [],
      orderCount: 0,
      //订单每页显示数
      orderPerPageCount: 15,
      //订单总页数
      orderPages: 0,
      //订单当前显示页数
      orderPageIndex: 1,
      orderloading: false,

      //收入总额
      totalMoney: 0,
      userCount: 0,
      wallCount: 0,
      bapingCount: 0
    }
  },
  mounted: function () {
    //在这里赋值触发watch
    this.news = window._jiufu_news

    this.order = window._jiufu_order

    this.userCount = window._jiufu_user_count

    this.wallCount = window._jiufu_wall_count

    this.bapingCount = window._jiufu_baping_count

    this.totalMoney = window._jiufu_total_money

    this.orderCount = window._jiufu_order_count
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
      this.$data['newsCurShow'] = this.getCurShow(this.$data['news'], this.$data['newsPageIndex'], this.$data['newsPerPageCount'])
    },

    newsPageIndex: function (val) {
      //当前展示的新闻
      this.$data['newsCurShow'] = this.getCurShow(this.$data['news'], val, this.$data['newsPerPageCount'])
    },

    // order: function (val) {
    //   //计算页数
    //   this.$data['orderPages'] = Math.ceil(val.length % this.$data['orderPerPageCount'])
    //
    //   //当前展示的订单
    //   this.$data['orderCurShow'] = this.getCurShow(this.order, this.$data['orderPageIndex'], this.$data['orderPerPageCount'])
    // },

    orderCount: function (val) {
      //计算页数
      this.orderPages = Math.ceil(val.length % this.orderPerPageCount)
    },

    orderPageIndex: function (val) {
      let url = `/mainview/querybill?limit=${this.orderPerPageCount}&offset=${this.orderPerPageCount * ( val - 1 )}`
      this.orderloading = true
      $.ajax({
        url: url,
        success: function (json) {
          vm.orderCount = parseInt(json['count'])
          vm.order = json['order']
          vm.orderloading = false
        },
        error: (err) => {
          console.log(err)
        }
      })
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

    Format: function (date, fmt) { //author: meizz
      var o = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "h+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    },

    getCurShow: function (target, curIndex, numPerPage) {
      let _target = target//this.$data['news']
      let _curRet = []
      let _curPageIndex = curIndex //this.$data['newsPageIndex']
      let _numPerPage = numPerPage //this.$data['newsPerPageCount']
      if (_target.length < _numPerPage) {
        $.extend(true, _curRet, _target)
      } else {
        for (let _it in _target) {
          if (_it >= (_curPageIndex - 1) * _numPerPage && _it < _curPageIndex * _numPerPage) {
            _curRet.push(_target[_it])
          }
        }
      }
      return _curRet
    },

    onNewsPageChange: function (val) {
      this.newsPageIndex = val
    },

    onOrderPageChange: function (val) {
      this.orderPageIndex = val
    },

    timeformatter1: function (data, target) {
      if (target['property'] == "newsTime") {
        return this.Format(new Date(data['newsTime']), 'yyyy-MM-dd')
      }
    },

    timeformatter2: function (data, target) {
      if (target['property'] == "newsTime") {
        return this.Format(new Date(data['newsTime']), 'yyyy-MM-dd hh:mm')
      }
    },

    timeformatterOrder: function (data, target) {
      if (target['property'] == "createdAt") {
        return this.Format(new Date(data['createdAt']), 'yyyy-MM-dd hh:mm')
      }
    },

    genderFormat: function (row, column) {
      if (column.property == "gender") {
        let _gender = row.gender == 2 ? "女" : "男"
        return _gender
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
    },

    onFeedback: function (event) {
      $.ajax({
        url: '/feedback',
        dataType: "json",
        type: 'post',
        data: {content: this.feedback},
        success(response) {
          this.feedback = ''
        }
      })
    },

    closeBaping: function (event) {
      $.ajax({
        url: '/show/close',
        dataType: "json",
        type: 'get',
        success(response) {
          console.log(response)
        }
      })
    }
  }
})
