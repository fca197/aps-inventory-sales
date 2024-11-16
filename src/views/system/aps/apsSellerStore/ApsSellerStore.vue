<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="128px" size="small">
      <el-form-item label="销售门店编码" prop="sellerStoreCode">
        <el-input v-model="queryParams.data.sellerStoreCode" clearable placeholder="请输入销售门店"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="销售门店名称" prop="sellerStoreName">
        <el-input v-model="queryParams.data.sellerStoreName" clearable placeholder="请输入销售门店名称"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="销售门店手机号" prop="sellerStorePhone">
        <el-input v-model="queryParams.data.sellerStorePhone" clearable placeholder="请输入销售门店手机号"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="销售门店省" prop="sellerStoreProvinceCode">
        <el-select clearable filterable v-model="queryParams.data.sellerStoreProvinceCode" @change="value=>changeRegCode(value,'p')">
          <el-option v-for="(p,i) in provinceCodeList" :label="p.name" :value="p.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="销售门店市" prop="sellerStoreCityCode">
        <el-select clearable filterable v-model="queryParams.data.sellerStoreCityCode" @change="value=>changeRegCode(value,'c')" >
          <el-option v-for="(p,i) in cityCodeList" :label="p.name" :value="p.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="销售门店区" prop="sellerStoreAreaCode">
        <el-select clearable filterable v-model="queryParams.data.sellerStoreAreaCode"  @change="value=>changeRegCode(value,'a')" >
          <el-option v-for="(p,i) in areaCodeList" :label="p.name" :value="p.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="销售门店地址" prop="sellerStoreAddr">
        <el-input v-model="queryParams.data.sellerStoreAddr" clearable placeholder="请输入销售门店地址"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button icon="el-icon-plus" plain size="mini" type="primary" @click="handleAdd"></el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button :disabled="multiple" icon="el-icon-delete" plain size="mini" type="danger"
                   @click="handleDelete"
        ></el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="apsSellerStoreList" @selection-change="handleSelectionChange">
      <el-table-column align="center" label="全选" prop="id" type="selection" width="50"/>
      <el-table-column v-for="(item,index) in  tableHeaderList" :key="index" :label="item.showName"
                       :prop="item.fieldName" align="center" :width="item.width+'px'"
      />
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="text" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button icon="el-icon-delete" size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.pageNum"
      :total="total"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="700px">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">

        <el-form-item label="销售门店编码" prop="sellerStoreCode">
          <el-input v-model="form.sellerStoreCode" clearable placeholder="请输入销售门店"/>
        </el-form-item>
        <el-form-item label="销售门店名称" prop="sellerStoreName">
          <el-input v-model="form.sellerStoreName" clearable placeholder="请输入销售门店名称"/>
        </el-form-item>
        <el-form-item label="销售门店手机号" prop="sellerStorePhone">
          <el-input v-model="form.sellerStorePhone" clearable placeholder="请输入销售门店手机号"/>
        </el-form-item>
        <el-form-item label="销售门店省" prop="sellerStoreProvinceCode">
          <el-select clearable filterable v-model="form.sellerStoreProvinceCode">
            <el-option v-for="(p,i) in provinceCodeList" :label="p.name" :value="p.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售门店市" prop="sellerStoreCityCode">
          <el-select clearable filterable v-model="form.sellerStoreCityCode">
            <el-option v-for="(p,i) in cityCodeList" :label="p.name" :value="p.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售门店区" prop="sellerStoreAreaCode">
          <el-select clearable filterable v-model="form.sellerStoreAreaCode">
            <el-option v-for="(p,i) in areaCodeList" :label="p.name" :value="p.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="位置筛选">
          <el-input id="sellerStoreAddrInput" v-model="form.sellerStoreAddrInput" :placeholder="form.sellerStoreAddr"></el-input>
          <div id="sellerStoreAddrInputDiv"></div>
        </el-form-item>
        <el-form-item label="销售门店地址" prop="sellerStoreAddr">
          <el-input v-model="form.sellerStoreAddr" clearable placeholder="请输入销售门店地址"/>
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

