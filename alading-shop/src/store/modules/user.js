import { loginByUsername, logout, getUserInfo, register } from '@/api/login'
import { getToken, setToken, removeToken, removeUser } from '@/utils/auth'
// import CryptoJS from 'crypto-js'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    },
    shopinfo: {},
    userDo: {}
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_SHOPINFO: (state, info) => {
      state.shopinfo = info
    },
    SET_USERDO: (state, userDo) => {
      state.userDo = userDo
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password

      // 方式一：PBKDF2加密
      // const salt = CryptoJS.enc.Utf8.parse('mySalt') + '';
      // // console.log(salt);
      // const iter = 1000;
      // const keyLen = 2;
      // const newPwd = CryptoJS.PBKDF2(password, salt, { keySize: keyLen, iterations: iter }) + '';
      // // console.log(newPwd);

      // 方式二：md5双次加密
      // const newPwd = CryptoJS.MD5(CryptoJS.MD5(password) + '') + '';
      // // console.log(newPwd);

      return new Promise((resolve, reject) => {
        loginByUsername(username, password).then(response => {
          commit('SET_TOKEN', response.data.token)
          setToken(response.data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 用户注册
    async Register({ commit }, data) {
      return await register(data).then(response => {
        commit('SET_TOKEN', response.data.token)
        setToken(response.data.token)
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          // sessionStorage.setItem("shopStatus",response.data.shopDo.verify);
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          const data = response.data
          console.log(data.userDo.username)

          if (data.userDo.root && data.userDo.root.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_USERDO', data.userDo)
            if (!data.shopDo) {
              commit('SET_ROLES', '0')
            } else {
              commit('SET_SHOPINFO', data.shopDo)
              if (data.shopDo.verify !== 4) {
                commit('SET_ROLES', '0')
              } else {
                commit('SET_ROLES', data.userDo.root)
              }
            }
          } else {
            reject('userDo: root must be a not-empty string !')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          removeUser()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        removeUser()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          const roles = data.userDo.root
          dispatch('GenerateRoutes', { roles }) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}

export default user
