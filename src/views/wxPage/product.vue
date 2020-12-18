<template>
  <div class="all">
    <el-dialog title="商品链接" :visible.sync="dialogVisible" width="30%">
      <!-- zeeeeeeeeeeeeee -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        status-icon
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="宝贝链接" prop="bbLink">
          <el-input v-model="ruleForm.bbLink"></el-input>
        </el-form-item>
        <el-form-item label="优惠券链接" prop="couponUrl">
          <el-input v-model="ruleForm.couponUrl"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="mouseOut2()" type="warning">检 测</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDialogVisible"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- <el-tabs type="border-card">
    <el-tab-pane label="产品管理">-->
    <el-dialog
      title="审核"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <div style="display: flex; margin-top: 10px; justify-content: center">
        <el-radio v-model="auditStatus" label="1" border>通过</el-radio>
        <el-radio v-model="auditStatus" label="2" border>拒绝</el-radio>
      </div>
      <div style="display: flex; margin-top: 30px; align-items: center">
        <p style="width: 40px">备注:</p>
        <el-input v-model="note" placeholder></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false"
          >确定</el-button
        >
      </span>
    </el-dialog>
    <div class="search">
      <el-button type="primary" @click="search(false)">添加淘宝商品</el-button>
      <!-- <el-input style="margin-right:20px" v-model="brandName" placeholder="品牌名"></el-input> -->

      <!-- <el-select style="margin-right:20px" clearable v-model="categoryName2" placeholder="分类名">
            <el-option
              v-for="item in category"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
      </el-select>-->
      <!-- <el-input style="margin-right:20px" v-model="categoryName" placeholder="分类名">



      </el-input>-->
      <!-- <el-input style="margin-right:20px" v-model="shopName" placeholder="店铺名"></el-input> -->
      <!-- <el-date-picker
            v-model="time"
            type="daterange"
            style="min-width:200px"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
      ></el-date-picker>-->
    </div>

    <div class="record_msg">
      <el-table
        @select="select"
        highlight-current-row
        v-loading="loading"
        @select-all="select"
        @selection-change="handleSelectionChange"
        :data="tableData"
        style="width: 100%; min-height: 300px; overflow-y: auto"
      >
        <el-table-column type="index" width="55"></el-table-column>

        <!-- <el-table-column
          width="250"
          label="商品"
          style=" overflow: hidden;	text-overflow: ellipsis;	-webkit-line-clamp:2;word-break:break-all;-webkit-box-orient:vertical;"
        >
          <template slot-scope="scope">
            <span
              style="    color: #4e6ef2;
    text-decoration: underline;text-align:left;float:left;