import { add, deleteByIdList, getById, getDistrictByParentCode, log, queryPageList, updateById } from '@/api/common'
import { addGdMap, getLocationByLanLon, initGdMap } from '@/api/gaoDe'

export default {
  name: 'tenantName',
  data() {

    return {
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
      apsSellerStoreList: [],
      provinceCodeList: [],
      cityCodeList: [],
      areaCodeList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      loadDistrict: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        data: {}
      },
      // 表单参数
      form: {
        sellerStoreCode: undefined,
        sellerStoreName: undefined,
        sellerStorePhone: undefined,
        sellerStoreProvinceCode: undefined,
        sellerStoreCityCode: undefined,
        sellerStoreAreaCode: undefined,
        sellerStoreAddr: undefined,
        sellerStoreAddrInput: undefined,
        sellerStoreGdLon: undefined,
        sellerStoreGdLat: undefined,
        id: undefined
      },
      // 表单校验
      rules: {},
      tableHeaderList: [],
      mapMark: undefined,
      districtSearch: undefined,
      gdMap: undefined,
      placeSearch: undefined
    }
  },
  watch: {

    'form.sellerStoreAddrInput'(n, o) {
      log(this.placeSearch)
      if (this.placeSearch) {
        this.placeSearch.setCity(this.form.sellerStoreCityCode)
        this.placeSearch.search(n)
      }
    }
  },
  beforeCreate() {
    document['pagePath'] = '/apsSellerStore'
    addGdMap()
  },
  created() {

    this.getList()
    this.getDistrict('0', this.provinceCodeList)
  },
  mounted() {

  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true
      queryPageList(this.queryParams).then(response => {
        response = response.data
        this.tableHeaderList = response.headerList
        this.apsSellerStoreList = response.dataList
        this.total = parseInt(response.total)
        this.loading = false
      })

    },
    cancel() {
      this.open = false
      this.reset()
    },
    changeRegCode(n, type) {
      if ('p' === type) {
        this.getDistrict(n, this.cityCodeList)
        this.form.sellerStoreCityCode = ''
        this.form.sellerStoreAreaCode = ''
        this.resetMapCenter('province', n)
      } else if ('c' === type) {
        this.getDistrict(n, this.areaCodeList)
        this.form.sellerStoreAreaCode = ''
        // log("tm",n)
        this.resetMapCenter('city', n)
      } else if ('a' === type) {
        this.resetMapCenter('district', n)
      }
    },
    // 表单重置
    reset() {
      let fid = this.form.id
      this.form = {
        sellerStoreCode: undefined,
        sellerStoreName: undefined,
        sellerStorePhone: undefined,
        sellerStoreProvinceCode: undefined,
        sellerStoreCityCode: undefined,
        sellerStoreAreaCode: undefined,
        sellerStoreAddr: undefined,
        sellerStoreGdLon: undefined,
        sellerStoreGdLat: undefined,
        id: fid
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.title = '添加销售门店'
      this.open = true
      this.loadGdMap()

    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      let req = { idList: [row.id], pageSize: 1, pageNum: 1 }
      let _t = this
      _t.loadDistrict = false
      getById(req).then(response => {
        let data = response.data.dataList[0]
        Promise.all([_t.getDistrict(data.sellerStoreProvinceCode, _t.cityCodeList),
          _t.getDistrict(data.sellerStoreCityCode, _t.areaCodeList)]
        )
        .then(tt => {
          _t.open = true
          _t.form = data
          _t.$nextTick(() => {
            let gdMapId='sellerStoreAddrInputDiv';
            initGdMap(_t,gdMapId ,()=>{
              _t.gdMap.setCenter([parseFloat(data.sellerStoreGdLon),parseFloat(data.sellerStoreGdLat)])
              _t.mapMark = new AMap.Marker({
                icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
                position: [parseFloat(data.sellerStoreGdLon),parseFloat(data.sellerStoreGdLat)],
                offset: new AMap.Pixel(-13, -30)
              })
              _t.mapMark.setMap(_t.gdMap)
            });
            _t.loadDistrict = true
          })
        })
      })
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateById(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            add(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const idList = row.id ? [row.id] : this.ids
      this.$modal.confirm('是否确认删序号为 <span style="color:red">' + idList + '</span> 的数据项？', '删除提示').then(function() {
        let req = {
          idList: idList
        }
        return deleteByIdList(req)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      })
      document.getElementsByClassName('el-message-box')[0].style.width = '520px'
    },

    getDistrict(parentCode, list) {
      log('getDistrict ', parentCode, list)
      if (parentCode === '' || parentCode === undefined) {
        list.splice(0, list.length)
        return Promise.reject()
      }
      return getDistrictByParentCode(parentCode).then(t => {
        list.splice(0, list.length)
        t.data.dataList.forEach(tt => list.push(tt))
        log('getDistrict ', parentCode, list)
      })
    },
    resetMapCenter(level, code) {
      console.info('resetMapCenter', level, code)
      if (code) {
        let _t = this
        this.districtSearch.setLevel(level)
        this.districtSearch.search(code, function(status, result) {
          log('districtSearch', code, status, result.districtList[0].center)
          _t.gdMap.setCenter(result.districtList[0].center)
        })
      }
    },
    loadGdMap() {
      let _t = this
      let gdMapId='sellerStoreAddrInputDiv';
      initGdMap(_t,gdMapId );
    }
  }

}


</script>
<style>
html, body {
  margin: 0;
  height: 100%;
  width: 100%;
  position: absolute;
}

#sellerStoreAddrInputDiv {
  margin-top: 3px;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 300px;
}

