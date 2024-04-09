<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button icon="el-icon-plus" plain size="mini" type="primary" @click="handleAdd(null)"></el-button>
      </el-col>
      <el-col :span="1.5" hidden="hidden">
        <el-button :disabled="multiple" icon="el-icon-delete" plain size="mini" type="danger" @click="handleDelete"></el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" export-table="dataTable" export-table-file-name="工程配置" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table id="dataTable" :data="saleConfigList" :default-expand-all="true" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" row-key="id" stripe>
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
          <el-button v-if="scope.row.isValue === 0" icon="el-icon-plus" plain size="mini" type="text" @click="handleAdd(scope.row)"></el-button>
          <el-button icon="el-icon-delete" plain size="mini" type="text" @click="handleDelete(scope.row)"></el-button>
          <el-button icon="el-icon-edit" plain size="mini" type="text" @click="handleEdit(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="title" :visible.sync="open" append-to-body width="500px">
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
    document["pagePath"] = "/apsProjectConfig";
    this.getList()
  }
  ,
  methods: {
    getList() {
      return queryPageList({pageNum: 1, pageSize: 999})
      .then(t => {
        this.saleConfigList = t.data.dataList;
      })
    },
    renderContent(h, {node, data, store}) {
      return (
          <span class="custom-tree-node">
            <span>{node.saleCode}/ {node.saleName} {data}</span>
            <span>
              <el-button size="mini" type="text" on-click={() => this.append(data)}>Append</el-button>
              <el-button size="mini" type="text" on-click={() => this.remove(node, data)}>Delete</el-button>
            </span>
          </span>);
    },
    handleAdd(row) {
      this.resetForm();
      this.open = true;
      if (row) {
        this.title = "添加工程特征值"
        this.form.isValue = 1
        this.form.parentId = row.id
      } else {
        this.title = "添加工程特征组"
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
    handleEdit(data) {
      this.form = data;
      this.title = "修改销售特征" + (data.isValue == 1 ? "值" : "")
      this.open = true
    }
  }
}
</script>


<style lang="scss" scoped>

</style>
