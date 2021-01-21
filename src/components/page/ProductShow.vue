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
          <el-button type="primary" icon="el-icon-search">搜索</el-button>
          <!--<el-button type="success" icon="el-icon-plus" @click="addFormFlag=true">新增</el-button>-->
        </div>

        <!--<el-table
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
                <el-table-column prop="bandE" label="首字母" align="center"></el-table-column>


                <el-table-column prop="imgpath" label="Log(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.imgpath"
                            :preview-src-list="[scope.row.imgpath]"
                        ></el-image>
                    </template>
                </el-table-column>

              <el-table-column prop="bandDesc" label="描述" align="center"></el-table-column>
                <el-table-column prop="ord" label="排序" align="center"></el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button  type="text" icon="el-icon-edit"
                            @click="bandEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                            @click="bandDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>-->



      </div>

    </div>
</template>

<script>
    export default {
        name: "ProductShow"
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

