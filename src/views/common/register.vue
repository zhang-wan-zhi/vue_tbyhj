<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
          <h2 class="brand-info__text">renren-fast-vue</h2>
          <p
            class="brand-info__intro"
          >renren-fast-vue基于vue、element-ui构建开发，实现renren-fast后台管理前端功能，提供一套更优的前端解决方案。</p>
        </div>
        <div class="login-main">
          <h3 class="login-title">管理员注册</h3>
          <el-form
            :model="dataForm"
            :rules="dataRule"
            ref="dataForm"
            @keyup.enter.native="dataFormSubmit()"
            status-icon
          >
            <el-form-item prop="userName">
              <el-input v-model="dataForm.userName" maxlength="11" placeholder="帐号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
             <el-form-item prop="confirmPassword">
        <el-input v-model="dataForm.confirmPassword" type="password" placeholder="请确认密码"></el-input>
      </el-form-item>
            <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" placeholder="验证码"></el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <el-button v-show="time<=0" type="primary" @click="reflush">获取验证码</el-button>
                  <el-button v-show="time>0" :disabled="true" type="primary">{{time}}s</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">注册</el-button>
            </el-form-item>
            <el-form-item>
              <div >
                <span style="">已有账号？</span>
                <span @click="login()" style="cursor:pointer;color:#17B3A3">登录</span>
              </div>
            </el-form-item>
          </el-form>
           
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUUID } from "@/utils";
import Crypto from "../../utils/cryptoJS";
import CryptoJS from "crypto-js";
export default {
  
  data() {
        var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.dataForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else if (value.length < 6) {
        callback(new Error("输入密码长度最少为6!"));
      } else {
        callback();
      }
    };
       var checkPhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else if (!/^1[0123456789]\d{9}$/.test(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    return {  
      time: null,
      dataForm: {
        userName: "",
        password: "",
        uuid: "",
        captcha: "",
        confirmPassword:"",
        time: null
      },
      dataRule: {
            userName: [{ validator: checkPhone, trigger: "blur" }],
         confirmPassword: [{ validator: validatePass2, trigger: "blur" }],
    
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        captcha: [
          { required: true, message: "验证码不能为空", trigger: "blur" }
        ]
      },
      captchaPath: ""
    };
  },
  created() {
    this.reflushTime();
    if (window.parent.document.getElementsByTagName("iframe")[0]) {

      // if (top.location != self.location) top.location = self.location;
      window.parent.location.href = "/#/transitive";
      // window.parent.location.href='/#/member/taobao/authorized'
    }
    this.getCaptcha();
  },
  methods: {
    reflushTime() {

      if (!localStorage.getItem("time")) {
        return;
      }
      let now = new Date().getTime();
      if (now - localStorage.getItem("time") < 0) {
        localStorage.removeItem("time");
        this.time = 0;
      } else {
        this.time = parseInt(60 - (now - localStorage.getItem("time")) / 1000);
        let delay = setInterval(() => {
          this.time--;
  
          if (this.time <= 0) {
            clearInterval(delay);
          }
        }, 1000);
      }
    },
    reflush() {
        // this.$refs.dataForm.validateField('userName',function(e){
        //   if(e){
        //     return
        //   }else{
            
        //   }
         
        // }); 

      localStorage.setItem("time", new Date().getTime());
      this.time = 60;
      let delay = setInterval(() => {

        this.time--;
        if (this.time <= 0) {
          clearInterval(delay);
        }
      }, 1000);

     this.$http({
        url: this.$http.adornUrl("user/send"),
        method: "get",
        params: this.$http.adornParams({
          phone:this.dataForm.userName,
          type:0
        })
      }).then(e => {

      })
      // /user/send
    },
    login() {
      this.$router.push("login");
    },
    // 提交表单
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          function base64(str) {
            // 对字符串进行编码
            var encode = encodeURI(str);
            // 对编码的字符串转化base64
            var base64 = btoa(encode);
            return base64;
          }
          let encrypt =
            Math.random()
              .toString(36)
              .substr(2, 4) +
            base64(this.dataForm.password) +
            Math.random()
              .toString(36)
              .substr(2, 4) +
            Crypto.encrypt2(this.dataForm.password);
          this.$http({
            url: this.$http.adornUrl("/user/register"),
            method: "post",
            data: this.$http.adornData({
              mobile: this.dataForm.userName,
              password: this.dataForm.password,
              // password: this.dataForm.password,
              code:this.dataForm.captcha,
              type: 2,
              confirmPassword: this.dataForm.confirmPassword,
            })
          }).then(({ data }) => {
          //   if(data.code==0){
          //     this.$toast('注册成功')
          //      this.$http({
          //   url: this.$http.adornUrl("/user/login"),
          //   method: "post",
          //   data: this.$http.adornData({
          //     mobile: this.dataForm.userName,
          //     password: encrypt,
          //     // password: this.dataForm.password,
          //     code: this.dataForm.captcha
          //   })
          // }).then(({ data }) => {
          //   console.log(data);
          //   if (data && data.code === 0) {
          //     this.$cookie.set("token", data.token);
          //     this.$router.replace({ name: "home" });
          //   } else {
          //     this.getCaptcha();
          //     this.$message.error(data.msg);
          //   }
          // });
            // }
            

            console.log(data);
            if (data && data.code === 0) {
              this.$cookie.set("token", data.token);
              this.$router.replace({ name: "home" });
            } else {
              this.getCaptcha();
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    // 获取验证码
    getCaptcha() {
      this.dataForm.uuid = getUUID();
      this.captchaPath = this.$http.adornUrl(
        `/user/captcha.jpg?uuid=${this.dataForm.uuid}`
      );

      //  this.captchaPath = 'http://dev-tk-api.tutudiary.net/api'+`/user/captcha.jpg?id=${Math.random()}`
    }
  }
};
</script>

<style lang="scss">
.site-wrapper.site-page--login {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(38, 50, 56, 0.6);
  overflow: hidden;
  &:before {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    content: "";
    background-image: url(~@/assets/img/login_bg.jpg);
    background-size: cover;
  }
  .site-content__wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: transparent;
  }
  .site-content {
    min-height: 100%;
    padding: 30px 500px 30px 30px;
  }
  .brand-info {
    margin: 220px 100px 0 90px;
    color: #fff;
  }
  .brand-info__text {
    margin: 0 0 22px 0;
    font-size: 48px;
    font-weight: 400;
    text-transform: uppercase;
  }
  .brand-info__intro {
    margin: 10px 0;
    font-size: 16px;
    line-height: 1.58;
    opacity: 0.6;
  }
  .login-main {
    position: absolute;
    top: 0;
    right: 0;
    padding: 150px 60px 180px;
    width: 470px;
    min-height: 100%;
    background-color: #fff;
  }
  .login-title {
    font-size: 16px;
  }
  .login-captcha {
    overflow: hidden;
    > img {
      width: 100%;
      cursor: pointer;
    }
  }
  .login-btn-submit {
    width: 100%;
    margin-top: 38px;
  }
}
</style>
