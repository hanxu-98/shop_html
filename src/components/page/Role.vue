<template>
    <div>
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-s-goods"></i> 基础表格
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>


      <!--表格-->
      <div class="container">
            <div class="handle-box">
                <el-button type="success" icon="el-icon-plus" @click="roleEdit">新增</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="bandTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="id" label="序号" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="角色名" align="center"></el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                      <el-button  type="text" icon="el-icon-edit"
                            @click="roleEdit(scope.$index, scope.row)">编辑</el-button>
                          <el-button type="text" icon="el-icon-delete" class="red"
                            @click="roleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total,sizes,prev,pager,next,jumper"
                    :current-page="query.currentPage"
                    :page-size="query.pageSize"
                    :page-sizes="pageSizes"
                    :total="totalPage"
                    @size-change="sizeChange"
                    @current-change="pageChange"
                ></el-pagination>
            </div>
        </div>



      <!--新增-->
      <div id="saveDataDiv">
          <el-dialog title="角色信息"   :visible.sync="showFormFlag" width="30%">

            <el-form :model="saveForm" ref="saveForm"   label-width="80px">
              <el-form-item label="角色名称" prop="name">
                <el-input v-model="saveForm.name"  width="200px"></el-input>
              </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="showFormFlag = false">取 消</el-button>
              <el-button type="primary" @click="saveData">确 定</el-button>
            </div>
          </el-dialog>
        </div>


    </div>
</template>

<script>
    const defaulForm = {
              id:null,
              name:''
    };
    export default {
        name: "Role",
        data(){
          return {
            query:{
              name:"",
              currentPage:1,
              pageSize:5
            },
            totalPage:0,
            pageSizes:[2,3,5],
            tableData:[],

            saveForm:Object.assign({},defaulForm),
            showFormFlag:false
          }
        },
        async created(){
          await this.queryRole();
        },
        methods:{
          roleDelete(index,row){
              this.$axios.delete('http://localhost:8080/api/role/delRole?id='+row.id).then(data=>{
                  alert('删除成功');
                this.queryRole();
                }).catch(er=>{
                  alert("删除异常");
                });
            },


          async saveData(){
            let res=await this.$axios.post('http://localhost:8080/api/role/saveRoleData',this.$qs.stringify(this.saveForm));
              alert("success")
            this.showFormFlag=false;
              this.queryRole();
            },
          roleEdit(index,row){

                this.showFormFlag=true;
                if (row!=null){
                   this.saveForm=row;
                } else {
                  this.saveForm=Object.assign({},defaulForm);
                }


          },

          async queryRole(){
              let res=await this.$axios.post('http://localhost:8080/api/role/queryData',this.$qs.stringify(this.query));
                this.tableData=res.data.data.data;
                  this.totalPage=res.data.data.totalPage;
          },
          pageChange: function (currentPage) {
            this.query.currentPage = currentPage;
            this.queryRole();
          },
          sizeChange: function (pageSize) {
            this.query.pageSize = pageSize;
            this.queryRole();
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
