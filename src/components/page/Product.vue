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

        <div v-show="addProductFormFlag1">
          <el-form :model="productSaveForm" ref="productSaveForm" label-width="100px">
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
              <el-input v-model="productSaveForm.price"></el-input>
            </el-form-item>

            <el-form-item label="库存" prop="stocks">
              <el-input v-model="productSaveForm.stocks"></el-input>
            </el-form-item>

            <el-form-item label="排序" prop="sortNum">
              <el-input v-model="productSaveForm.sortNum"></el-input>
            </el-form-item>


          </el-form>
          <div slot="footer" class="dialog-footer" align="center">
            <el-button type="primary" @click="nextHtml">下一步,填写商品属性</el-button>
          </div>
        </div>


        <!--第二页-->
        <div v-show="addProductFormFlag2">
            <el-form :model="productAttrSaveForm" ref="productAttrSaveForm" label-width="100px">


            <el-form-item label="属性分类" prop="bandId">
              <el-select v-model="productAttrSaveForm.typeId" placeholder="请选择">
                <el-option
                  v-for="item in typeId"
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
              <el-input v-model="productSaveForm.price"></el-input>
            </el-form-item>

            <el-form-item label="库存" prop="stocks">
              <el-input v-model="productSaveForm.stocks"></el-input>
            </el-form-item>

            <el-form-item label="排序" prop="sortNum">
              <el-input v-model="productSaveForm.sortNum"></el-input>
            </el-form-item>


          </el-form>
          <div slot="footer" class="dialog-footer" align="center">
            <el-button type="primary" @click="nextHtml">下一步,填写商品属性</el-button>
          </div>

        </div>

      </div>
    </div>
</template>

<script>
    export default {
        name: "Product",
        data(){
          return {
            /*步骤条*/
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
              sortNum:0
            },

            /*添加商品属性*/
            productAttrSaveForm:{
                typeId:null
            }
          }
        },
        created(){
          this.queryBandIdData();

        },
        methods:{
          nextHtml(){
              this.addProductFormFlag1=false;
              this.addProductFormFlag2=true;
               if (this.active >=3){
                 this.active = 0;
               }else {
                 this.active++;
               }

          },
          queryTypeIdData(){

          },
          queryBandIdData(){
            this.$axios.get('http://localhost:8080/api/band/queryBandAll')
                .then(res=>{
                  debugger;
                  this.axiosBandId=res.data.data;
                }).catch(er=>{
                  alert('查询系统异常')
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
</style>
