<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd(null)"></el-button>
      </el-col>
      <el-col :span="1.5" hidden="hidden">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"></el-button>
      </el-col>
      <right-toolbar export-table="dataTable" export-table-file-name="销售配置" :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table :default-expand-all="true" id="dataTable" :data="saleConfigList" stripe row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column label="序号" prop="id"/>
      <el-table-column label="组编码" prop="saleCode">
        <template slot-scope="scope">
          <span v-if="scope.row.isValue !== 1">{{ scope.row.saleCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="值编码" prop="saleCode">
        <template slot-scope="scope">
          <span v-if="scope.row.isValue === 1">{{ scope.row.saleCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组名称" prop="saleName">
        <template slot-scope="scope">
          <span v-if="scope.row.isValue !== 1">{{ scope.row.saleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="值名称" prop="saleName">
        <template slot-scope="scope">
          <span v-if="scope.row.isValue === 1">{{ scope.row.saleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组/值">
        <template slot-scope="scope">
          <span v-if="scope.row.isValue === 1">值</span>
          <span v-else>组</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isValue === 0" type="text" plain icon="el-icon-plus" size="mini" @click="handleAdd(scope.row)"></el-button>
          <el-button type="text" plain icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)"></el-button>
          <el-button type="text" plain icon="el-icon-edit" size="mini" @click="handleEdit(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="组编码" prop="saleCode">
          <el-input v-model="form.saleCode" placeholder="请输入组编码"/>
        </el-form-item>
        <el-form-item label="组名称" prop="saleName">
          <el-input v-model="form.saleName" placeholder="请输入组名称"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {add, deleteByIdList, queryPageList, updateById} from '@/api/common'

export default {
  name: "index",
  data() {
    return {
      parentData: null,
      title: "",
      open: false,
      multiple: false,
      form: {
        saleCode: "",
        saleName: "",
        isValue: 0
      },
      initForm: {
        saleCode: "",
        saleName: "",
        isValue: 0
      },
      showSearch: false,
      id: 1,
      saleConfigList: [],
      rules: []
    }
  },
  created() {
    document["pagePath"] = "/apsSaleConfig";
    this.getList()
  }
  ,
  methods: {
    getList() {
      return queryPageList({pageNum: 1, pageSize: 999})
      .then(t => {
        this.saleConfigList =  t.data.dataList;
      })
    },

    handleAdd(row) {
      this.resetForm();
      this.open = true;
      if (row) {
        this.title = "添加销售值"
        this.form.id=undefined;
        this.form.isValue = 1
        this.form.parentId = row.id
      } else {
        this.title = "添加销售组"
        this.form.isValue = 0
        this.form.parentId = "0"
      }
    },

    resetForm() {
      this.form = {...this.initForm};
    },
    cancel() {
      this.resetForm();
      this.open = false;
    }, submitForm() {
      if (this.form.id === undefined) {
        add(this.form).then(t => {
          this.$message.success("增加成功")
          this.getList()
          this.open = false;
        })
      } else {
        updateById(this.form).then(t => {
          this.$message.success("修改成功")
          this.getList()
          this.open = false;
        })
      }
    }, handleDelete(row) {
      const idList = row.id ? [row.id] : this.ids
      this.$modal.confirm('是否确认删序号为 <span style="color:red">' + idList + '</span> 的数据项？', "删除提示").then(function () {
        let req = {
          idList: idList
        }
        return deleteByIdList(req);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      });
    },
    handleEdit(data){
      this.form=data;
      this.title="修改销售特征"+(data.isValue==1?"值":"")
      this.open=true
    }
  }
}
</script>


<style scoped lang="scss">

</style>
