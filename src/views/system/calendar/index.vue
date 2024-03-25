<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="日历名称" prop="calendarName">
        <el-input v-model="queryParams.calendarName" placeholder="请输入日历名称" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-link type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-link>
        <el-link icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-link>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-link type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-link>
      </el-col>
      <el-col :span="1.5" hidden="hidden">
        <el-link type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改
        </el-link>
      </el-col>
      <el-col :span="1.5">
        <el-link type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">
          删除
        </el-link>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="calendarNameList" @selection-change="handleSelectionChange">

      <el-table-column label="全选" type="selection" align="center" prop="id" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList"  :key="index" align="center" :prop="item.columnName"
                       :label="item.showName"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="300px">
        <template slot-scope="scope">
          <el-link size="mini" type="success" icon="aBtn el-icon-info aBtn" @click="handleInfoDay(scope.row)">
          </el-link>
          <el-link size="mini" type="primary" icon=" el-icon-setting red aBtn" @click="handleUpdateDay(scope.row)">
          </el-link>
          <el-link size="mini" type="primary" icon="aBtn el-icon-edit aBtn" @click="handleUpdate(scope.row)"></el-link>
          <el-link size="mini" type="danger" plain icon="aBtn el-icon-delete aBtn" @click="handleDelete(scope.row)"></el-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
    />
    <el-dialog :title="title" :visible.sync="openSettingDayInfo" width="900px" append-to-body>
      <el-calendar v-model:value="openSettingDayCalendar" >
        <template  :class="data.day"
            slot="dateCell"
            slot-scope="{date, data}" >
          {{ data.day.split('-').slice(1).join('-') }}
        </template>
      </el-calendar>
    </el-dialog>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="openSettingDay" width="600px" append-to-body>
      <el-form ref="form" :model="openSettingDayForm" :rules="openSettingDayFormRules" label-width="100px">

        <el-form-item label="默认工作日" prop="workYear">
          <el-select  filterable v-model.trim="openSettingDayForm.workYear" filterable placeholder="请选择">
            <el-option v-for="(item,index) in workYearList" :key="item" :label="item" :value="item">{{ item }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="默认工作日" prop="defaultWorkDay">
          <el-checkbox-group v-model.trim="openSettingDayForm.defaultWorkDay">
            <template v-for="(item,index) in weekDays">
              <el-checkbox
                  :key="index+1"
                  :label="index+1"
              >{{ item }}
              </el-checkbox>
            </template>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="增加工作日" prop="workDayList">
          <template v-for="(item,index) in  openSettingDayForm.workDayList">
            <el-date-picker align="right" v-model.trim="item.date" type="daterange"
                            range-separator="至" start-placeholder="开始日期"
                            end-placeholder="结束日期" value-format="yyyy-MM-dd"
                            @change="datePickerChange">
            </el-date-picker>
            <i class="el-icon-plus   i-ad" @click="addWorkDay"></i>
            <i class="el-icon-delete i-ad" @click="deleteWorkDay(index)"></i>
          </template>
        </el-form-item>
        <el-form-item label="增加休息日" prop="noWorkDayList">
          <template v-for="(item,index) in  openSettingDayForm.noWorkDayList">
            <el-date-picker align="right" v-model.trim="item.date" type="daterange"
                            range-separator="至" start-placeholder="开始日期"
                            end-placeholder="结束日期" value-format="yyyy-MM-dd"
                            @change="datePickerChange">
            </el-date-picker>
            <i class="el-icon-plus  i-ad" size="small" @click="addNoWorkDay"></i>
            <i class="el-icon-delete i-ad" @click="deleteNoWorkDay(index)"></i>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSettingForm">确 定</el-button>
        <el-button @click="openSettingDayFormHidden">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">

        <el-form-item label="工厂" prop="factoryId">
          <el-select  filterable v-model="form.factoryId" placeholder="请选择工厂">
            <el-option v-for="item in factoryList" :key="item.id" :label="item.factoryName" :value="item.id"/>
          </el-select>
        </el-form-item>

        <el-form-item label="日历编码" prop="calendarCode">
          <el-input v-model="form.calendarCode" placeholder="请输入日历编码"/>
        </el-form-item>
        <el-form-item label="日历名称" prop="calendarName">
          <el-input v-model="form.calendarName" placeholder="请输入登陆名"/>
        </el-form-item>
        <el-form-item label="状态" prop="calendarDisabled">
          <el-select  filterable v-model="form.calendarDisabled">
            <el-option :value="false" label="启用"></el-option>
            <el-option :value="true" label="禁用"></el-option>
          </el-select>
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
import {getFactoryList} from '@/api/factory'
import {calendarDayById, calendarDayUpdate} from '@/api/calendar'

import {add, deleteByIdList, getById, queryPageList, updateById} from '@/api/common'
// console.info("xxx: ",uc.urlPrefix)
export default {
  name: "calendarName",
  data() {
    return {
      openSettingDayCalendar: new Date(),
      openSettingDayInfo: false,
      workYearList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(val => new Date().getFullYear() + val),
      weekDays: ["一", "二", "三", "四", "五", "六", "天"].map(
          val => "星期" + val
      ),
      openSettingDayForm: {
        defaultWorkDay: ["1", "2", "3", "4", "5"],
        workDayList: [{}],
        noWorkDayList: [{}],
        workYear: new Date().getFullYear() + ""
      },
      pickerOptions: {},
      factoryList: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: false,
      // 总条数
      total: 0,
      openSettingDay: false,
      calendarNameList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        calendarName: undefined,
        createBy: undefined,
        status: undefined
      },
      // 表单参数
      form: {
        remark: "",
        calendarName: "",
        pwd: "",
        id: undefined,
        confirmPwd: undefined,
        calendarDisabled: false
      },
      openSettingDayFormRules: {},
      // 表单校验
      rules: {
        factoryId: [
          {required: true, message: "工厂", trigger: "blur"}
        ],
        calendarName: [
          {required: true, message: "日历名称", trigger: "blur"}
        ],
        calendarCode: [
          {required: true, message: "日历编码不能为空", trigger: "blur"},
          {min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur"}
        ]
      },
      tableHeaderList: [{
        columnName: "id",
        showName: "序号"
      }, {
        columnName: "factoryName",
        showName: "工厂名称"
      }, {
        columnName: "calendarCode",
        showName: "日历编码"
      }, {
        columnName: "calendarName",
        showName: "日历名称"
      }, {
        columnName: "calendarDisabledStr",
        showName: "状态"
      }],
      calendarDayShowMonth:""
    };
  },
  watch: {
    openSettingDayCalendar(nv, ov) {
      let date = new Date(nv);
      let day = date.getFullYear() + "/" + (date.getMonth() + 1);
      if (this.calendarDayShowMonth===day){
        return;
      }
      this.calendarDayShowMonth=day;
      let reqData = {id: this.id, dayYear: date.getFullYear(), dayMonth: (date.getMonth() + 1)};
      document.querySelectorAll('.el-calendar-day').forEach(t => t.style.backgroundColor = '#fff')
      calendarDayById(reqData).then(res => {
        let monthDay = res.data;
        const cellElements = document.querySelectorAll('.el-calendar-day')
        cellElements.forEach(element => {
          const dateStr = element.innerText
          let m = parseInt(dateStr.split("-")[0]);
          if (m !== reqData.dayMonth) {
            return;
          }
          let d = parseInt(dateStr.split("-")[1]);
          if (!monthDay["day" + d]) {
            element.style.backgroundColor = '#FFEBCD'
          }
        })
      });
    }
  },
  created() {
    this.openSettingDayFormReset()
    document["pagePath"] = "/calendar";

    this.getFactoryList().then(() => {
      this.getList();
    });
  },
  methods: {
    getFactoryList() {

      return getFactoryList({pageSize: 3000, pageNum: 1}).then(data => {
        this.factoryList = data.data.dataList;
      });
    },
    /** 查询公告列表 */
    getList() {
      ``
      // this.loading = true;
      queryPageList(this.queryParams).then(response => {
        response = response.data
        // this.tableHeaderList = response.dynamicsFieldList
        this.calendarNameList = response.dataList || [];
        this.total = parseInt(response.total);
        this.loading = false;
        let fm = {}
        this.factoryList.forEach(t => fm[t.id] = t.factoryName);
        this.calendarNameList.forEach(t => t.factoryName = fm[t.factoryId])
        this.calendarNameList.forEach(t => t.calendarDisabledStr = t.calendarDisabled === false ? "启用" : "禁用")
        // this.calendarNameList.forEach(t => t.calendarDisabled = fm[t.calendarDisabled] + "")
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        remark: "",
        calendarCode: "",
        id: undefined,
        calendarName: undefined,
        calendarDisabled: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加日历";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      let req = {idList: [row.id], pageSize: 1, pageNum: 1};
      getById(req).then(response => {
        this.form = response.data.dataList[0]

        this.open = true;
        this.title = "修改日历";
      });

    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateById(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            add(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    handleUpdateDay(row) {
      this.openSettingDayForm.id = row.id;
      this.title = "设置工作日"
      this.openSettingDay = true;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
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
      document.getElementsByClassName("el-message-box")[0].style.width = "520px"
    },
    datePickerChange(values) {
      console.log(this.openSettingDayForm.workDayList)
    },
    addWorkDay(i) {
      this.openSettingDayForm.workDayList.push({})
    },
    addNoWorkDay(i) {
      this.openSettingDayForm.noWorkDayList.push({})
    },
    deleteWorkDay(index) {
      this.openSettingDayForm.workDayList.splice(index, 1)
    },
    deleteNoWorkDay(index) {
      this.openSettingDayForm.noWorkDayList.splice(index, 1)
    },
    openSettingDayFormHidden() {
      this.openSettingDayFormReset()
      this.openSettingDay = false;
    },
    openSettingDayFormReset() {
      this.openSettingDayForm = {
        defaultWorkDay: [1, 2, 3, 4, 5],
        workDayList: [{}],
        noWorkDayList: [{}],
        workYear: new Date().getFullYear()
      }
    },
    submitSettingForm() {
      console.info(this.openSettingDayForm)
      let req = Object.assign({}, this.openSettingDayForm);
      req.id = this.openSettingDayForm.id;
      req.workDayList = this.openSettingDayForm.workDayList.map(t => t.date)
      req.noWorkDayList = this.openSettingDayForm.noWorkDayList.map(t => t.date)
      req.defaultWorkDayList = this.openSettingDayForm.defaultWorkDay;
      // console.info(JSON.stringify(req));
      calendarDayUpdate(req).then(response => {
        this.$modal.msgSuccess("修改成功");
        this.openSettingDay = false;
      });
    }, handleInfoDay(row) {
      this.id = row.id;
      this.openSettingDayCalendar = new Date();
      this.openSettingDayInfo = true;
    }
  }
};
</script>
<style vars>
.i-ad {
  width: 30px;
  text-align: center;
  cursor: pointer;
}
.aBtn {
  padding: 0 5px;
  text-decoration-line: none;
}
</style>
