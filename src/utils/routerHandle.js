/**
 * Created by Hang on 2018/6/13 0013.
 */


/**
 *
 *    《建立新路由界面要求》
 *      请严格执行项目规范
 *
 * 1：路由地址对应目录下建立文件夹
 * 2：主文件名必须为index.vue
 * 3：组件name为必填与文件夹名一致
 *
 * 示例：
 * 标题：'资讯列表'
 * 路由地址：'/PC/Consultation/ConsultationList'
 * 路由名：'ConsultationList'（截取地址最后字符串）
 * 组件：'@/views/PC/Consultation/ConsultationList/index'
 *
 */

export function handleData(data) {
  let list = [];
  if(data && data.length > 0) {
    data.forEach((v,i) => {
      let pathArr = v.url.split('/');
      let level = pathArr.length -1;
      let name = pathArr[level];
      let component;

      if(level === 1) {  //一级菜单使用公共组件
        component = () => import('@/views/layout/Layout');
      } else {   //其他使用对应组件
        component = resolve => require([`@/views${v.url}/index`], resolve)
      }

      let router = {  //路由详情
        id: v.id,
        uuid: v.uuid,
        pid: v.pid,
        level: level,
        meta: {
          title: v.name,
          icon: v.iconCls,
        },
        name: name,
        component: component,
        path: v.url,
        children: handleData(v.childMenu)
      }

      let hiddenArray = ['ConsultationCreat']; //隐藏导航
      if(hiddenArray.includes(name)) {
        Object.assign(router,{
          hidden: true,
        })
      }

      if(v.childMenu) {
        if(v.childMenu.length === 1) {  //一级子类折叠
          Object.assign(router,{
            alwaysShow: true,
          })
        }
      }

      list.push(router)
    })
  }
  return list;
}
