<template>
    <div>
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-s-goods"></i> 商品添加
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="container" style="width: 800px;margin-left: 300px" >
        <el-steps :active="active" finish-status="success" align-center class="handle-box">
          <el-step title="填写商品信息"></el-step>
          <el-step title="填写商品属性"></el-step>
          <el-step title="选择商品关联"></el-step>
        </el-steps>

        <div v-show="active==0">
          <el-form :model="productSaveForm" :rules="addProductRules" ref="productSaveForm" label-width="100px">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="productSaveForm.name" width="200px"></el-input>
            </el-form-item>

            <el-form-item label="标题" prop="title">
              <el-input v-model="productSaveForm.title" width="200px"></el-input>
            </el-form-item>


            <el-form-item label="品牌" prop="bandId">
              <el-select v-model="productSaveForm.bandId" placeholder="请选择">
                <el-option
                  v-for="item in axiosBandId"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="商品介绍" prop="productdecs">
              <el-input v-model="productSaveForm.productdecs" type="textarea" maxlength="200"
                        show-word-limit></el-input>
            </el-form-item>

            <el-form-item label="价格" prop="price">
              <el-input-number v-model="productSaveForm.price" :precision="2" :step="0.1"></el-input-number>
            </el-form-item>

            <el-form-item label="库存" prop="stocks">
              <el-input-number v-model="productSaveForm.stocks" :step="10"></el-input-number>
            </el-form-item>

            <el-form-item label="排序" prop="sortNum">
              <el-input-number v-model="productSaveForm.sortNum" :step="1"></el-input-number>
            </el-form-item>


            <!-- 图片插件  -->
            <el-form-item label="主图" prop="imgPath">
              <el-upload
                class="avatar-uploader"
                action="http://localhost:8080/api/band/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                name="image"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>


          </el-form>
          <div slot="footer" class="dialog-footer" align="center">
            <el-button type="primary" @click="active++">下一步,填写商品属性</el-button>
          </div>
        </div>


        <!--第二页-->
        <div v-show="active==1">
            <el-form :model="productAttrSaveForm" ref="productAttrSaveForm" label-width="100px">


            <el-form-item label="属性分类" prop="typeId">
              <el-select v-model="productAttrSaveForm.typeId" @change="typeIdChange" placeholder="请选择">
                <el-option
                  v-for="item in childTypeId"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>


              <el-form-item v-if="SKUData.length>0" label="商品规格">

                <el-form-item v-for="a in  SKUData" :key="a.id" :label="a.name">

                  <el-checkbox-group v-if="a.type==2" v-model="a.ck" @change="ckChange">
                    <el-checkbox v-for="b in a.values" :key="b.id" :label="b.name" name="type">{{b.name}}</el-checkbox>
                  </el-checkbox-group>

                </el-form-item>

              </el-form-item>

              <!--表格=========================-->
              <el-form-item v-if="tableshowFlag" v-model="tableFormDtata">

                <el-table :data="tableSkuData" style="width: 100%">

                  <el-table-column  v-for="c in cols" :key="c.id" :label="c.name" :prop="c.name">
                  </el-table-column>

                  <el-table-column label="库存"  width="180" >
                    <template slot-scope="scope">
                      <el-input  v-model="scope.row.storcks"/>
                    </template>
                  </el-table-column>

                  <el-table-column  label="价格"  width="180">
                    <template slot-scope="scope">
                      <el-input  v-model="scope.row.price"/>
                    </template>
                  </el-table-column>

                </el-table>

              </el-form-item>



              <el-form-item v-if="attData.length>0" label="商品参数" >

                <el-form-item v-for="a in  attData" :key="a.id" :label="a.name">
                  <!--  0 下拉框     1 单选框      2  复选框   3  输入框  -->
                  <el-input v-if="a.type==3" v-model="a.value" ></el-input>

                  <el-select v-if="a.type==0" placeholder="请选择"  v-model="a.value">
                    <el-option v-for="b in a.values" :key="b.id" :label="b.name" :value="b.name"></el-option>
                  </el-select>

                  <el-radio-group  v-if="a.type==1"  v-model="a.value">
                    <el-radio v-for="b in a.values" :key="b.id" :label="b.name" >{{b.name}}</el-radio>
                  </el-radio-group>


                  <el-checkbox-group v-if="a.type==2"  v-model="a.value">

                    <el-checkbox v-for="b in a.values" :key="b.id" :label="b.name">{{b.name}}</el-checkbox>
                  </el-checkbox-group>


                </el-form-item>

              </el-form-item>


          </el-form>









          <div slot="footer" class="dialog-footer" align="center">
            <el-button  @click="active--">上一步,填写商品信息</el-button>
            <el-button   type="success" @click="submitProduct">提交</el-button>
            <el-button type="primary" @click="active++">下一步,填写商品属性</el-button>
          </div>

        </div>

      </div>
    </div>
