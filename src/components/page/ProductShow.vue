<template>
    <div>
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-s-goods"></i> 商品展示
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="container">
        <div class="handle-box">
          <el-input  placeholder="商品名名称" class="handle-input mr10"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="queryProductTable">搜索</el-button>
          <el-button type="success" icon="el-icon-plus" @click="editProductData">新增</el-button>
        </div>

        <el-table
                :data="productShowTable"
                border
                class="table"
                ref="productShowTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="id" label="序号" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
                <el-table-column prop="title" label="标题" align="center"></el-table-column>
                <el-table-column prop="bandId" label="品牌" :formatter="bandFUN" align="center"></el-table-column>
                <el-table-column prop="typeId" label="分类" :formatter="typeFUN" align="center"></el-table-column>
                <el-table-column prop="productdecs" label="商品描述" align="center"></el-table-column>
                <el-table-column prop="price" label="价格" align="center"></el-table-column>

                <el-table-column prop="imgpath" label="Log(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.imgpath"
                            :preview-src-list="[scope.row.imgpath]"
                        ></el-image>
                    </template>
                </el-table-column>

                <el-table-column prop="stocks" label="库存" align="center"></el-table-column>
                <el-table-column prop="sortNum" label="排序" align="center"></el-table-column>





                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button  type="text" icon="el-icon-edit"
                            @click="editProductData(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                            @click="delProduct(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total,sizes,prev,pager,next,jumper"
                    :current-page="params.currentPage"
                    :page-size="params.pageSize"
                    :page-sizes="pageSizes"
                    :total="totalPage"
                    @size-change="sizeChange"
                    @current-change="pageChange"
                ></el-pagination>
            </div>


      </div>



      <!--商品新增-->
      <div id="saveproductDataDiv">
        <el-dialog title="商品新增"  :visible.sync="saveProductFormFlag" width="30%">

          <el-form :model="productSaveForm"  ref="productSaveForm" label-width="100px">
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

            <el-form-item label="属性分类" prop="typeId">
              <el-select v-model="productSaveForm.typeId"  placeholder="请选择">
                <el-option
                  v-for="item in childTypeId"
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
            <el-button @click="saveProductFormFlag = false">取 消</el-button>
            <el-button type="primary" @click="saveValueData">确 定</el-button>
          </div>

        </el-dialog>
      </div>

    </div>
</template>

<script>

  const defaultproductSaveForm = {
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
        };

  export default {
    name: "ProductShow",
    data() {
      return {
        /*查询*/
        params: {
          name: "",
          currentPage: 1,
          pageSize: 5
        },
        totalPage: 0,
        pageSizes: [2, 3, 5],

        /*关联数据*/
        axiosBandId:[],
        axiosTypeData:[],
        childTypeId:[],
        productShowTable: [],

        /*新增*/
        saveProductFormFlag:false,
        productSaveForm:Object.assign({},defaultproductSaveForm),

        imageUrl:"",//图片显示用的


      }
    },
    created() {
      this.queryProductTable();
      this.queryBandIdData();
      this.queryTypeData();
    },
    methods: {

      delProduct(index,row){
        /*this.$axios.post('http://localhost:8080/api/product/updateProduct',params).then(data => {
          debugger;
          this.saveProductFormFlag=false;
          this.queryProductTable();
        }).catch(er => {
          alert('删除商品异常');
        });*/
      },
      saveValueData(){
        let params=this.$qs.stringify(this.productSaveForm);
        this.$axios.post('http://localhost:8080/api/product/updateProduct',params).then(data => {
          debugger;
          this.saveProductFormFlag=false;
          this.queryProductTable();
        }).catch(er => {
          alert('保存商品异常');
        });
      },
      editProductData(index,row){
        this.saveProductFormFlag=true;
        if (row==null){
          this.productSaveForm=Object.assign({},defaultproductSaveForm);
        }else {
          this.$axios.get('http://localhost:8080/api/product/echoProduct?id='+row.id).then(data => {
          debugger;
          this.productSaveForm = data.data.data;  // 把请求的数据  赋给全局

        }).catch(er => {
          alert('回显商品异常');
        });
        }




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

      typeFUN(row,column,cell,index){
          for (let i = 0; i < this.axiosTypeData.length; i++) {
            if (cell==this.axiosTypeData[i].id){
              return this.axiosTypeData[i].name;
            }
        }
      },
      queryTypeData() {
        this.$axios.get('http://localhost:8080/api/type/getData').then(data => {
          this.axiosTypeData = data.data.data;  // 把请求的数据  赋给全局
          this.getChildrenType();
        }).catch(er => {
          alert('查询分类异常');
        });
      },
      //得到types的数据      遍历所有ajaxtypedata
      getChildrenType: function () {
        //遍历所有的节点数据
        for (let i = 0; i < this.axiosTypeData.length; i++) {
          let node = this.axiosTypeData[i];
          this.isChildrenNode(node);
        }
      },

      isChildrenNode: function (node) {
        let rs = true; //标示
        for (let i = 0; i < this.axiosTypeData.length; i++) {
          if (node.id == this.axiosTypeData[i].pid) {
            rs = false;
            break;
          }
        }
        if (rs == true) {
          this.childTypeId.push(node);
        }
      },
      bandFUN(row,column,cell,index){

        for (let i = 0; i < this.axiosBandId.length; i++) {
            if (cell==this.axiosBandId[i].id){
              return this.axiosBandId[i].name;
            }
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
      queryProductTable() {

        this.$axios.post('http://localhost:8080/api/product/queryProduct', this.$qs.stringify(this.params)).then(res => {
          this.productShowTable = res.data.data.data;
          this.totalPage=res.data.data.totalPage;
        }).catch(er => {
          alert('查询异常')
        });
      },
      pageChange: function (currentPage) {
        this.params.currentPage = currentPage;
        this.queryProductTable();
      },
      sizeChange: function (pageSize) {
        this.params.pageSize = pageSize;
        this.queryProductTable();
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
