<template>

  <div class="site-wrapper site-page--login">
    
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
          <h2 class="brand-info__text">爆单库云发单</h2>
          <p class="brand-info__intro">一个高效稳定的云发单系统，XXXXXXXXXXXXXXX，XXXX</p>
        </div>
        <div class="login-main">
           <!-- <index></index> -->
          <h3 class="login-title">用户登录</h3>
          <el-form
            :model="dataForm"
            :rules="dataRule"
            ref="dataForm"
            @keyup.enter.native="dataFormSubmit()"
            status-icon
          >
            <el-form-item prop="userName">
              <el-input v-model="dataForm.userName" placeholder="帐号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" placeholder="验证码"></el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()" alt />
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
            </el-form-item>
            <el-form-item>
              <div>
                <span style>没有账号？</span>
                <span @click="register()" style="cursor:pointer;color:#17B3A3">注册</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import index from '../../index'
import { getUUID } from "@/utils";
import router from '@/router'
import Crypto from "../../utils/cryptoJS";
import CryptoJS from "crypto-js";
export default {
  // components:{
  //     index
  //   },
  data() {
    
    return {
      dataForm: {
        userName: "",
        password: "",
        uuid: "",
        from:'',
        captcha: ""
      },
      dataRule: {
        userName: [
          { required: true, message: "帐号不能为空", trigger: "blur" }
        ],
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

// beforeRouteEnter (to, from, next) {
//   let _this=this
//   if (localStorage.getItem("token")&&from.name) {
//     console.log(1111)
//     next()
//     setTimeout(()=>{
//       _this.$router.push(from.name)
//     },100)
    
//   }else{
//     next()
//   }
// },
// beforeRouteEnter(to, from, next) {
//   if(from.name&&localStorage.getItem('token')){
//       vm.$router.push(from.name)
//     }
//   next(vm=>{          
    
//     console.log(to)
//     console.log(from)
//   })
// },
  created() {
    console.log(this.$route.name=='login')
    // console.log(this.route)
    
    // if (localStorage.getItem("token")) {
    //   console.log(this.from)
    //   if(this.from){
    //     this.$router.push(this.from)
    //   }
      
    // }
    if (window.parent.document.getElementsByTagName("iframe")[0]) {
      console.log(window.parent.location.href);
      // if (top.location != self.location) top.location = self.location;
      window.parent.location.href = "/#/transitive";
      // window.parent.location.href='/#/member/taobao/authorized'
    }
    this.getCaptcha();
  },
  methods: {
    register() {
      this.$router.push("register");
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
            url: this.$http.adornUrl("/user/login"),
            method: "post",
            data: this.$http.adornData({
              mobile: this.dataForm.userName,
              password: encrypt,
              // password: this.dataForm.password,
              code: this.dataForm.captcha
            })
          }).then(({ data }) => {
            console.log(data);
            if (data && data.code == 0) {
              localStorage.setItem("token", data.token);
              this.$cookie.set("token", data.token);
              this.$router.push({ name: "home" });
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