</template>

<script>
    export default {
        name: "Product",
        data(){
          var productdecsE = (rule, value, callback) => {
            if (/^[\u4e00-\u9fa5]+$/i.test(value)) {
              callback();
            } else {
              callback(new Error('只能输入中文'));
            }
          };


          return {
            /*步骤条*/
            ss:[],
            aa:'',
            bb:1,
            cc:1,
            active:0,
            addProductFormFlag1:true,
            addProductFormFlag2:false,
            /*商品新增*/
            axiosBandId:[],

            productSaveForm:{
              id:null,
              name:"",
              title:"",
              bandId:null,
              productdecs:"",
              price:0,
              stocks:0,
              sortNum:0,
              imgPath:"",
              typeId:null
            },

            imageUrl:"",//图片显示用的


            /*商品信息验证*/
            addProductRules: {
              name: [
                {required: true, message: '请输入属性名称', trigger: 'blur'},
                {min: 3, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}

              ],
              title: [
                {required: true, message: '请输入属性英文文名称', trigger: 'blur'},
                {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}

              ],
              bandId: [
                {required: true, message: '请选择品牌', trigger: 'change'}
              ],
              productdecs: [
                {required: true, message: '请输入属性英文文名称', trigger: 'blur'},
                {validator: productdecsE, trigger: 'blur'}

              ],
              price: [
                {required: true, message: '价格不能为空'},
                {type: 'number', message: '价格必须为数字值'}

              ],
              stocks: [
                {required: true, message: '库存不能为空'},
                {type: 'number', message: '库存必须为数字值'}
              ],
              sortNum: [
                {required: true, message: '排序不能为空'},
                {type: 'number', message: '排序必须为数字值'}

              ],
            },


            tableFormDtata:{
              storcks:0,
              price:0
            },

            /*添加商品属性*/
            axiosTypeId:[],
            childTypeId:[],
            productAttrSaveForm:{
                typeId:null
            },
            tableSkuData:[],
            attData:[],   //非sku的属性数据
            SKUData:[], //sku属性数据
            tableshowFlag:false,
            cols:[]//skutable的动态表头

          }
        },
        created(){
          this.queryBandIdData();
          this.queryTypeIdData();
        },
        methods:{
          submitProduct(){

            this.productSaveForm.typeId=this.productAttrSaveForm.typeId;
            console.log(this.productSaveForm);
            console.log(this.attData);
            //sku数据
            console.log(this.tableSkuData);
            let  atrrs=[];
            for (let i = 0; i < this.attData.length; i++) {
              let attData={};
              attData[this.attData[i].name]=this.attData[i].value;
              atrrs.push(attData);
            }
             debugger;
            this.productSaveForm.attr=JSON.stringify(atrrs);
             this.productSaveForm.sku=JSON.stringify(this.tableSkuData);

             this.$axios.post("http://localhost:8080/api/product/saveProduct",this.$qs.stringify(this.productSaveForm)).then(res=>{
            this.$message.success("添加成功");
          })

          },
          ckChange(){
            this.cols=[];
            let  kdej=[];
            //清空表格数据
            this.tableSkuData=[];
            let flag=true;
            debugger;
            for (let i = 0; i < this.SKUData.length; i++) {
               this.cols.push({"id":this.SKUData[i].id,"name":this.SKUData[i].name,"nameCH":this.SKUData[i].nameCH});
                kdej.push(this.SKUData[i].ck);
               if (this.SKUData[i].ck.length==0){
                flag=false;
                break;
              }
            }

            if (flag==true){
              let datas = this.calcDescartes(kdej);

              for (let i = 0; i < datas.length; i++) {

                let jsonData = {}; //笛卡尔积 转为json的对象

                if (typeof datas[i] == "object") {
                  for (let j = 0; j < datas[i].length; j++) {

                    let key = this.cols[j].name;
                    jsonData[key] = datas[i][j];

                  }
                } else {
                  let key = this.cols[0].name;
                  jsonData[key] = datas[i];
                }

                this.tableSkuData.push(jsonData);

              }
            }

            this.tableshowFlag=flag;


          },
          typeIdChange(typeId) {
            this.tableshowFlag=false;
            this.SKUData = [];
            this.attData = [];
            this.$axios.get('http://localhost:8080/api/product/queryProductData?typeId=' + typeId).then(res => {
              // 所有的属性数据
              let attrDatas = res.data.data;


              //判断分类是否有数据   更新 参数和规格
              if (attrDatas.length > 0) {
                for (let i = 0; i < attrDatas.length; i++) {
                  if (attrDatas[i].isSKU == 0) {

                    if (attrDatas[i].type != 3) {
                      attrDatas[i].value=[];
                      //发起请求 查询此属性对应的选项值
                      this.$axios.get("http://localhost:8080/api/attr/queryAttrValue?attrId=" + attrDatas[i].id).then(res => {
                        attrDatas[i].values = res.data.data;
                        this.attData.push(attrDatas[i]);
                      })
                    } else {
                      this.attData.push(attrDatas[i]);
                    }
                  } else {
                    if (attrDatas[i].type != 3) {
                      //发起请求 查询此属性对应的选项值
                      this.$axios.get("http://localhost:8080/api/attr/queryAttrValue?attrId=" + attrDatas[i].id).then(res => {
                        attrDatas[i].values = res.data.data;
                        attrDatas[i].ck=[];
                        this.SKUData.push(attrDatas[i]);
                      })
                    } else {
                      attrDatas[i].ck=[];
                      this.SKUData.push(attrDatas[i]);
                    }

                  }

                }

              } else {
                this.SKUData = [];
                this.attData = [];
              }


            })
            console.log(this.attData);
          },

          queryTypeIdData(){
            this.$axios.get('http://localhost:8080/api/type/getData').then(data=>{
                this.axiosTypeId=data.data.data;  // 把请求的数据  赋给全局
                this.getChildrenType();

            }).catch(er=>{
              alert('查询异常');
            });
          },



           //得到types的数据      遍历所有ajaxtypedata
          getChildrenType: function () {
            //遍历所有的节点数据
            for (let i = 0; i < this.axiosTypeId.length; i++) {
              let node = this.axiosTypeId[i];
              this.isChildrenNode(node);
            }
          },

          isChildrenNode: function (node) {
            let rs = true; //标示
            for (let i = 0; i < this.axiosTypeId.length; i++) {
              if (node.id == this.axiosTypeId[i].pid) {
                rs = false;
                break;
              }
            }
            if (rs == true) {
              this.childTypeId.push(node);
            }
          },

          queryBandIdData(){
            this.$axios.get('http://localhost:8080/api/band/queryBandAll')
                .then(res=>{
                  this.axiosBandId=res.data.data;
                }).catch(er=>{
                  alert('查询系统异常')
              });
          },


          handleAvatarSuccess(response, file) {
            //打断点 看怎么取返回值
            this.productSaveForm.imgPath = response.filePath;
            //显示赋值
            this.imageUrl = response.filePath;
          },
          beforeAvatarUpload(file) {
            //限制类型    name  来限制
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 4;

            if (!isJPG) {
              this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
              this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
          },

          calcDescartes:function(array) {
              if (array.length < 2) return array[0] || [];
              return [].reduce.call(array, function (col, set) {
                var res = [];
                col.forEach(function (c) {
                  set.forEach(function (s) {
                    var t = [].concat(Array.isArray(c) ? c : [c]);
                    t.push(s);
                    res.push(t);
                  })
                });
                return res;
              });
            }



        }


    }
</script>

<style scoped>


  .handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
