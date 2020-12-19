<template>
  <div>
    <div class="screenshot" :id="picAdd == true ? '' : 'tpAdd'">
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        accept=".jpg, .png, .bmp, .gif , .mp4"
        :on-remove="handleRemove"
        :on-change="changeFile"
        :before-upload="beforeUpload"
        :http-request="uploadSectionFile"
        :file-list="fileLists"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
      <video id="upvideo" v-show="showRentPrise"></video>
      <canvas id="mycanvas"></canvas>
    </div>
    <div id="canDiv"></div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  props: {
    limit: {
      default: 1,
    },
    backPic: {
      default: null,
    },
    started: {
      default: false,
    },
  },
  name: "",
  data() {
    return {
      fileLists: [],
      dialogImageUrl: "",
      dialogVisible: false,
      picAdd: true,
      fileList: [],
      // importForm:{
      //   fileName
      // },
      ruleForm: {
        getUrl: [],
      },
      showRentPrise: true,
      imgurl: null,
      typeMp4: 0,
    };
  },
  watch: {
    backPic(newVal) {
      console.log(newVal);
      if (newVal) {
        console.log(this.backPic);
        this.backPic.split(",").forEach((e) => {
          if (e != "null") {
            console.log(e);
            if (e.slice(0, 4) !== "http") {
              var data = window.SITE_CONFIG.baseApiUrl + e;
            } else {
              data = e;
            }
            this.ruleForm.getUrl.push(data);
            /* this.fileLists.push({url: 'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1878211416,3784931148&fm=26&gp=0.jpg'}); */
            this.fileLists.push({ url: data });
            this.$emit("addPic", this.ruleForm.getUrl.join(","));
          }
        });
        if (this.ruleForm.getUrl.length == this.limit) {
          this.picAdd = false;
        }
      }
    },
  },
  // created(){
  //   this.urlLength=
  // },
  methods: {
    beforeUpload() {
      console.log('beforeUpload');
    },
    uploadSectionFile() {},
    handlePictureCardPreview(file, fileList) {
      console.log(file, 111);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    changeFile(file, response, fileList) {
      console.log("来了", file, this.limit);
      console.log('response');
      console.log(response);
      console.log('fileList');
      console.log(fileList);
      // this.$emit('addPic','我来了')
      var _this = this;
      // 判断上传文件种类个数
      /* for (const key in response) {
        console.log(response[key].raw.type);
        if (response[key].raw.type === "video/mp4") {
          this.typeMp4++;
          console.log(this.typeMp4);
          if (this.typeMp4 > 1) {
            console.log('只能上传一个');
          }
        }
      } */
      // 如果是视频的话
      if (file.raw.type === "video/mp4") {

        this.videoUrl = file.url;
        this.findvideocover(this.videoUrl, file);
      }
      this.fileList.push(file.raw);
      console.log(file.raw);
      // this.importForm.fileName = file.name;
      var formData = new FormData();
      formData.append("file", file.raw);
      formData.append("type", 3);
      this.$http({
        url: this.$http.adornUrl("file/upload"),
        method: "post",
        data: formData,
      }).then((e) => {
        //  this.urlLength=e.data.data.url.indexof('/upload/')
        console.log('upload的e');
        console.log(e);
        if (e.data.data.url.slice(-3) === "mp4") {
          console.log(e.data.data.url);
          _this.ruleForm.getUrl.push(
            window.SITE_CONFIG["baseApiUrl"] + this.imgurl
          );
          console.log(window.SITE_CONFIG["baseApiUrl"] + this.imgurl);
          /* this.fileLists.push({ url: this.imgurl}); */
          // _this.ruleForm.getUrl.push(
          //   'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1878211416,3784931148&fm=26&gp=0.jpg'
          // );
        } else if (e.data.data.url.slice(0, 4) !== "http") {
          _this.ruleForm.getUrl.push(
            window.SITE_CONFIG["baseApiUrl"] + e.data.data.url
          );
        } else {
          _this.ruleForm.getUrl.push(e.data.data.url);
        }

        console.log(_this.ruleForm.getUrl);
        _this.$emit("addPic", _this.ruleForm.getUrl.join(","));
        if (_this.ruleForm.getUrl.length == _this.limit) {
          _this.picAdd = false;
        }
      });
    },
    handleRemove(file, fileList) {
      console.log("删除掉了", file.uid);
      var theIndex; //删除的下标
      this.fileList.forEach((element, index) => {
        if (element.uid == file.uid) {
          console.log(index);
          theIndex = index;
        }
      });
      this.fileList.splice(theIndex, 1); //删掉了那个的下标
      this.ruleForm.getUrl.splice(theIndex, 1); //删掉了那个的下标
      this.picAdd = true;
      this.$emit("addPic", this.ruleForm.getUrl.join(","));
    },
    findvideocover(url, file) {
      const video = document.getElementById("upvideo"); // 获取视频对象
      // const video = document.createElement("video") // 也可以自己创建video
      console.log(video);
      video.src = url; // url地址 url跟 视频流是一样的
      var canvas = document.getElementById("mycanvas"); // 获取 canvas 对象
      const ctx = canvas.getContext("2d"); // 绘制2d
      video.crossOrigin = "anonymous"; // 解决跨域问题，也就是提示污染资源无法转换视频
      video.currentTime = 0.01; // 第一帧
      video.oncanplay = () => {
        canvas.width = video.clientWidth; // 获取视频宽度
        canvas.height = video.clientHeight; //获取视频高度
        // 利用canvas对象方法绘图
        ctx.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
        // 转换成base64形式
        this.imgsrc = canvas.toDataURL("image/png"); // 截取后的视频封面
        file.url = this.imgsrc;
        this.imgurl = this.imgsrc
        setTimeout(() => {
          console.log("隐藏了");
          this.showRentPrise = false;
          this.typeMp4 = 0
        }, 0);
      };
    },
    
  },
};
</script>

<style scoped>
.screenshot >>> .el-upload--picture-card {
  width: 96px;
  position: relative;
  height: 96px;
}

.screenshot >>> .el-icon-plus {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 50%;
}

.screenshot >>> .el-upload-list__item-actions {
  width: 96px;
  height: 96px;
}

.screenshot >>> .el-upload-list__item {
  width: 96px;
  height: 96px;
}

#tpAdd >>> .el-upload--picture-card {
  display: none;
}

#tpOneAdd >>> .el-upload--picture-card {
  display: none;
}

.showState {
  text-align: center;
  margin-top: 200px;
  margin-bottom: 200px;
  color: #e4334e;
}

#upvideo {
  /* display: none; */
  width: 100px;
  height: 100px;
}

#mycanvas {
  display: none;
}
</style>
