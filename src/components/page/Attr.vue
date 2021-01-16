<template>
    <div>
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-s-goods"></i> 属性表格
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>


      <div class="container">
        <div class="handle-box">
          <!--<el-button
              type="primary"
              icon="el-icon-delete"
              class="handle-del mr10"
              @click="delAllSelection"
          >批量删除</el-button>-->
          <el-input v-model="seachForm.name" placeholder="属性名" class="handle-input mr10"></el-input>
          <el-button type="primary" icon="el-icon-search">搜索</el-button>
          <el-button type="success" icon="el-icon-plus" @click="addFormFlag=true">新增</el-button>
        </div>
        <el-table
          :data="tableData"
          border
          class="table"
          ref="bandTable"
          header-cell-class-name="table-header"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="id" label="序号" width="55" align="center"></el-table-column>
          <el-table-column prop="name" label="品牌名" align="center"></el-table-column>
          <el-table-column prop="nameCH" label="首字母" align="center"></el-table-column>
          <el-table-column prop="typeId" label="分类" align="center"></el-table-column>
          <el-table-column prop="type" label="类型" align="center"></el-table-column>
          <el-table-column prop="isSKU" label="是否SKU" align="center"></el-table-column>


          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <!--<el-button type="text" icon="el-icon-edit"
                         @click="bandEdit(scope.$index, scope.row)">编辑
              </el-button>-->
              <el-button type="text" icon="el-icon-delete" class="red"
                         @click="delData(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            layout="total,sizes,prev,pager,next,jumper"
            :current-page="seachForm.currentPage"
            :page-size="seachForm.pageSize"
            :page-sizes="pageSizes"
            :total="totalPage"
            @size-change="sizeChange"
            @current-change="pageChange"
          ></el-pagination>
        </div>
      </div>


      <!--新增模板-->


    </div>
</template>

<script>
    export default {
        name: "Attr",
        data(){
          return {
            /*查询*/
            seachForm:{
              name:"",
              currentPage:1,
              pageSize:5
            },
            totalPage:0,
            pageSizes:[2,3,5],
            /*表格*/
            tableData:[],

            /*新增*/
            addFormFlag:false
          }
        },
        created(){
          this.queryData();
        },
        methods:{
          queryData(){
            let params=this.$qs.stringify(this.seachForm);
            this.$axios.post('http://localhost:8080/api/attr/queryAttr',params).then(res=>{
              debugger;
                this.tableData=res.data.data.data;
                this.totalPage=res.data.data.totalPage;
            }).catch(er=>{
              alert("查询系统异常")
            });
          },

          delData(index,row){
            this.$axios.delete('http://localhost:8080/api/attr/delAttr?id='+row.id).then(data=>{
                  alert('删除成功');
                this.queryData();
                }).catch(er=>{
                  alert("删除异常");
                });
          },
          // 多选操作
          handleSelectionChange(val) {
            this.multipleSelection = val;
          },
          pageChange: function (currentPage) {
            this.seachForm.currentPage = currentPage;
            this.queryData();
          },
          sizeChange: function (pageSize) {
            this.seachForm.pageSize = pageSize;
            this.queryData();
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