.button-group {
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 12px;
  padding: 10px;
}

.button-group .button {
  height: 28px;
  line-height: 28px;
  background-color: #0D9BF2;
  color: #FFF;
  border: 0;
  outline: none;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 3px;
  margin-bottom: 4px;
  cursor: pointer;
}

.button-group .inputtext {
  height: 26px;
  line-height: 26px;
  border: 1px;
  outline: none;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 3px;
  margin-bottom: 4px;
  cursor: pointer;
}

/*
.tip {
 position: absolute;
 bottom: 30px;
 right: 10px;
 background-color: #FFF;
 text-align: center;
 border: 1px solid #ccc;
 line-height: 30px;
 border-radius: 3px;
 padding: 0 5px;
 font-size: 12px;
}
*/
#tip {
  background-color: #fff;
  padding-left: 10px;
  padding-right: 10px;
  position: absolute;
  font-size: 12px;
  right: 10px;
  top: 20px;
  border-radius: 3px;
  border: 1px solid #ccc;
  line-height: 30px;
}

/*
#tip input[type='button'] {
	margin-top: 10px;
	margin-bottom: 10px;
	background-color: #0D9BF2;
	height: 30px;
	text-align: center;
	line-height: 30px;
	color: #fff;
	font-size: 12px;
	border-radius: 3px;
	outline: none;
	border: 0;
}
*/
.amap-info-content {
  font-size: 12px;
}

#myPageTop {
  position: absolute;
  top: 5px;
  right: 10px;
  background: #fff none repeat scroll 0 0;
  border: 1px solid #ccc;
  margin: 10px auto;
  padding: 6px;
  font-family: "Microsoft Yahei", "微软雅黑", "Pinghei";
  font-size: 14px;
}

#myPageTop label {
  margin: 0 20px 0 0;
  color: #666666;
  font-weight: normal;
}

#myPageTop input {
  width: 170px;
}

#myPageTop .column2 {
  padding-left: 25px;
}
</style>

