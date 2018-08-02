import { loginByUsername, logout, getUserInfo, switchUserRole } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { sha512 } from 'js-sha512'

const user = {
  state: {
    token: getToken(),
    name: '',
    roleUuid: '',
    roles: [],
  },

  mutations: {

    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ROLEUUID: (state, roleUuid) => {
      state.roleUuid = roleUuid
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const timestemp = new Date().getTime();
      const username = userInfo.username.trim()
      const password = sha512(sha512(`${username}&${userInfo.password}:onlyhi`) + timestemp);
      return new Promise((resolve, reject) => {
        loginByUsername(username, password, timestemp).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.token)
          setToken(response.data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          const data = response.data
          if (data.userRoles && data.userRoles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.userRoles)
            commit('SET_ROLEUUID', data.user.roleUuid)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.user.name)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    // LogOut({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     logout(state.token).then(() => {
    //       commit('SET_TOKEN', '')
    //       commit('SET_ROLES', [])
    //       removeToken()
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [] )
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, roleUuid) {
      return new Promise(resolve => {
        switchUserRole({ roleUuid: roleUuid}).then(response => {
          commit('SET_ROLES', [])
          resolve()
        })
      })
    }
  }
}

export default user