cursor:pointer"
              @click="titleLink2(scope.row)"
            >{{scope.row.itemTitle}}</span>
          </template>
        </el-table-column>-->
        <!-- <el-table-column label="券后价" prop="itemEndPrice"></el-table-column> -->
        <!-- <el-table-column prop="itemTitle" width="280" label="商品标题"> -->
        <!-- </el-table-column> -->
        <el-table-column width="280" label="商品标题">
          <template slot-scope="scope">
            <div
              @click="link(scope.row)"
              style="color: #409eff; cursor: pointer; text-align: left"
            >
              {{ scope.row.itemTitle }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品图片">
          <template slot-scope="scope">
            <div>
              <img
                @click="titleLink(scope.row)"
                style="width: 80px; cursor: pointer"
                :src="scope.row.itemPic"
                alt
              />
              <p
                @click="search(scope.row)"
                style="color: #409eff; cursor: pointer"
              >
                详情
              </p>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="佣金比例">
          <template slot-scope="scope">{{scope.row.tkRate}}%</template>
        </el-table-column>
        <el-table-column label="佣金">
          <template slot-scope="scope">{{scope.row.tkMoney}}元</template>
        </el-table-column>
        <el-table-column label="营销方式">
          <template slot-scope="scope">
            <p v-show="scope.row.promotionType==0">普通活动</p>
            <p type="primary" v-show="scope.row.promotionType==2">高佣定向</p>
            <p type="primary" v-show="scope.row.promotionType==3">高佣补贴</p>
            <p type="primary" v-show="scope.row.promotionType==4">社群验货</p>

            <p type="primary" v-show="scope.row.promotionType==5">合作单</p>
          </template>
        </el-table-column>-->
        <!-- <el-table-column prop="categoryName" label="分类"></el-table-column>
        <el-table-column prop="brandName" label="品牌"></el-table-column>-->
        <!-- <el-table-column width="180" label="店铺">
          <template style="display:flex" slot-scope="scope">
            <div v-show="scope.row.shopType=='C'" style="color:#fff;padding: 0 6px">
            </div>
            <div v-show="scope.row.shopType=='B'" style="color:#fff;padding: 0 6px">
           
            </div>
            {{scope.row.shopName}}
          </template>
        </el-table-column>-->

        <el-table-column width="140" label="状态">
          <template slot-scope="scope">
            <div>
              <p v-show="scope.row.status == 0" type="primary">待发送</p>
              <p v-show="scope.row.status == 1" type="danger">已发送</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="180"
          prop="createTime"
          label="商品发布时间"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          width="180"
          prop="createTime"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="stock(scope.row)" type="primary">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="tableData.length > 0" class="last_tochoose">
      <el-pagination
        background
        @prev-click="prevCurrentChange"
        @next-click="nextCurrentChange"
        @current-change="handleCurrentChange"
        layout="prev, pager, next, jumper"
        :total="allPage"
      ></el-pagination>
    </div>
    <!-- </el-tab-pane>
    </el-tabs>-->
  </div>
</template>

<script>
// import brandManage from "./brandManage";
// import sortManage from "./sortManage";
import axios from "axios";

export default {
  name: "",
  // components: {
  //   brandManage,
  //   sortManage
  // },
  data() {
    var isNull = (rule, value, callback) => {
      if (!value || value == null) {
        return callback(new Error("请输入内容"));
      } else if (this.failData) {
        return callback(this.failData);
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        bbLink: null,
        couponUrl: null,
      },
      rules: {
        bbLink: { required: true, validator: isNull, trigger: "blur" },
        couponUrl: { required: true, validator: isNull, trigger: "blur" },
      },

      category: [
        {
          value: "0",
          label: "默认",
        },
        {
          value: "2",
          label: "佣金",
        },
        {
          value: "1",
          label: "今日销量",
        },

        {
          value: "3",
          label: "补贴金额",
        },
      ],
      ids: [],
      note: "",
      failData: null,
      page: 1,
      sortName: null,
      dialogVisible: false,
      radio2: "1",
      radio: "1",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      upStatus: null,
      auditStatus: null,
      time: "",
      selectData: [],
      radio1: "1",
      allPage: 1,
      promotionType: "3",
      tableData: [],
      status: null,
      brandName: null,
      shopName: null,
      categoryName: null,
      categoryName2: null,
      itemTitle: null,
      startDateTime: null,
      endDateTime: null,
      centerDialogVisible: false,
      loading: true,
    };
  },
  created() {
    this.getProductData();
    // this.$http({
    //   url: this.$http.adornUrl("category/list"),
    //   method: "get",
    //   params: this.$http.adornParams({})
    // }).then(e => {
    //   this.category = e.data.categoryList.map(e => {
    //     return {
    //       value: e.id,
    //       label: e.name
    //     };
    //   });
    // });
  },

  methods: {
    mouseOut() {
      this.mouseOut2();
    },
    mouseOut2() {
      /* this.failData = "数据请求中..."; */
      if (this.ruleForm.bbLink && this.ruleForm.couponUrl) {
        this.$http({
          url: "https://mpapi.tkbutiedan.com/mpapi/product/display",

          method: "post",
          headers: {
            "content-type": "application/x-www-form-urlencoded; charset=utf-8",
          },
          data: this.$http.adornData(
            {
              couponUrl: this.ruleForm.couponUrl,
              tbUrl: this.ruleForm.bbLink,
              promotionType: "3",
            },
            null,
            "form"
          ),
        }).then((e) => {
          if (e.data.code !== 0) {
            this.failData = e.data.msg;
            this.$refs["ruleForm"].validate();
            // this.$refs["ruleForm"].resetFields();
            return;
          }
          this.$message({
            message: "优惠券检测成功",
            type: "success",
          });
          this.failData = null;
          this.$refs["ruleForm"].validate();
          let goodsData = e.data.data;
          /* goodsData.articleCircle = this.ruleForm.bbLink; */
          goodsData.couponUrl = this.ruleForm.couponUrl;
          localStorage.setItem("goodsData", JSON.stringify(goodsData));
          // this.search()
          console.log(e);
        });
      } else {
        return;
      }
    },
    titleLink(e) {
      window.open(
        "/#/nav/goods/detail?" + `id=${e.id}&publisherId=${e.publisherId}`
      );
      // /#/nav/goods/detail?id=' + row.id + '&publisherId=' + row.publisherId + '" target="_blank">' + value + '</ a>'
    },
    titleLink2(e) {
      if (e.shopType == "B") {
        window.open("https://detail.tmall.com/item.htm?id=" + e.itemId);
      }
      if (e.shopType == "C") {
        window.open("https://item.taobao.com/item.htm?id=" + e.itemId);
      }
      // /#/nav/goods/detail?id=' + row.id + '&publisherId=' + row.publisherId + '" target="_blank">' + value + '</ a>'
    },
    getProductData() {
      this.$http({
        url: this.$http.adornUrl("product/friend/circle/list"),
        method: "get",
        params: this.$http.adornParams({
          pageNo: this.page,
          pageSize: 10,
        }),
      }).then((e) => {
        if (e.data.data.list.length == 0 && e.data.data.totalCount > 0) {
          this.page--;
          this.getProductData();
        }
        this.tableData = e.data.data.list;
        this.allPage = e.data.data.totalCount;
        this.loading = false;
      });
    },
    payCash(e) {
      if (this.selectData.length == 0) {
        this.$message({
          message: " 请选择要修改的内容",
        });
        return;
      }
      if (this.selectData.length > 1) {
        this.$message({
          message: " 每次最多修改一条数据",
        });
        return;
      }
      this.$router.push({
        path: "/wx/send/product",
        query: { type: e, id: this.ids[0] },
      });
    },
    payCashs() {
      this.$router.push({ path: "/wx/send/product" });
    },
    link(row) {
      console.log(row);
      window.open(row.productUrl);
    },
    //上下架
    stock(row) {
      // product/stock/off
      // auditStatus: this.auditStatus
      this.$confirm("此操作将删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("product/friend/circle/delete"),
            method: "post",
            params: this.$http.adornParams({
              id: row.id,
            }),
          }).then((e) => {
            if (e.data.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getProductData();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });

      // this.$http({
      //   url: this.$http.adornUrl("product/stock/off"),
      //   method: "get",
      //   params: this.$http.adornParams({
      //     id: data.id
      //   })
      // }).then(e => {
      //   if (e.data.code == 0) {
      //     this.getProductData();
      //     this.$message({
      //       message: "修改成功",
      //       type: "success"
      //     });
      //   }
      // });
    },
    // search() {
    //   this.loading = true;
    //   this.getProductData();
    // },
    search(data) {
      
      if (data) {
        /* localStorage.setItem("goodsDatas", JSON.stringify(data)); */
        this.$router.push({
          path: "/wx/product/detail",
          query: {
            id: data.id,
          },
        });
      }
      this.dialogVisible = true;
      // this.$router.push('/wx/product/detail')
    },
    confirmDialogVisible() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.$router.push(
            "/wx/product/detail?id=" +
              JSON.parse(localStorage.getItem("goodsData")).itemId
          );
          this.$refs["ruleForm"].resetFields();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    checked(index, row) {
      if (this.selectData.length == 0) {
        this.$toast("请选择要审核的内容", 1000);
        return;
      }
      if (this.selectData.length > 1) {
        this.$toast("每次最多审核一条数据", 1000);
        return;
      }
      this.centerDialogVisible = true;
    },

    statusChange(status) {
      //将状态改为中文
      switch (status) {
        case 2:
          return "审核失败";
          break;
        case 0:
          return "审核中";
          break;
        case 1:
          return "审核通过";
          break;
        default:
          break;
      }
    },
    select(val) {
      console.log(val);
      this.selectData = val;
      this.ids = val.map((element) => {
        return element.id;
      });
      console.log(this.ids);
    },
    handleSelectionChange(val) {},

    //修改页码
    handleCurrentChange(val) {
      this.page = val;
      this.getProductData();
      this.loading = true;
      // this.changeSortID();
    },
    nextCurrentChange(val) {
      this.page = val;
      this.getProductData();
      this.loading = true;
      // this.changeSortID();
    },
    delect() {
      if (this.ids.length == 0) {
        this.$message({
          message: "请选择要删除的数据！",
          type: "warning",
        });
        return;
      }
      if (this.ids.length > 1) {
        this.$message({
          message: "每次最多删除一条数据！",
          type: "warning",
        });
        return;
      }

      this.$confirm("此操作将删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("product/remove"),
            method: "get",
            params: this.$http.adornParams({
              id: this.ids.join(","),
            }),
          }).then((e) => {
            if (e.data.code == 0) {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.loading = true;

              this.getProductData();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      // product/remove
    },
    prevCurrentChange(val) {
      this.page = val;
      this.getProductData();
      this.loading = true;

      // this.changeSortID();
    },
  },
};
</script>

<style scoped>
.all {
  padding: 20px;
}
.all >>> .el-button {
  margin-left: 0;
}
.search {
  display: flex;
  width: 100%;

  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}
/* .search p {
  width: fit-content;
  min-width: 80px;
  text-align: right;
  margin-right: 8px;
} */
.all >>> .cell {
  display: flex;
  align-items: center;
  justify-content: center;
}
.all >>> .el-dialog {
  width: 100%;
  min-width: 600px;
}
.search >>> .el-input__inner {
  /* width: 90%; */
  width: 150px;
}
.search >>> .el-input {
  /* width: 90%; */
  width: 150px;
}
.search >>> .el-button {
  margin-left: 20px;
}
.record_msg {
  margin-top: 10px;
}
.record_msg >>> .el-button {
  padding: 2px 6px;
}
.record_msg >>> tr td:last-child .el-button {
  padding: 10px 20px;
}
.record_msg >>> .el-table {
  text-align: center;
  padding-top: 20px;
}

.record_msg >>> .is-leaf {
  height: 44px;
  background: #f3f3f3;
  text-align: center;
}
.record_msg >>> td:nth-child(10) .cell {
  text-align: left;
  display: flex;
  justify-content: left;
}

.record_msg >>> th .cell {
  justify-content: center;
}
.record_msg >>> .el-table__row td {
  text-align: center;
}
.all >>> .el-pagination {
  text-align: center;
  margin-top: 10px;
}
.el-date-editor {
  min-width: 370px !important;
}
.el-table p {
  /* padding: 0px 10px;
  background: #17b3a3;
  color: #fff;
  border-radius: 8px;
  white-space: nowrap; */
}
.send_right {
  float: right;
}
</style>