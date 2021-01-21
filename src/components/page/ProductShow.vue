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
          <el-button type="success" icon="el-icon-plus" @click="toSaveHTML">新增</el-button>
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
                        <!--<el-button  type="text" icon="el-icon-edit"
                            @click="bandEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                            @click="bandDelete(scope.$index, scope.row)">删除</el-button>-->
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

    </div>
</template>

<script>
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
        productShowTable: []
      }
    },
    created() {
      this.queryProductTable();
      this.queryBandIdData();
      this.queryTypeData();
    },
    methods: {
      toSaveHTML(){

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
        }).catch(er => {
          alert('查询分类异常');
        });
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
</style>

