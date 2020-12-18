<template>
  <div class="all">
    <div class="goods_detail">
      <img v-show="getData.itemPic" :src="getData.itemPic" />
      <div class="goods_content" v-loading="loading">
        <div class="solid">
          <div class="solid_left">
            <p>{{ getData.itemShortTitle }}</p>
            <div class="all_roe">
              <div class="row">
                <p>￥{{ getData.itemPrice }}</p>
                <p>价格</p>
              </div>
              <div class="row">
                <p>￥{{ getData.itemEndPrice }}</p>
                <p>券后价</p>
              </div>
              <div class="row">
                <p>{{ getData.tkRate }}%</p>
                <p>佣金比例</p>
              </div>
              <div class="row">
                <p>￥{{ getData.tkMoney }}</p>
                <p>佣金金额</p>
              </div>
            </div>
          </div>

          <div class="solid_right">
            <p>优惠券面额: {{ getData.couponMoney }}元</p>
            <p>优惠数量: {{ getData.couponNum }}</p>
            <p>
              券有效期: {{ getData.couponStartTime }}
              <span></span>
              {{ getData.couponEndTime }}
            </p>
          </div>
        </div>
        <h3 style="display: inline">推荐文案</h3>
        <span>{{ getData.guideArticle }}</span>
      </div>
    </div>
    <div class="send">
      <h2 class="leftC">朋友圈或微信群推广</h2>
      <div class="send_all">
        <div class="send_left">
          <p>1.主题文案:朋友圈主题文案或者微信群发单的推荐文案</p>
          <div class="fourStatus">
            <div>
              <!-- <el-input
                style="margin-top:8px"
                type="textarea"
                :rows="8"
                @blur="change(6)"
                @keyup.enter.native="inputCli(6)"
                ref="textarea6"
                id="textarea6"
                @mousedown.native="inputCli(6)"
                placeholder="请输入内容"
                v-model="textarea6"
                @focus="focus(6)"
              ></el-input> -->
            </div>
          </div>
          <div class="botton">
            <VueEmoji @input="onInput" :value="articleCircle"/>
            <!-- <p class="emojid">表情</p>
            <div class="allEmoji">
              <li @click="allEmojiChoosed(index)" v-for="(item,index) in emojiCompact" :key="index">
               {{item}}
              </li>
            </div>-->
            <el-button
              style="margin-left: 50px"
              @click="add('#随机表情#')"
              type="primary"
              >#随机表情#</el-button
            >
            <el-button @click="add('#短链接#')" type="primary"
              >#短链接#</el-button
            >
            <el-button @click="add('#原价#')" type="primary">#原价#</el-button>
            <el-button @click="add('#券后价#')" type="primary"
              >#券后价#</el-button
            >
            <el-button @click="add('#券值#')" type="primary">#券值#</el-button>
            <el-button @click="add('#淘口令#')" type="primary"
              >#淘口令#</el-button
            >
          </div>
        </div>
        <div class="send_right">
          <p>2.朋友圈或微信群图片</p>
          <upload
            :limit="9"
            :started="true"
            :backPic="backPic"
            v-on:addPic="addPic"
          ></upload>
        </div>
        <div class="send_left">
          <p>3.第一条评论：发朋友圈时生效（评论区可编辑并直接转发）</p>
          <div class="fourStatus">
            <div>
              <el-input
                style="margin-top: 8px"
                type="textarea"
                :rows="8"
                placeholder="请输入内容"
                v-model="articleComment1"
              ></el-input>
            </div>
          </div>
        </div>
        <div class="send_left">
          <p>4.第二条评论:发朋友圈时生效</p>
          <div class="fourStatus">
            <div>
              <el-input
                style="margin-top: 8px"
                type="textarea"
                :rows="8"
                placeholder="请输入内容"
                v-model="articleComment2"
              ></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="block">
      <el-checkbox v-model="checked">定时发送</el-checkbox>
      <el-date-picker
        v-model="value1"
        :disabled="!checked"
        type="datetime"
        class="data"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择日期时间"
      ></el-date-picker>
      <!-- <el-date-picker
        :disabled="!checked"
        value-format="yyyy-MM-dd"
        class="data"
        v-model="value1"
        type="date"
        placeholder="选择日期"
      ></el-date-picker>-->
    </div>
    <el-button class="el_center" @click="circlrUpadte" type="primary"
      >提交审核</el-button
    >
  </div>
