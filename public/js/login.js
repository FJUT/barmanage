/**
 * Created by 99171 on 2017/1/24.
 */
const Vue = require('vue')
const $ = require('jquery')
const validator = require('validator')

validator.isValidPassword = (str) => {
  const regex = /^[a-zA-Z0-9]{6,20}$/

  return regex.test(str)
}

const vm = new Vue({
  el: '#app',
  data() {
    return {
      route: 'login',
      phonenumber: '',
      pwd: '',
      error_message: '',
      r_phonenumber: '',
      r_pwd: '',
      r_pwd_re: '',
      r_register_tip: '',
      r_btn_text: '马上注册',
      disabled: false
    }
  },
  methods: {
    changeRoute(type) {
      this.route = type
    },
    clickLogin(e) {
      const phonenumber = this.phonenumber
      const pwd = this.pwd

      if (!validator.isMobilePhone(phonenumber, 'zh-CN')) {
        e.preventDefault()
        this.error_message = '请输入正确的手机号码'
        return
      }

      if (!validator.isValidPassword(pwd)) {
        e.preventDefault()
        this.error_message = '密码错误'
        return
      }

      return true
    },
    clickRegister(e) {
      if (this.disabled) {
        return
      }

      e.preventDefault()
      var phonenumber = this.r_phonenumber
      var pwd = this.r_pwd
      var pwd_re = this.r_pwd_re

      if (!validator.isMobilePhone(phonenumber, 'zh-CN')) {
        this.r_register_tip = '请输入正确的手机号码'
        return
      }

      if (!validator.isValidPassword(pwd)) {
        this.r_register_tip = '密码长度至少6位'
        return
      }

      if (pwd != pwd_re) {
        this.r_register_tip = '两次密码不一致'
        return
      }

      this.r_btn_text = '正在注册...'
      this.disable = true

      $.ajax({
        url: '/register',
        type: 'post',
        data: {
          phonenumber: phonenumber,
          password: pwd
        }
      }).done(response => {
        switch (response.iRet) {
          case 0:
            this.r_register_tip = response.message
            setTimeout(function () {
              location.href = '/login'
            }, 1000)
            break
          case -1:
            this.disabled = false
            this.r_register_tip = response.message
            this.r_btn_text = '马上注册'
            break
        }
      })
    }
  }
})