<template>
  <div class="all">
    <el-dialog title="选择验货单" :visible.sync="dialogVisible" width="60%">
      <div>
        <el-table
          highlight-current-row
          v-loading="loading"
          @select-all="selectAll"
          @current-change="currentChange"
          :data="tableData"
          style="width: 100%; min-height:300px;overflow-y:auto"
          @select="select"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
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
          </el-table-column>
          <el-table-column label="券后价" prop="itemEndPrice"></el-table-column>
          <el-table-column label="商品图片">
            <template slot-scope="scope">
              <img
                @click="titleLink(scope.row)"
                style="width:80px;cursor:pointer"
                :src="scope.row.itemPic"
                alt
              />
            </template>
          </el-table-column>
          <el-table-column label="佣金比例">
            <template slot-scope="scope">{{scope.row.tkRate}}%</template>
          </el-table-column>
          <el-table-column label="佣金">
            <template slot-scope="scope">{{scope.row.tkMoney}}元</template>
          </el-table-column>
          <!-- <el-table-column label="营销方式">
              <template slot-scope="scope">
                <el-button v-show="scope.row.promotionType==0">普通活动</el-button>
                <el-button type="primary" v-show="scope.row.promotionType==2">高佣定向</el-button>
                <el-button type="primary" v-show="scope.row.promotionType==3">高佣补贴</el-button>
                <el-button type="primary" v-show="scope.row.promotionType==4">社群验货</el-button>

                <el-button type="primary" v-show="scope.row.promotionType==5">合作单</el-button>
              </template>
          </el-table-column>-->
          <!-- <el-table-column prop="categoryName" label="分类"></el-table-column>
          <el-table-column prop="brandName" label="品牌"></el-table-column>-->
          <el-table-column width="180" label="店铺">
            <template style="display:flex" slot-scope="scope">
              <div v-show="scope.row.shopType=='C'" style="color:#fff;padding: 0 6px">
                <!-- <img style="width:30px" src="../../assets/img/tm.png" alt /> -->
              </div>
              <div v-show="scope.row.shopType=='B'" style="color:#fff;padding: 0 6px">
                <!-- <img style="width:30px" src="../../assets/img/tbao.png" alt /> -->
              </div>
              {{scope.row.shopName}}
            </template>
          </el-table-column>
        </el-table>
        <div v-show="tableData.length>0" class="last_tochoose">
          <el-pagination
            background
            @prev-click="prevCurrentChange"
            @next-click="nextCurrentChange"
            @current-change="handleCurrentChange"
            layout="prev, pager, next, jumper"
            :total="allPage"
          ></el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmCur">确 定</el-button>
      </span>
    </el-dialog>

    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      status-icon
      label-width="100px"
      class="demo-ruleForm"
    >
      <p class="title">宝贝信息</p>
      <el-form-item label="宝贝链接" prop="bbLink">
        <el-input @blur="mouseOut()" @focus="focus('bbLink')" v-model="ruleForm.bbLink"></el-input>
      </el-form-item>
      <el-form-item label="优惠券链接" prop="couponUrl">
        <el-input @blur="mouseOut2()" @focus="focus('couponUrl')" v-model="ruleForm.couponUrl"></el-input>
      </el-form-item>
      <el-form-item label="原价">
        <p style="width:120px">{{itemPrice||getdata.itemPrice}}</p>
        <!-- <el-input style="width:200px;margin-right:12px" readonly v-model="price"> -->
        <!-- </el-input> -->
        元
      </el-form-item>
      <el-form-item label="优惠券金额">
        <p style="width:120px">{{couponMoney||getdata.couponMoney}}</p>元
      </el-form-item>
      <el-form-item label="券后价">
        <el-input
          v-model="itemEndPrice"
          @input="function(val){
           itemEndPrice = val.replace(/[^0-9.]/g, '')
              .replace('.', '#*')
              .replace(/\./g, '')
              .replace('#*', '.').replace(/^(\d+)\.(\d\d).*$/, '$1.$2');
          }"
        ></el-input>元
        <!-- <p >{{itemEndPrice||getdata.itemEndPrice}}</p>元 -->
      </el-form-item>
      <el-form-item label="优惠券开始时间">
        <p style="width:300px">{{couponStartTime||getdata.couponStartTime}}</p>
      </el-form-item>
      <el-form-item label="优惠券结束时间">
        <p style="width:300px">{{couponEndTime||getdata.couponEndTime}}</p>
      </el-form-item>

      <div style="display:flex;justify-content:space-between;width:50%">
        <el-form-item label="优惠券数量">
          <p style="width:50px"></p>
        </el-form-item>
        <el-form-item label="总量">{{couponNum||getdata.couponNum}}</el-form-item>
        <el-form-item label="领取">
          <p style="width:50px">{{couponReceive||getdata.couponReceive}}</p>
        </el-form-item>
        <el-form-item label="剩余">
          <p style="width:50px">{{couponSurplus||getdata.couponSurplus}}</p>
        </el-form-item>
      </div>
      <p class="title">店铺信息</p>
      <el-form-item label="店铺">
        <el-input v-model="shopName" placeholder="系统解析自动填写" readonly></el-input>
      </el-form-item>
      <el-form-item label="商品标题">
        <el-input v-model="itemTitle" placeholder="系统解析自动填写" readonly></el-input>
      </el-form-item>
      <el-form-item label="商品描述">
        <el-input v-model="itemDesc" placeholder="系统解析自动填写" readonly></el-input>
      </el-form-item>
      <div style="display:flex;justify-content:space-between;width:50%">
        <el-form-item label="店铺评分"></el-form-item>
        <el-form-item label="宝贝分">
          <p style="width:50px">{{descScore||getdata.descScore}}</p>分
        </el-form-item>
        <el-form-item label="服务分">
          <p style="width:50px">{{serviceScore||getdata.serviceScore}}</p>分
        </el-form-item>
        <el-form-item label="物流分">
          <p style="width:50px">{{shipScore||getdata.shipScore}}</p>分
        </el-form-item>
      </div>
      <p class="title">活动信息</p>
      <el-form-item>
        <el-radio
          style="line-height:50px"
          @change="changeRadio"
          :disabled="disabled"
          v-model="radio"
          label="3"
        >高佣补贴</el-radio>
        <el-radio
          style="line-height:50px"
          @change="changeRadio"
          :disabled="disabled"
          v-model="radio"
          label="4"
        >社群验货</el-radio>
      </el-form-item>

      <el-form-item label="佣金比例" prop="tkRate">
        <el-input
          v-model="ruleForm.tkRate"
          class="tk_rate"
          @focus="focus('tkRate')"
          @input="function(val){
            ruleForm.tkRate = val.replace(/[^0-9.]/g, '')
              .replace('.', '#*')
              .replace(/\./g, '')
              .replace('#*', '.').replace(/^(\d+)\.(\d\d).*$/, '$1.$2');
          }"
          placeholder="淘客佣金比例"
        ></el-input>%
      </el-form-item>
      <el-form-item label="淘客佣金">
        <p
          style="width:120px"
        >{{ (ruleForm.tkRate*itemEndPrice/100).toFixed(2) || getdata.tkMoney.toFixed(2)}}</p>元
      </el-form-item>
      <div v-show="radio==='2'">
        <el-form-item label="
             定向佣金链接" prop="dxUrl">
          <el-input v-model="ruleForm.dxUrl" @focus="focus('dxUrl')" placeholder="申请定向佣金链接"></el-input>
        </el-form-item>
        <el-form-item label="
             申请定向备注" prop="dxRemark">
          <el-input v-model="ruleForm.dxRemark" @focus="focus('dxRemark')" placeholder="申请定向备注文字"></el-input>
        </el-form-item>
        <el-form-item label="
             定向佣金比例" prop="dxRate">
          <el-input
            style="width:160px;margin-right:12px"
            @focus="focus('dxRate')"
            v-model="ruleForm.dxRate"
            placeholder="定向佣金比例"
            @input="function(val){
            ruleForm.dxRate = val.replace(/[^0-9.]/g, '')
              .replace('.', '#*')
              .replace(/\./g, '')
              .replace('#*', '.').replace(/^(\d+)\.(\d\d).*$/, '$1.$2')
          }"
          ></el-input>%
        </el-form-item>
        <el-form-item label="
            定向佣金">
          <p
            style="width:120px"
          >{{ (itemEndPrice*ruleForm.dxRate/100).toFixed(2) || (isNaN((getdata.itemEndPrice*getdata.dxRate/100).toFixed(2))?'':((getdata.itemEndPrice*getdata.dxRate/100).toFixed(2))) }}</p>元
        </el-form-item>
      </div>
      <div v-show="radio==='3'">
        <el-form-item label="
             量" prop="promotionAmount">
          <el-input
            :disabled="butieTotalAmount==-1"
            style="width:160px;margin-right:12px"
            v-model="ruleForm.promotionAmount"
            @focus="focus('promotionAmount')"
            @input="function(val){
            ruleForm.promotionAmount = val.replace(/[^0-9]/g, '')
            
          }"
            placeholder="高佣补贴单数"
          ></el-input>单
          <el-switch
            v-model="butieTotalAmount"
            style="margin-left:20px"
            active-text="无上限"
            active-color="#13ce66"
            active-value="-1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="
             补贴比例" prop="returnCashRate">
          <el-input
            style="width:160px;margin-right:12px"
            v-model="ruleForm.returnCashRate"
            @focus="focus('returnCashRate')"
            @input="function(val){
            ruleForm.returnCashRate = val.replace(/[^0-9.]/g, '')
              .replace('.', '#*')
              .replace(/\./g, '')
              .replace('#*', '.').replace(/^(\d+)\.(\d\d).*$/, '$1.$2');
          }"
            placeholder="高佣补贴比例"
          ></el-input>%
        </el-form-item>
        <el-form-item label="
             补贴金额">
          <p
            style="width:120px"
          >{{(itemEndPrice*ruleForm.returnCashRate/100).toFixed(2)|| getdata.returnCashMoney}}</p>元
        </el-form-item>

        <el-form-item label="
             前" prop="butieHighAmount">
          <el-input
            style="width:160px;margin-right:12px"
            v-model="ruleForm.butieHighAmount"
            @focus="focus('butieHighAmount')"
            @input="function(val){
            ruleForm.butieHighAmount = val.replace(/[^0-9.]/g, '')
              .replace('.', '#*')
              .replace(/\./g, '')
              .replace('#*', '.').replace(/^(\d+)\.(\d\d).*$/, '$1.$2');
          }"
            placeholder="高补贴数"
          ></el-input>单，
          <el-form-item label="
             补" prop="butieHighPrice">
            <el-input
              style="width:160px;margin-right:12px"
              v-model="ruleForm.butieHighPrice"
              @focus="focus('butieHighPrice')"
              @input="function(val){
            ruleForm.butieHighPrice = val.replace(/[^0-9.]/g, '')
              .replace('.', '#*')
              .replace(/\./g, '')
              .replace('#*', '.').replace(/^(\d+)\.(\d\d).*$/, '$1.$2');
          }"
              placeholder="高佣补贴金额"
            ></el-input>元
          </el-form-item>
        </el-form-item>

        <el-form-item label="
             补贴销量" prop="returnCashSaleAmount">
          <el-input
            style="width:160px;margin-right:12px"
            v-model.number="ruleForm.returnCashSaleAmount"
            @focus="focus('returnCashSaleAmount')"
            placeholder="高佣补贴销量"
          ></el-input>
        </el-form-item>
        <div class="switchZ">
          <div class="switchZ_top">
            <p :style="{color:(zyanhuo==1?'#13ce66':'')}">是否赠验货</p>
            <el-switch
              v-model="zyanhuo"
              style="margin-left:20px"
              active-color="#13ce66"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </div>
          <el-form-item 
           :style="{ 
                visibility:(zyanhuo==0?'hidden':'')
              }"
          label="
             到达">
            <el-input
              :disabled="zyanhuo==0"
             
              style="width:160px;margin-right:12px"
              v-model.number="ruleForm.yanhuoThreshold"
              @focus="focus('yanhuoThreshold')"
              placeholder="高佣补贴销量"
            ></el-input>单，赠验货，
            <span
              :style="zyanhuo==0?'cursor:not-allowed':''"
              @click="yanhuoPage"
              style="color:#17b3a3;cursor:pointer"
            >{{productId?curRowName:'未选择验货商品'}}</span>
          </el-form-item>
        </div>
      </div>
      <div v-show="radio==='4'">
        <el-form-item label="
             需要销量">
          <el-input
            style="width:160px;margin-right:12px"
            v-model="requiredSaleAmount"
            placeholder="需要销量"
          ></el-input>
        </el-form-item>
        <el-form-item label="
            
           验货样品数" prop="checkGoodsAmount">
          <el-input
            style="width:160px;margin-right:12px"
            placeholder="验货销量"
            @focus="focus('checkGoodsAmount')"
            v-model="ruleForm.checkGoodsAmount"
          ></el-input>个
        </el-form-item>
        <el-form-item label="
            对渠道要求">
          <el-input
            type="textarea"
            v-model="memoToQdtuanzhang"
            rows="5"
            style="margin-right:12px;max-width:600px"
          ></el-input>
        </el-form-item>
      </div>
      <div v-show="radio==='5'">
        <el-form-item label="
            
           服务费比例" prop="serviceRate">
          <el-input
            style="width:160px;margin-right:12px"
            placeholder="服务费比例"
            @focus="focus('serviceRate')"
            @input="function(val){
            ruleForm.serviceRate = val.replace(/[^0-9.]/g, '')
              .replace('.', '#*')
              .replace(/\./g, '')
              .replace('#*', '.').replace(/^(\d+)\.(\d\d).*$/, '$1.$2');
          }"
            v-model="ruleForm.serviceRate"
          ></el-input>%
        </el-form-item>
        <el-form-item label="
            
           服务费金额">
          <p style="width:120px">{{ (itemEndPrice*ruleForm.serviceRate/100).toFixed(2) }}</p>元
        </el-form-item>
        <el-form-item label="
             需要销量">
          <el-input
            style="width:160px;margin-right:12px"
            v-model="requiredSaleAmount"
            placeholder="社群验货销量"
          ></el-input>
        </el-form-item>

        <el-form-item label="
            对渠道要求">
          <el-input
            type="textarea"
            v-model="memoToQdtuanzhang"
            rows="5"
            style="margin-right:12px;max-width:600px"
          ></el-input>
        </el-form-item>
      </div>
      <p class="title">上架下架</p>

      <el-form-item label="