</template>


<script>
import upload from "./upload";
import VueEmoji from "emoji-vue";
export default {
  name: "",
  data() {
    return {
      lastNeedEmojiData: null,
      emojiCompact: null,
      inputIndex: null,
      loading: true,
      navCopy: null,
      value1: null,
      productUrl: null,
      couponUrl: null,
      textarea6: null,
      id: null,
      articleComment1: null,
      articleComment2: null,
      checked: false,
      backPic: null,
      allPic: [],
      getData: {},
      articleCircle: null,
    };
  },
  created() {
    // this.emoji=emoji[0]
    if(localStorage.getItem('goodsData')){
      const dataGet = JSON.parse(localStorage.getItem('goodsData'))
      if (dataGet.shopType == "B") {
        dataGet.productUrl = "https://detail.tmall.com/item.htm?id=" + dataGet.itemId
        
      }
      if (dataGet.shopType == "A") {
        dataGet.productUrl = "https://item.taobao.com/item.htm?id=" + dataGet.itemId
      }
      // 获取默认图片
      
      this.loading = false
      this.getData = dataGet
      return
    }
    /* if(localStorage.getItem('goodsDatas')){
      const dataGet = JSON.parse(localStorage.getItem('goodsData'))
      if (dataGet.shopType == "B") {
        dataGet.productUrl = "https://detail.tmall.com/item.htm?id=" + dataGet.itemId
        console.log(dataGet);
      }
      if (dataGet.shopType == "A") {
        dataGet.productUrl = "https://item.taobao.com/item.htm?id=" + dataGet.itemId
      }
      this.getData = JSON.parse(localStorage.getItem('goodsDatas'))  
    } */
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getbackData();
      console.log('这是getdata');
      console.log(this.getData);
      this.loading = false
      return;
    }
    /* console.log('成功执行2'); */
    
  },
  destroyed() {
    localStorage.removeItem("goodsData");
    /* localStorage.removeItem("goodsDatas"); */
  },
  components: {
    upload: upload,
    VueEmoji,
  },
  watch: {},
  methods: {
    onInput(event) {
      console.log(event);
      
      this.getData.articleCircle = event.data
      console.log(this.getData);
      //event.data contains the value of the textarea
    },
    allEmojiChoosed(index) {
      this.emoji = emoji[index];
      console.log(this.emoji);
      this.add(this.emoji.char, index);
    },
    bystesLength(str) {
      var count = 0;
      for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
          count += 2;
        } else {
          count++;
        }
      }
      return count;
    },
    backDisplay() {
      this.$http({
        url: "https://mpapi.tkbutiedan.com/mpapi/product/display",
        method: "post",
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=utf-8",
        },
        data: this.$http.adornData(
          {
            couponUrl: this.couponUrl,
            tbUrl: this.productUrl,
          },
          null,
          "form"
        ),
      }).then((e) => {
        console.log('这是e2');
        console.log(e);
        if (e.data.code !== 0) {
          // this.$refs["ruleForm"].resetFields();
          return;
        }
        // this.failData = null;
        // this.$refs["ruleForm"].validate();
        /* let goodsData = e.data.data; */
        this.getData = e.data.data
        this.getData.couponUrl = this.couponUrl;
        this.getData.productUrl = this.productUrl;
        this.getData.articleCircle = this.articleCircle
        this.getData.articleComment1 = this.articleComment1
        this.getData.articleComment2 = this.articleComment2

        /* this.getData = JSON.parse(localStorage.getItem('goodsDatas')) */
        console.log('zheshigetdata');
        console.log(this.getData);
        /* if (!this.textarea6) {
          this.textarea6 = goodsData.guideArticle;
        } */
        /* goodsData.articleCircle = this.productUrl; */

        /* goodsData.couponUrl = this.couponUrl;
        this.getData = goodsData; */
        // localStorage.setItem("goodsData", JSON.stringify(goodsData));
        // console.log(e);
      });
    },
    getbackData() {
      //   /product/friend/circle/info/{id}
      /* console.log('成功执行getbackData'); */
      this.$http({
        url: this.$http.adornUrl("product/friend/circle/info/" + this.id),
        method: "get",
        params: this.$http.adornParams({}),
      }).then((e) => {
        if (e.data.code == 0) { 
        if (e.data.data.updateTime) {
          this.checked = true;
          this.value1 = e.data.data.updateTime;
        }
        console.log('这是e');
        console.log(e);
        this.couponUrl = e.data.data.couponUrl;
        this.productUrl = e.data.data.productUrl;
        this.articleCircle = e.data.data.articleCircle
        this.articleComment1 = e.data.data.articleComment1
        this.articleComment2 = e.data.data.articleComment2
        this.backDisplay();
        // this.getData.itemPic=e.data.data.itemPic;
        // this.getData.itemPic=e.data.data.itemPic;
        // this.getData.itemPic=e.data.data.itemPic;
        /* this.textarea6 = e.data.data.articleCircle;

        this.textarea7 = e.data.data.articleComment1;
        this.textarea8 = e.data.data.articleComment2; */
        this.backPic =
          e.data.data.imgUrl1 +
          "," +
          e.data.data.imgUrl2 +
          "," +
          e.data.data.imgUrl3 +
          "," +
          e.data.data.imgUrl4 +
          "," +
          e.data.data.imgUrl5 +
          "," +
          e.data.data.imgUrl6 +
          "," +
          e.data.data.imgUrl7 +
          "," +
          e.data.data.imgUrl8 +
          "," +
          e.data.data.imgUrl9;
        }
      });
    },
    addPic(e) {
      this.allPic = e.split(",");
    },
    // getcircle() {
    //   this.$http({
    //     url: this.$http.adornUrl("product/friend/circle/list"),
    //     method: "get",
    //     params: this.$http.adornParams({
    //       limit: 10
    //     })
    //   }).then(e => {
    //     console.log(e);
    //   });
    // },
    circlrUpadte() {
      console.log(this.getData);
      console.log(this.value1);
      if(localStorage.getItem('goodsData')){
      /* console.log(localStorage.getItem('goodsData')); */
      if (this.allPic[0]) {
        var index = this.allPic[0].indexOf("/upload/");
      }

      this.$http({
        url: this.$http.adornUrl("product/friend/circle/save"),
        method: "post",
        data: this.$http.adornData({
          archive: 0,
          articleCircle: this.getData.articleCircle,
          articleComment1: this.getData.articleComment1,
          articleComment2: this.getData.articleComment2,
          couponUrl: this.getData.couponUrl,
          id: this.id,
          sendTime: this.value1,
          imgUrl1: this.allPic[0] && this.allPic[0].slice(index + 1),
          imgUrl2: this.allPic[1] && this.allPic[1].slice(index + 1),
          imgUrl3: this.allPic[2] && this.allPic[2].slice(index + 1),
          imgUrl4: this.allPic[3] && this.allPic[3].slice(index + 1),
          imgUrl5: this.allPic[4] && this.allPic[4].slice(index + 1),
          imgUrl6: this.allPic[5] && this.allPic[5].slice(index + 1),
          imgUrl7: this.allPic[6] && this.allPic[6].slice(index + 1),
          imgUrl8: this.allPic[7] && this.allPic[7].slice(index + 1),
          imgUrl9: this.allPic[8] && this.allPic[8].slice(index + 1),
          productUrl: this.getData.productUrl,
          itemId: this.getData.itemId,
          itemTitle: this.getData.itemTitle,
          itemPic: this.getData.itemPic,
          status: 0,
          updateTime: null,
          userId: 0,
          videoUrl: null,
        }),
      }).then((e) => {
        if (e.data.code == 0) {
          this.$message({
            showClose: true,
            message: "提交成功！",
          });
          this.$router.push({ name: "home" });
        }
      });
      }
      // 修改文案提交
      if (this.$route.query.id) {
        console.log('提交修改data');
        console.log(this.getData);
        this.id = this.$route.query.id;
        this.$http({
        url: this.$http.adornUrl("product/friend/circle/update"),
        method: "post",
        data: this.$http.adornData({
          archive: 0,
          articleCircle: this.getData.articleCircle,
          articleComment1: this.getData.articleComment1,
          articleComment2: this.getData.articleComment2,
          couponUrl: this.getData.couponUrl,
          id: this.id,
          sendTime: this.value1,
          imgUrl1: this.allPic[0] && this.allPic[0].slice(index + 1),
          imgUrl2: this.allPic[1] && this.allPic[1].slice(index + 1),
          imgUrl3: this.allPic[2] && this.allPic[2].slice(index + 1),
          imgUrl4: this.allPic[3] && this.allPic[3].slice(index + 1),
          imgUrl5: this.allPic[4] && this.allPic[4].slice(index + 1),
          imgUrl6: this.allPic[5] && this.allPic[5].slice(index + 1),
          imgUrl7: this.allPic[6] && this.allPic[6].slice(index + 1),
          imgUrl8: this.allPic[7] && this.allPic[7].slice(index + 1),
          imgUrl9: this.allPic[8] && this.allPic[8].slice(index + 1),
          productUrl: this.getData.productUrl,
          itemId: this.getData.itemId,
          itemTitle: this.getData.itemTitle,
          itemPic: this.getData.itemPic,
          status: 0,
          updateTime: null,
          userId: 0,
          videoUrl: null,
        }),
      }).then((e) => {
        if (e.data.code == 0) {
          this.$message({
            showClose: true,
            message: "修改成功！",
          });
          this.$router.push({ name: "home" });
        }
      });
      }
      
      //  product/friend/circle/update
    },
    add(con, isEmoji) {
      var box = document.getElementsByClassName("emoji-wysiwyg-editor")[0];
      var content = box.innerHTML;
      console.log(content);
      console.log(box.firstChild);
      console.log(window.getSelection());
      setTimeout(() => {
        box.focus();
      });
      let selection = window.getSelection();
      const Range = selection.getRangeAt(0);
      console.log(Range);
      let index = window.getSelection().anchorNode;
      /* let str = window.getSelection().anchorNode.innerHTML.length
      console.log(str); */
      console.log(index);
      const endDom = Range.endContainer;
      const offset = Range.endOffset;
      var node = document.createElement("span");

      //node.setAttribute("contenteditable", "false");

      node.setAttribute("class", "at");

      node.innerHTML = con;
      Range.insertNode(node)
      /* var node =
        typeof content === "string"
          ? document.createTextNode(content)
          : content;
      for(let key in content) {
        if(content[key] === '>'){
          console.log(key);
        }
      }
      if (index != 0) {
        // window.getSelection().setSelectionRange(3, 3);
        let nowData = box.innerHTML;
        console.log('前面');
        console.log(nowData.slice(0, index));
        box.innerHTML =
          nowData.slice(0, index) + con + nowData.slice(index);

        // Range.select();
        // Range.moveStart("character", -1);
        setTimeout(() => {
          window
            .getSelection()
            .getRangeAt(0)
            .setStart(box.firstChild, index + con.length);
          window
            .getSelection()
            .getRangeAt(0)
            .setEnd(box.firstChild, index + con.length);
        }, 1);

        //     console.log(Range)
        // //  window.getSelection().getRangeAt(0).setStart(box,con.length)
        //  Range.setStartAfter(node);
        //   Range.collapse(true);
      } else {
        let nowData = box.innerHTML;
        box.innerHTML = con + nowData;
        setTimeout(() => {
          window
            .getSelection()
            .getRangeAt(0)
            .setStart(box.firstChild, index + con.length);
          window
            .getSelection()
            .getRangeAt(0)
            .setEnd(box.firstChild, index + con.length);
        }, 1);
        //  Range.setStart(box,10)
      } */

      return;
    },

    change(index) {
      if (!this.navCopy) {
        console.log(111);
      }
      if (this.navCopy != index) {
        this.navCopy = "";
      }
      if (index) {
        this.navCopy = index;
      }
      return;
    },

    focus(num) {
      let theId = "textarea" + num;
      // console.log(document.getElementById('textarea').selectionStart)
      setTimeout(() => {
        this.inputIndex = document.getElementById(theId).selectionStart;
        console.log(this.inputIndex);
      });
      // this.inputIndex = document.getElementById(theId).selectionStart;
      // console.log("选择",this.inputIndex);
      this.navCopy = "";
    },
    inputCli(num) {
      let theId = "textarea" + num;
      console.log("点击率");
      //  this.focus(num)
      setTimeout(() => {
        this.inputIndex = document.getElementById(theId).selectionStart;
      });
      console.log(this.inputIndex);
    },
  },
};
</script>

