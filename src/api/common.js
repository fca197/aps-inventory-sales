import request from '@/utils/request'
import * as ElementUI from 'element-ui'
import { Message, MessageBox } from 'element-ui'

export function add(data, options) {
  const urlPrefix = getPathPrefix()
  return request({
    url: urlPrefix + '/insert',
    'method': 'POST',
    data: data
  })
}

export function post(url, data, showMsg) {
  return request({
    url: url,
    'method': 'POST',
    data: data
  }).then(res => {
    if (showMsg === undefined || showMsg === true) {
      if (res.code === 200) {
        ElementUI.Message({
          message: '成功',
          type: 'success'
        })
      } else {
        ElementUI.Message({
          message: res.msg,
          type: 'error'
        })
      }
    }
    return res
  })
}

export function queryPageList(data) {
  const urlPrefix = getPathPrefix()
  return request({
    url: urlPrefix + '/queryPageList',
    'method': 'POST',
    data: data
  })
}

export function queryUrlPageList(url, data) {
  return request({
    url: url + '/queryPageList',
    'method': 'POST',
    data: data
  })
}

export function queryUrlNoPageList(url) {
  return request({
    url: url + '/queryPageList',
    'method': 'POST',
    data: {
      queryPage: false
    }
  })
}

export function updateById(data) {
  const urlPrefix = getPathPrefix()
  return request({
    url: urlPrefix + '/updateById',
    'method': 'POST',
    data: data
  })
}

export function insetOrUpdate(_t) {

  _t.$refs['form'].validate(valid => {
    if (valid) {
      if (_t.form.id !== undefined) {
        updateById(_t.form).then(response => {
          _t.$modal.msgSuccess('修改成功')
          _t.open = false
          _t.getList()
        })
      } else {
        add(_t.form).then(response => {
          _t.$modal.msgSuccess('新增成功')
          _t.open = false
          _t.getList()
        })
      }
    }
  })
}

export function deleteList(row, ids, getList) {
  const idList = row.id ? [row.id] : ids
  MessageBox.confirm(
    '是否确认删序号为 <span style="color:red">' + idList + '</span> 的数据项？',
    '删除提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      dangerouslyUseHTMLString: true
    }).then(() => {
    let req = {
      idList: idList
    }
      deleteByIdList(req).then((rr)=>{

        if (getList) {
          getList()
        }
        Message.success('删除成功')
      })
  }).then(() => {

  })
  document.getElementsByClassName('el-message-box')[0].style.width = '520px'
}

export function deleteByIdList(data) {
  const urlPrefix = getPathPrefix()
  return request({
    url: urlPrefix + '/deleteByIdList',
    'method': 'POST',
    data: data
  })
}

export function getById(data) {
  const urlPrefix = getPathPrefix()
  return request({
    url: urlPrefix + '/queryByIdList',
    'method': 'POST',
    data: data
  })
}

function getPathPrefix() {
  return document['pagePath']
}

export function updateStatus(data) {
  const urlPrefix = getPathPrefix()
  return request({
    url: urlPrefix + '/updateStatus',
    'method': 'POST',
    data: data
  })
}

export function checkCompareDesc(property) {
  return function(a, b) {
    let value1 = a[property]
    let value2 = b[property]
    return value2 - value1
  }
}

export function checkCompare(property) {
  return function(a, b) {
    let value1 = a[property]
    let value2 = b[property]
    return value1 - value2
  }
}


export function showMsg(res, showMsg) {
  if (res.code !== 200) {
    ElementUI.Message({
      message: res.msg || showMsg || '操作失败',
      type: 'error'
    })
    return false
  }
  ElementUI.Message({
    message: showMsg || '操作成功',
    type: 'success'
  })
}

export function toString(obj) {
  return JSON.stringify(obj)
}

export function randomNum(maxNum) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWSYZabcdefghijklmnopqrstuvwsyz0123456789'
  const list = []
  //通过随机获取八个字符串的索引下标
  for (let i = 0; i < maxNum; i++) {
    //61为chars字符串长度为62，注意索引是从0开始的
    const val_1 = Math.round(Math.random() * 61)
    list.push(val_1)
  }

  return list.map(item => chars[item]).join('')
}

export function translator(parents, children, parentKey, childrenKey) {
  // 遍历父节点数据
  parents.forEach(parent => {
    // 遍历子节点数据
    children.forEach((current, index) => {
      // 当父节点对应的一个子节点相等时
      if (current[childrenKey] === parent[parentKey]) {
        //对子节点数据进行深复制,防止当temp改变而改变子节点
        let temp = JSON.parse(JSON.stringify(children))
        // 让当前子节点从temp中移除，temp作为新的子节点数据
        temp.splice(index, 1)
        // 让当前子节点作为唯一的父节点，去递归查找其对应的子节点
        translator([current], temp)
        // 把找到子节点放入父节点的children属性中
        typeof parent.children !== 'undefined'
          ? parent.children.push(current)
          : (parent.children = [current])
      }
    })
  })
}

export function getUrlParam(paramName) {
  const query = window.document.location.href.substring(1)
  const vars = query.split('&')
  console.log('query', query)
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (pair[0] == paramName) {
      return pair[1]
    }
  }
  return ''
}

export function log(...data) {
  if (data) {
    data.forEach(t => console.info(t))
  }
  // console.info(data)
}

export function getDistrictByParentCode(data) {
  return request({
    url: '/districtCode/queryList',
    'method': 'POST',
    data: { data: { parentCode: data || '0' } }
  })
}

export function getDistrictByParentCode2List(data, list) {
  return request({
    url: '/districtCode/queryList',
    'method': 'POST',
    data: { data: { parentCode: data } }
  }).then(r => list = r.data.dataList)
}

export function addJs(js) {
  let hm = document.createElement('script')
  hm.src = js
  let s = document.getElementsByTagName('script')[0]
  s.parentNode.insertBefore(hm, s)

}

export function pinyin4jSzm(str, su) {
  return post('/pinyin4j/getSZM', { str: str }, false)
  .then(t => {
    su({
      szmUpper: t.data.szmUpper,
      szmLower: t.data.szmLower

    })
  })
}
