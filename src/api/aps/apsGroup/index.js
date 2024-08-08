import { queryUrlPageList } from '@/api/common'

export function queryBomGroupTree(addRoot) {

  return queryUrlPageList('/apsBomGroup', { queryPage: false }).then(t => {
    var dataList = t.data.dataList
    const tree = []
    if (addRoot) {
      dataList.push({ parentId: '0', groupName: '根节点', id: '0' })
    }
    let parents = dataList.filter(value => value.parentId === "0" );
    let children = dataList.filter(value => value.parentId !== "0");
    dataList.forEach(t => t.name = t.groupName)
    translator(parents, children);
    return parents
  })
}

function translator  (parents, children)  {
  // 遍历父节点数据
  parents.forEach(parent => {
    // 遍历子节点数据
    children.forEach((current, index) => {
      // 当父节点对应的一个子节点相等时
      if (current.parentId === parent.id) {
        //对子节点数据进行深复制,防止当temp改变而改变子节点
        let temp = JSON.parse(JSON.stringify(children));
        // 让当前子节点从temp中移除，temp作为新的子节点数据
        temp.splice(index, 1);
        // 让当前子节点作为唯一的父节点，去递归查找其对应的子节点
        translator([current], temp);
        // 把找到子节点放入父节点的children属性中
        typeof parent.children !== "undefined"
          ? parent.children.push(current)
          : (parent.children = [current]);
      }
    });
  });
};