<style scoped>
.all {
  padding: 10px;
}
h4 {
  text-align: center;
}
.send_all {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.send_left {
  min-width: 40%;
}
.send_right {
  width: 40%;
}
.goods_detail {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.solid_right {
  padding: 0 30px;
  min-width: 400px;
}
.solid_right p {
  display: flex;
}
.solid_right p span {
  width: 10px;
  height: 1px;
  display: block;
  background: #666;

  margin: 0 3px;
  margin-top: 8px;
}
.goods_detail img {
  width: 200px;
  height: 200px;
  margin-right: 20px;
}
.solid {
  display: flex;
  border: 1px solid #ddd;
  margin-bottom: 15px;
}
.solid_left {
  padding: 0 20px;
  flex: 1;
}
.solid_left p {
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.solid .all_roe {
  display: flex;
  min-width: 400px;
  justify-content: space-between;
}
.solid .solid_right {
  margin-left: 30px;
  flex: 1;
  position: relative;
}
.leftC {
  position: relative;
}
.leftC::after {
  position: absolute;
  content: "";
  top: 10%;
  height: 80%;
  left: -10px;
  width: 6px;
  background: #298ff5;
}
.goods_content {
  flex: 1;
}
.row {
  text-align: center;
}
.row p:nth-child(1) {
  font-size: 24px;
}
.solid .solid_right::after {
  content: "";
  position: absolute;
  left: -30px;
  height: 80%;
  top: 10%;
  width: 1px;
  background: #ddd;
}
.solid .solid_right p:nth-child(2) {
  margin-top: 30px;
}
.botton {
  margin-top: 20px;
}
.block {
  display: flex;
  margin-top: 20px;
  align-items: center;
}
.block .data {
  margin-left: 20px;
}
.el_center {
  margin: auto;
  margin-top: 20px;
  margin-left: 50%;
  transform: translateX(-50%);
}
.allEmoji {
  display: flex;
  width: 291px;
  flex-wrap: wrap;
  list-style: none;
  height: 200px;
  overflow: hidden;
  overflow-y: auto;
  box-shadow: 0 0 14px #ddd;
  display: none;
}
.allEmoji li {
  margin: 6px;
  cursor: pointer;
}
.emojid:hover + .allEmoji {
  display: block;
  color: red;
}
.all >>> .emoji-wysiwyg-editor {
  width: 600px !important;
  height: 240px !important;
  margin-bottom: 30px;
}
.all >>> .emoji-picker-icon {
  top: 275px !important;
  left: 0px !important;
}

</style>