上架时间" prop="time1">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="ruleForm.time1"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="
下架时间" prop="time2">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="ruleForm.time2"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <el-button style="margin-left:140px" @click="confirms" type="primary">{{confirm}}</el-button>
    <el-button @click="back">返回</el-button>
  </div>
</template>

<script>
export default {
  name: "",

  data() {
    var isNull = (rule, value, callback) => {
      if (!value || value == null) {
        return callback(new Error("请输入内容"));
      } else {
        callback();
      }
    };
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入宝贝链接"));
      }
      setTimeout(() => {
        if (this.failData && this.failData !== null) {
          callback(new Error(this.failData));
        } else {
          callback();
        }
      }, 1000);
    };
    var checkAge2 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入优惠券链接"));
      }
      setTimeout(() => {
        if (this.failData2 && this.failData2 !== null) {
          callback(new Error(this.failData2));
        } else {
          callback();
        }
      }, 1000);
    };
    return {
      needEnter: false,
      getdata: {},
      id: "",
      tableData: [],
      loading: false,
      descScore: null,
      requiredSaleAmount: null,
      returnCashMoney: null,
      serviceScore: null,
      zyanhuo: null,
      shipScore: null,
      couponMoney: null,
      itemPrice: null,
      butieTotalAmount: 0,
      memoToQdtuanzhang: null,
      textarea: null,
      allPage: null,
      requiredSaleAmount: null,
      itemEndPrice: null,
      couponEndTime: null,
      couponStartTime: null,
      couponNum: null,
      couponReceive: null,
      couponSurplus: null,
      shopName: null,
      sortTitle: null,
      itemTitle: null,
      itemDesc: null,
      tkMoney: null,
      productId: null,
      failData: null,
      failData2: null,
      dialogVisible: false,
      radio: "3",
      confirm: "确认",
      categoryId: null,
      time1: "",
      disabled: false,
      time2: "",
      category: [
        // {
        //   value: 0,
        //   label: "女装"
        // },
        // {
        //   value: 1,
        //   label: "男装"
        // },
        // {
        //   value: 2,
        //   label: "内衣"
        // },
        // {
        //   value: 3,
        //   label: "内衣"
        // },
        // {
        //   value: 4,
        //   label: "大哥大"
        // },
        // {
        //   value: 5,
        //   label: "内衣"
        // }
      ],
      taobaolj: "",
      page: 1,
      itemPic: null,
      shopType: null,
      couponlj: "",
      returnRelatedProductId: null,
      curRow: null,
      ruleForm: {
        bbLink: "",
        couponUrl: "",
        butieHighAmount: null,
        promotionAmount: null,
        tkRate: null,
        butieHighPrice: null,
        dxUrl: null,
        dxRemark: null,
        yanhuoThreshold: null,
        dxRate: null,
        time1: null,
        time2: null,
        returnCashRate: null,
        returnCashSaleAmount: null,
        checkGoodsAmount: null,
        serviceRate: null
      },
      price: "",
      rules: {
        yanhuoThreshold: { required: true, validator: isNull, trigger: "blur" },
        butieHighPrice: { required: true, validator: isNull, trigger: "blur" },
        butieHighAmount: { required: true, validator: isNull, trigger: "blur" },
        promotionAmount: { required: true, validator: isNull, trigger: "blur" },
        dxRate: { required: true, validator: isNull, trigger: "blur" },
        bbLink: { required: true, validator: checkAge, trigger: "blur" },
        couponUrl: { required: true, validator: checkAge2, trigger: "blur" },
        tkRate: { required: true, validator: isNull, trigger: "blur" },
        dxUrl: { required: true, validator: isNull, trigger: "blur" },
        dxRemark: { required: true, validator: isNull, trigger: "blur" },
        time1: { required: true, validator: isNull, trigger: "blur" },
        time2: { required: true, validator: isNull, trigger: "blur" },
        returnCashRate: { required: true, validator: isNull, trigger: "blur" },
        returnCashSaleAmount: {
          required: true,
          validator: isNull,
          trigger: "blur"
        },
        checkGoodsAmount: {
          required: true,
          validator: isNull,
          trigger: "blur"
        },
        serviceRate: { required: true, validator: isNull, trigger: "blur" }
      }
    };
  },
  created() {
    // alert(11)
    // this.$http.categoryControllerc({}).then(e => {
    //   console.log(e.data.categoryList);
    //   this.category = e.data.categoryList.map(e => {
    //     return e.name;
    //   });
    //   let obj = [];
    //   for (let i = 0; i < this.category.length; i++) {
    //     obj.push({
    //       value: i,
    //       label: this.category[i]
    //     });
    //   }
    //   this.category = obj;
    //   console.log(this.category);
    // });

    if (this.$route.query.id) {
      //修改
      this.confirm = "修改";
      this.disabled = true;
      this.id = this.$route.query.id;
      this.backData();
    } else {
      this.changeRadio(this.radio);
    }
  },
  methods: {
    select(selection, row) {
      console.log(row);
      if (selection.length > 1) {
        let del_row = selection.shift();
        this.$refs.multipleTable.toggleRowSelection(del_row, false);
      }
      this.curRow = row;
    },
    selectAll(selection) {
      console.log(selection);
      if (selection.length > 1) {
        selection.length = 1;
      }
      this.curRow = selection[0];
    },
    prevCurrentChange(val) {
      this.page = val;
      this.yanhuoPage();
      this.loading = true;

      // this.changeSortID();
    },

    //修改页码
    handleCurrentChange(val) {
      this.page = val;
      this.yanhuoPage();
      this.loading = true;
      // this.changeSortID();
    },
    nextCurrentChange(val) {
      this.page = val;
      this.yanhuoPage();
      this.loading = true;
      // this.changeSortID();
    },

    confirmCur() {
      this.dialogVisible = false;
      if (this.curRow == null) {
        this.productId = null;
        return;
      }
      this.productId = this.curRow.id;
      this.curRowName = this.curRow.itemShortTitle;
    },
    changeRadio(e) {
      this.mouseOut2();
      console.log(e);
      // this.$http.categoryproductDeposit({ t: e }).then(e => {
      //   if (e.data.code == 0) {
      //     if (e.data.status === 0) {
      //       this.category = [];
      //       this.categoryId = "";
      //       this.$confirm(e.data.msg, "提示", {
      //         confirmButtonText: "确定",
      //         cancelButtonText: "取消",
      //         type: "warning"
      //       });
      //     }
      //     if (e.data.status === -1) {
      //       this.category = [];
      //       this.categoryId = "";
      //       this.$confirm(e.data.msg, "提示", {
      //         confirmButtonText: "去开通类目",
      //         cancelButtonText: "取消",
      //         type: "warning"
      //       }).then(() => {
      //         this.$router.push({
      //           path: "/main/product/cases",
      //           query: {
      //             open: true
      //           }
      //         });
      //         // this.$message({
      //         //   type: 'success',
      //         //   message: '删除成功!'
      //         // });
      //       });
      //     } else {
      //       this.category = e.data.list.map(e => {
      //         return {
      //           value: e.id,
      //           label: e.name
      //         };
      //       });
      //       // let obj = [];
      //       // for (let i = 0; i < this.category.length; i++) {
      //       //   obj.push({
      //       //     value: i,
      //       //     label: this.category[i]
      //       //   });
      //       // }
      //       // this.category = obj;
      //     }
      //   }
      // });
    },
    inputTest(data) {
      try {
        data = Number(data).toFixed(2);
      } catch (error) {
        return;
      }
    },
    focus(e) {
      this.$refs["ruleForm"].clearValidate(e);

      // if (this.ruleForm.bbLink !== null || this.ruleForm.bbLink) {
      //   this.needEnter = false;
      // } else {
      //   if (e == "couponUrl") {
      //     this.needEnter = true;
      //     this.$refs["ruleForm"].validateField("bbLink");
      //     this.$refs["ruleForm"].clearValidate(e);
      //   }
      // }
      // this.$refs['ruleForm'].validateField('bbLink')
      // alert('🐖在看什么')
    },
    currentChange(curRow) {
      console.log(curRow);
      this.curRow = curRow;
    },
    yanhuoPage() {
      if (this.zyanhuo == 0) {
        return;
      }
      this.dialogVisible = true;
      this.$http({
        url: this.$http.adornUrl("product/mine"),
        method: "get",
        params: this.$http.adornParams({
          promotionType: 3,
          sort: this.sortName,
          page: this.page,
          limit: 10
        })
      }).then(e => {
        if (e.data.data.list.length == 0 && e.data.data.totalCount > 0) {
          this.page--;
          this.yanhuoPage();
        }
        this.tableData = e.data.data.list;
        this.allPage = e.data.data.totalCount;
        this.loading = false;
      });
    },
    mouseOut2() {
      // product/display
      if (this.ruleForm.couponUrl && this.ruleForm.bbLink) {
        this.$http({
          url: this.$http.adornUrl("product/display"),
          method: "post",
          headers: {
            "content-type": "application/x-www-form-urlencoded; charset=utf-8"
          },
          data: this.$http.adornData(
            {
              shopName: this.shopName,
              itemTitle: this.itemTitle,
              itemDesc: this.itemDesc,
              couponUrl: this.ruleForm.couponUrl,
              categoryId: this.categoryId || this.getdata.categoryId,
              tkRate: this.ruleForm.tkRate,
              dxUrl: this.ruleForm.dxUrl,
              dxRemark: this.ruleForm.dxRemark,
              dxRate: this.ruleForm.dxRate,
              itemPrice: this.itemPrice || this.getdata.itemPrice,
              couponMoney: this.couponMoney || this.getdata.couponMoney,
              tbUrl: this.ruleForm.bbLink,
              id: this.id || null,
              stockStartTime: this.ruleForm.time1,
              couponNum: this.couponNum || this.getdata.couponNum,
              couponReceive: this.couponReceive || this.getdata.couponReceive,
              couponSurplus: this.couponSurplus || this.getdata.couponSurplus,
              stockEndTime: this.ruleForm.time2,
              couponEndTime: this.couponEndTime || this.getdata.couponEndTime,
              couponStartTime:
                this.couponStartTime || this.getdata.couponStartTime,
              promotionType: Number(this.radio),
              serviceMoney: isNaN(
                (
                  ((this.itemEndPrice || this.getdata.itemEndPrice) *
                    this.ruleForm.serviceRate) /
                  100
                ).toFixed(2)
              )
                ? null
                : (
                    ((this.itemEndPrice || this.getdata.itemEndPrice) *
                      this.ruleForm.serviceRate) /
                    100
                  ).toFixed(2),
              tkMoney: this.tkMoney || this.getdata.tkMoney,
              descScore: this.descScore || this.getdata.descScore,
              serviceScore: this.serviceScore || this.getdata.serviceScore,
              shipScore: this.shipScore || this.getdata.shipScore,
              returnCashRate: this.ruleForm.returnCashRate,
              returnCashSaleAmount: this.ruleForm.returnCashSaleAmount,
              requiredSaleAmount: this.requiredSaleAmount,
              checkGoodsAmount: this.ruleForm.checkGoodsAmount,
              memoToQdtuanzhang: this.memoToQdtuanzhang,
              serviceRate: this.ruleForm.serviceRate,
              itemEndPrice: this.itemEndPrice
            },
            "form",
            "form"
          )
        }).then(e => {
          if (e.data.code == 0) {
            this.$refs["ruleForm"].clearValidate(e);
            this.failData2 = null;
            let urlData = e.data.data;
            this.itemPrice = urlData.itemPrice || this.itemPrice;
            this.couponMoney = urlData.couponMoney || this.couponMoney;
            this.itemEndPrice = urlData.itemEndPrice || this.itemEndPrice;
            this.couponSurplus = urlData.couponSurplus || this.couponSurplus;
            this.couponStartTime = urlData.couponStartTime;
            this.itemDesc = urlData.itemDesc;
            (this.descScore = urlData.descScore),
              (this.serviceScore = urlData.serviceScore),
              (this.shipScore = urlData.shipScore),
              (this.couponEndTime = urlData.couponEndTime);
            this.couponNum = urlData.couponNum || this.couponNum;
            this.couponReceive = urlData.couponReceive;
            this.itemTitle = urlData.itemTitle;
            this.shopName = urlData.shopName;
            this.itemPic = urlData.itemPic;
            this.shopType = urlData.shopType;
            if (!this.ruleForm.time1 || this.ruleForm.time1 == null) {
              this.ruleForm.time1 = urlData.couponStartTime;
            }
            if (!this.ruleForm.time2 || this.ruleForm.time2 == null) {
              this.ruleForm.time2 = urlData.couponEndTime;
            }
            // this.descScore=urlData.descScore
            // this.serviceScore=urlData.serviceScore
            // this.shipScore=urlData.shipScore
            // this.itemDesc=urlData.itemDesc
            // this.itemTitle=urlData.itemTitle
            // this.shopName=urlData.shopName
          } else {
            console.log(e.data.msg);
            this.failData = e.data.msg;
            this.failData2 = e.data.msg;
            this.$refs["ruleForm"].validateField("bbLink");
            this.$refs["ruleForm"].validateField("couponUrl");
          }
        });
      }
    },
    mouseOut() {
      // alert(this.ruleForm.couponUrl)
      if (
        this.id &&
        this.taobaolj == this.ruleForm.bbLink &&
        this.ruleForm.bbLink !== null
      ) {
        return;
      }

      if (this.ruleForm.couponUrl && this.ruleForm.bbLink) {
        this.$http({
          url: this.$http.adornUrl("product/display"),
          method: "post",
          headers: {
            "content-type": "application/x-www-form-urlencoded; charset=utf-8"
          },
          data: this.$http.adornData(
            {
              // shopName: this.shopName,
              // itemTitle: this.itemTitle,
              // itemDesc: this.itemDesc,
              couponUrl: this.ruleForm.couponUrl,
              // categoryId: this.categoryId || this.getdata.categoryId,
              // tkRate: this.ruleForm.tkRate,
              // dxUrl: this.ruleForm.dxUrl,
              // dxRemark: this.ruleForm.dxRemark,
              // dxRate: this.ruleForm.dxRate,
              // itemPrice: this.itemPrice || this.getdata.itemPrice,
              // couponMoney: this.couponMoney || this.getdata.couponMoney,
              tbUrl: this.ruleForm.bbLink,
              // id: this.id || null,
              // stockStartTime: this.ruleForm.time1,
              // couponNum: this.couponNum || this.getdata.couponNum,
              // couponReceive: this.couponReceive || this.getdata.couponReceive,
              // couponSurplus: this.couponSurplus || this.getdata.couponSurplus,
              // stockEndTime: this.ruleForm.time2,
              // couponEndTime: this.couponEndTime || this.getdata.couponEndTime,
              // couponStartTime:
              //   this.couponStartTime || this.getdata.couponStartTime,
              promotionType: Number(this.radio)
              // serviceMoney: isNaN(
              //   (
              //     ((this.itemEndPrice || this.getdata.itemEndPrice) *
              //       this.ruleForm.serviceRate) /
              //     100
              //   ).toFixed(2)
              // )
              //   ? null
              //   : (
              //       ((this.itemEndPrice || this.getdata.itemEndPrice) *
              //         this.ruleForm.serviceRate) /
              //       100
              //     ).toFixed(2),
              // tkMoney: this.tkMoney || this.getdata.tkMoney,
              // descScore: this.descScore || this.getdata.descScore,
              // serviceScore: this.serviceScore || this.getdata.serviceScore,
              // shipScore: this.shipScore || this.getdata.shipScore,
              // returnCashRate: this.ruleForm.returnCashRate,
              // returnCashSaleAmount: this.ruleForm.returnCashSaleAmount,
              // requiredSaleAmount: this.requiredSaleAmount,
              // checkGoodsAmount: this.ruleForm.checkGoodsAmount,
              // memoToQdtuanzhang: this.memoToQdtuanzhang,
              // serviceRate: this.ruleForm.serviceRate,
              // itemEndPrice: this.itemEndPrice
            },
            "form",
            "form"
          )
        }).then(e => {
          if (e.data.code == 0) {
            this.failData = null;
            let urlData = e.data.data;
            this.descScore = urlData.descScore;
            this.serviceScore = urlData.serviceScore;
            this.itemPic = urlData.itemPic;
            this.shopType = urlData.shopType;
            this.shipScore = urlData.shipScore;
            this.itemDesc = urlData.itemDesc;
            this.itemTitle = urlData.itemTitle;
            this.shopName = urlData.shopName;
            if (!this.ruleForm.time1 || this.ruleForm.time1 == null) {
              this.ruleForm.time1 = urlData.stockStartTime;
            }
            if (!this.ruleForm.time2 || this.ruleForm.time2 == null) {
              this.ruleForm.time2 = urlData.stockEndTime;
            }
          } else {
            this.failData = e.data.msg;
            this.$refs["ruleForm"].validateField("bbLink");
          }
        });
      }
    },

    backData() {
      this.$http({
        url: this.$http.adornUrl("product/get"),
        method: "get",
        params: this.$http.adornParams({
          id: this.id
        })
      }).then(e => {
        if (e.data.code == 0) {
          this.getdata = e.data.productEntity;
          this.shopName = this.getdata.shopName;
          this.itemTitle = this.getdata.itemTitle;
          this.itemDesc = this.getdata.itemDesc;
          this.ruleForm.couponUrl = this.getdata.couponUrl;

          setTimeout(() => {
            //  this.category=[];
            if (this.category.length > 0) {
              this.categoryId = this.getdata.categoryId;
            } else {
              this.categoryId = "";
            }
          }, 400);
          (this.returnRelatedProductId = this.getdata.returnRelatedProductId),
            (this.ruleForm.tkRate = this.getdata.tkRate);
          this.ruleForm.dxUrl = this.getdata.dxUrl;
          this.ruleForm.dxRemark = this.getdata.dxRemark;
          this.ruleForm.dxRate = this.getdata.dxRate;
          this.ruleForm.time1 = this.getdata.stockStartTime;
          this.ruleForm.time2 = this.getdata.stockEndTime;
          this.ruleForm.butieHighAmount = JSON.parse(
            this.getdata.promotionValue
          ).butieHighAmount;
          this.ruleForm.butieHighPrice = JSON.parse(
            this.getdata.promotionValue
          ).butieHighPrice;
          this.ruleForm.promotionAmount = this.getdata.promotionAmount;
          this.radio = this.getdata.promotionType + "";
          // this.promotionValue
          this.taobaolj = this.getdata.tbUrl;
          this.couponlj = this.getdata.couponUrl;
          this.ruleForm.yanhuoThreshold = this.getdata.checkGoodsAmount;
          this.ruleForm.returnCashRate = this.getdata.returnCashRate;
          this.ruleForm.returnCashSaleAmount = this.getdata.returnCashSaleAmount;
          this.requiredSaleAmount = this.getdata.requiredSaleAmount;
          this.ruleForm.checkGoodsAmount = this.getdata.checkGoodsAmount;
          this.memoToQdtuanzhang = this.getdata.memoToQdtuanzhang;
          this.ruleForm.serviceRate = this.getdata.serviceRate;
          this.requiredSaleAmount = this.getdata.requiredSaleAmount;
          var shop = this.getdata.shopType;
          this.itemEndPrice = this.getdata.itemEndPrice;
          if (shop == "B") {
            this.ruleForm.bbLink =
              "https://detail.tmall.com/item.htm?id=" + this.getdata.itemId;
          } else if (shop == "C") {
            this.ruleForm.bbLink =
              "https://item.taobao.com/item.htm?id=" + this.getdata.itemId;
          }
          if (this.returnRelatedProductId) {
            this.productId = this.returnRelatedProductId;
            // this.curRowName=this.
          }
          this.changeRadio(this.radio);
        }
      });
    },
    saveUpload() {
      let time1 = this.ruleForm.time1 + " 00:00:00";
      let time2 = this.ruleForm.time2 + " 23:59:59";
      // product/save
      this.$http({
        url: this.$http.adornUrl("product/save"),
        method: "post",
        data: this.$http.adornData({
          shopName: this.shopName,
          itemTitle: this.itemTitle,
          itemDesc: this.itemDesc,
          couponUrl: this.ruleForm.couponUrl,
          categoryId: this.categoryId || this.getdata.categoryId,
          tkRate: this.ruleForm.tkRate,
          dxUrl: this.ruleForm.dxUrl,
          dxRemark: this.ruleForm.dxRemark,
          dxRate: this.ruleForm.dxRate,
          itemPrice: this.itemPrice || this.getdata.itemPrice,
          couponMoney: this.couponMoney || this.getdata.couponMoney,
          tbUrl: this.ruleForm.bbLink,
          productId: this.productId,
          shopType: this.shopType,
          itemPic: this.itemPic,
          id: this.id || null,
          butieTotalAmount: this.butieTotalAmount,
          stockStartTime: this.ruleForm.time1,
          couponNum: this.couponNum || this.getdata.couponNum,
          couponReceive: this.couponReceive || this.getdata.couponReceive,
          couponSurplus: this.couponSurplus || this.getdata.couponSurplus,
          stockEndTime: this.ruleForm.time2,
          couponEndTime: this.couponEndTime || this.getdata.couponEndTime,
          couponStartTime: this.couponStartTime || this.getdata.couponStartTime,
          returnCashMoney:
            ((this.itemEndPrice * this.ruleForm.returnCashRate) / 100).toFixed(
              2
            ) || getdata.returnCashMoney,
          promotionType: Number(this.radio),
          serviceMoney: isNaN(
            (
              ((this.itemEndPrice || this.getdata.itemEndPrice) *
                this.ruleForm.serviceRate) /
              100
            ).toFixed(2)
          )
            ? null
            : (
                ((this.itemEndPrice || this.getdata.itemEndPrice) *
                  this.ruleForm.serviceRate) /
                100
              ).toFixed(2),
          tkMoney: this.tkMoney || this.getdata.tkMoney,
          descScore: this.descScore || this.getdata.descScore,
          serviceScore: this.serviceScore || this.getdata.serviceScore,
          shipScore: this.shipScore || this.getdata.shipScore,
          returnCashRate: this.ruleForm.returnCashRate,
          returnCashSaleAmount: this.ruleForm.returnCashSaleAmount,
          requiredSaleAmount: this.requiredSaleAmount,
          checkGoodsAmount: this.ruleForm.checkGoodsAmount,
          memoToQdtuanzhang: this.memoToQdtuanzhang,

          serviceRate: this.ruleForm.serviceRate,
          butieHighAmount: this.ruleForm.butieHighAmount,
          yanhuoThreshold: this.ruleForm.yanhuoThreshold,
          butieHighPrice: this.ruleForm.butieHighPrice,
          itemEndPrice: this.itemEndPrice,
          promotionAmount: this.ruleForm.promotionAmount
        })
      }).then(e => {
        if (e.data.code == 0) {
          // this.$toast("提交成功");
          this.$message({
            showClose: true,
            message: "提交成功",
                 type: 'success'
          });
          let time = setTimeout(() => {
            this.$router.push("/wx/product");
            clearTimeout(time);
          }, 1000);
        } else {
          // this.$toast(e.data.msg);
        }
      });
    },
    changeUpload() {
      console.log(
        ((this.itemEndPrice || this.getdata.itemEndPrice) *
          this.ruleForm.serviceRate) /
          100
      );
      console.log(
        this.itemEndPrice || this.getdata.itemEndPrice,
        this.ruleForm.serviceRate
      );
      let time1 = this.ruleForm.time1 + " 00:00:00";
      let time2 = this.ruleForm.time2 + " 23:59:59";

      this.$http({
        url: this.$http.adornUrl("product/save"),
        method: "post",
        data: this.$http.adornData({
          shopName: this.shopName,
          itemTitle: this.itemTitle,
          itemDesc: this.itemDesc,
          couponUrl: this.ruleForm.couponUrl,
          categoryId: this.categoryId || this.getdata.categoryId,
          tkRate: this.ruleForm.tkRate,
          dxUrl: this.ruleForm.dxUrl,
          dxRemark: this.ruleForm.dxRemark,
          dxRate: this.ruleForm.dxRate,
          itemPrice: this.itemPrice || this.getdata.itemPrice,
          couponMoney: this.couponMoney || this.getdata.couponMoney,
          tbUrl: this.ruleForm.bbLink,
          id: this.id || null,
          productId: this.productId,
          shopType: this.shopType,
          itemPic: this.itemPic,
          butieTotalAmount: this.butieTotalAmount,
          stockStartTime: this.ruleForm.time1,
          yanhuoThreshold: this.ruleForm.yanhuoThreshold,
          couponNum: this.couponNum || this.getdata.couponNum,
          couponReceive: this.couponReceive || this.getdata.couponReceive,
          couponSurplus: this.couponSurplus || this.getdata.couponSurplus,
          stockEndTime: this.ruleForm.time2,
          couponEndTime: this.couponEndTime || this.getdata.couponEndTime,
          couponStartTime: this.couponStartTime || this.getdata.couponStartTime,
          returnCashMoney:
            ((this.itemEndPrice * this.ruleForm.returnCashRate) / 100).toFixed(
              2
            ) || getdata.returnCashMoney,
          promotionType: Number(this.radio),
          serviceMoney: isNaN(
            (
              ((this.itemEndPrice || this.getdata.itemEndPrice) *
                this.ruleForm.serviceRate) /
              100
            ).toFixed(2)
          )
            ? null
            : (
                ((this.itemEndPrice || this.getdata.itemEndPrice) *
                  this.ruleForm.serviceRate) /
                100
              ).toFixed(2),
          tkMoney: this.tkMoney || this.getdata.tkMoney,
          descScore: this.descScore || this.getdata.descScore,
          serviceScore: this.serviceScore || this.getdata.serviceScore,
          shipScore: this.shipScore || this.getdata.shipScore,
          returnCashRate: this.ruleForm.returnCashRate,
          returnCashSaleAmount: this.ruleForm.returnCashSaleAmount,
          requiredSaleAmount: this.requiredSaleAmount,
          checkGoodsAmount: this.ruleForm.checkGoodsAmount,
          memoToQdtuanzhang: this.memoToQdtuanzhang,
          serviceRate: this.ruleForm.serviceRate,
          butieHighAmount: this.ruleForm.butieHighAmount,
          butieHighPrice: this.ruleForm.butieHighPrice,
          itemEndPrice: this.itemEndPrice,
          promotionAmount: this.ruleForm.promotionAmount
        })
      }).then(e => {
        if (e.data.code == 0) {
          this.$message({
            showClose: true,
            message: "修改成功",
                 type: 'success'
          });
          let time = setTimeout(() => {
            this.$router.push("/wx/product");
            clearTimeout(time);
          }, 1000);
        }
      });
    },
    confirms() {
      // this.mouseOut2()
      let _this = this;
      if (this.radio == "2") {
        // if (
        //   this.ruleForm.bbLink !== null &&
        //   this.ruleForm.tkRate !== null &&
        //   this.ruleForm.couponUrl !== null &&
        //   this.ruleForm.time2 !== null &&
        //   this.ruleForm.time1 !== null &&
        //   this.ruleForm.dxUrl !== null &&
        //   this.ruleForm.dxRemark !== null &&
        //   this.ruleForm.dxRemark !== null
        // ) {
        //   if (_this.$route.query.type) {
        //     _this.changeUpload();
        //     return;
        //   } else {
        //     _this.saveUpload();
        //     return;
        //   }
        // }
        let args = [];

        this.$refs["ruleForm"].validateField(
          [
            "bbLink",
            "couponUrl",
            "tkRate",
            "time2",
            "time1",
            "dxUrl",
            "dxRemark"
          ],
          function(e) {
            console.log(e);
            args.push(e);
            console.log(args.length);
            if (args.length == 7) {
              var m = args.filter(e => {
                return e !== "";
              });
              if (m.length == 0) {
                if (_this.$route.query.type) {
                  _this.changeUpload();
                  return;
                } else {
                  _this.saveUpload();
                  return;
                }
                return;
              }
            }
          }
        );
      }
      if (this.radio == "3") {
        let _this = this;
        let args = [];
        this.$refs["ruleForm"].validateField(
          [
            "bbLink",
            "couponUrl",
            "tkRate",
            "time2",
            "time1",
            "returnCashRate",
            "returnCashSaleAmount"
          ],
          function(e) {
            console.log(e);
            args.push(e);
            console.log(args.length);
            if (args.length == 7) {
              var m = args.filter(e => {
                return e !== "";
              });
              if (m.length == 0) {
                if (_this.$route.query.type) {
                  _this.changeUpload();
                  return;
                } else {
                  _this.saveUpload();
                  return;
                }
                return;
              }
            }
          }
        );
      }
      if (this.radio == "4") {
        let _this = this;
        // if (
        //   this.ruleForm.bbLink !== null &&
        //   this.ruleForm.tkRate !== null &&
        //   this.ruleForm.couponUrl !== null &&
        //   this.ruleForm.time2 !== null &&
        //   this.ruleForm.time1 !== null &&
        //   this.ruleForm.checkGoodsAmount !== null
        // ) {
        //   if (_this.$route.query.type) {
        //     _this.changeUpload();
        //     return;
        //   } else {
        //     _this.saveUpload();
        //     return;
        //   }
        // }

        let args = [];
        this.$refs["ruleForm"].validateField(
          [
            "bbLink",
            "couponUrl",
            "tkRate",
            "time2",
            "time1",
            "checkGoodsAmount"
          ],
          function(e) {
            console.log(e);
            args.push(e);
            console.log(args.length);
            if (args.length == 6) {
              var m = args.filter(e => {
                return e !== "";
              });
              if (m.length == 0) {
                if (_this.$route.query.type) {
                  _this.changeUpload();
                  return;
                } else {
                  _this.saveUpload();
                  return;
                }
                return;
              }
            }
          }
        );
      }
      if (this.radio == "5") {
        let _this = this;
        // if (
        //   this.ruleForm.bbLink !== null &&
        //   this.ruleForm.tkRate !== null &&
        //   this.ruleForm.couponUrl !== null &&
        //   this.ruleForm.time2 !== null &&
        //   this.ruleForm.time1 !== null &&
        //   this.ruleForm.serviceRate !== null
        // ) {
        //   if (_this.$route.query.type) {
        //     _this.changeUpload();
        //     return;
        //   } else {
        //     _this.saveUpload();
        //     return;
        //   }
        // }

        let args = [];
        this.$refs["ruleForm"].validateField(
          ["bbLink", "couponUrl", "tkRate", "time2", "time1", "serviceRate"],
          function(e) {
            console.log(e);
            args.push(e);
            console.log(args.length);
            if (args.length == 6) {
              var m = args.filter(e => {
                return e !== "";
              });
              if (m.length == 0) {
                if (_this.$route.query.type) {
                  _this.changeUpload();
                  return;
                } else {
                  _this.saveUpload();
                  return;
                }
                return;
              }
            }
          }
        );
      }

      // if (this.$route.query.type) {
      //   this.changeUpload();
      //   return;
      // } else {
      //   this.saveUpload();
      // }
      //提交
      // this.$router.push("product");
    },
    back() {
      this.$router.push("/wx/product");
    }
  }
};
</script>

<style scoped>
.all {
  padding: 60px;
  padding-left: 100px;
  padding-bottom: 120px;
}

.all >>> .el-input {
  max-width: 400px;
}

.all >>> .el-form-item__label {
  width: 140px !important;
}

.all >>> .el-form-item__content {
  margin-left: 140px !important;
}
.all >>> .el-pagination {
  text-align: center;
}

.all >>> .el-form-item__content {
  display: flex !important;
}

.title {
  font-size: 22px;
  font-weight: 550;
  position: relative;
  margin-left: 50px;
  margin-bottom: 30px;
}

.title::after {
  content: "";
  position: absolute;
  left: -8px;
  top: 10%;
  height: 80%;
  width: 6px;
  background-color: #409eff;
}
.el-form-item__content p {
  margin: 0;
}
.all >>> .el-form-item__content {
  align-items: center;
}
.tk_rate {
  width: 160px;
  margin-right: 8px;
}
.switchZ_top{
  display: flex;
}
.switchZ_top p{
  margin-top: 0px;
}
</style>
