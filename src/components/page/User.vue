<template>
    <div>
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-s-goods"></i> 用户表格
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!--表格-->
      <div class="container">
            <!--<div class="handle-box">
                <el-button type="success" icon="el-icon-plus" @click="roleEdit">新增</el-button>
            </div>-->
            <el-table
                :data="tableData"
                border
                class="table"
                ref="userTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="id" label="序号" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="用户名" align="center"></el-table-column>
                <el-table-column prop="realName" label="真实名称" align="center"></el-table-column>
                <el-table-column prop="sex" label="性别" align="center"></el-table-column>
                <el-table-column prop="phone" label="手机号码" align="center"></el-table-column>
                <el-table-column prop="email" label="电子邮箱" align="center"></el-table-column>
                <el-table-column prop="idCard" label="身份证号" align="center"></el-table-column>
                <el-table-column prop="birthday" label="出生日期" align="center"></el-table-column>
                <el-table-column prop="imgUrl" label="图片" align="center"></el-table-column>
                <el-table-column prop="eduId" label="学历" align="center"></el-table-column>
                <el-table-column prop="deptId" label="部门" align="center"></el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                      <!--<el-button type="text" icon="el-icon-edit"
                                 @click="roleEdit(scope.$index, scope.row)">编辑
                      </el-button>
                      <el-button type="text" icon="el-icon-delete" class="red"
                                 @click="roleDelete(scope.$index, scope.row)">删除
                      </el-button>-->
                      <el-button type="text"
                                 @click="grantRole(scope.$index, scope.row)">赋角色
                      </el-button>
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



      <div id="grantRoleDiv">
          <el-dialog title="角色信息"   :visible.sync="showRoleFlag" width="30%">
            <el-form v-model="userRoleForm"  label-width="80px">


              <el-form-item label="角色" prop="role">
                <el-checkbox-group v-model="userRoleForm.rids" >
                  <el-checkbox v-for="menu in axData" :key="menu.id" :label="menu.id">{{menu.name}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="saveUserRole">确 定</el-button>
            </div>
          </el-dialog>
        </div>

    </div>
</template>

<script>
  const defaulRoleForm = {
              uid:null,
              rids:[]
    };
    export default {
        name: "User",
        data(){
          return {
            query:{
              currentPage:1,
              pageSize:5
            },
            totalPage:0,
            pageSizes:[2,3,5],
            tableData:[],

            axData:[],
            showRoleFlag:false,
            userRoleForm:Object.assign({},defaulRoleForm),
          }
        },
        async created(){
          await this.queryUserData();
          await this.queryRole();
        },
        methods:{
          async saveUserRole(){
            let res =await this.$axios.post('http://localhost:8080/api/user/saveUserRole?uid='+this.userRoleForm.uid+"&rids="+this.userRoleForm.rids.toString());
              this.userRoleForm=Object.assign({},defaulRoleForm);
              this.showRoleFlag=false;
              alert("成功");
          },
          async queryRole(){
             let res = await this.$axios.get('http://localhost:8080/api/role/queryRoleAll');
             this.axData=res.data.data;  // 把请求的数据  赋给全局
          },
          async grantRole(index,row){
              this.showRoleFlag=true;
               this.userRoleForm.uid=row.id;

               let res =await this.$axios.get('http://localhost:8080/api/user/echoUserRole?uid='+row.id);
               this.userRoleForm.rids=res.data.data;


          },
          async queryUserData(){
            let res=await this.$axios.post('http://localhost:8080/api/user/queryUser',this.$qs.stringify(this.query));
                this.tableData=res.data.data.data;
                  this.totalPage=res.data.data.totalPage;
          },
          pageChange: function (currentPage) {
            this.query.currentPage = currentPage;
            this.queryUserData();
          },
          sizeChange: function (pageSize) {
            this.query.pageSize = pageSize;
            this.queryUserData();
          }
        }
    }
</script>

<style scoped>

</style>
