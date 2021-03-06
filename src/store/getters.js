const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  name: state => state.user.name,
  roles: state => state.user.roles,
  roleUuid: state => state.user.roleUuid,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
}
export default getters
