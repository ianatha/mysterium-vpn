import type from '../types'
import tequilAPI from '../../../api/tequilapi'
import config from '../../config'
// TODO tequilAPI should be passed via DI
const tequilapi = tequilAPI()

let updaterTimeout

const state = {
  ip: null,
  status: 'NotConnected',
  stats: {
    bytesReceived: '-;-',
    bytesSent: '@__@',
    duration: 'u.u'
  }
}

const getters = {
  status: state => state.status,
  connection: state => state,
  ip: state => state.ip
}

const mutations = {
  [type.CONNECTION_IP] (state, ip) {
    if (ip !== null) {
      state.ip = ip
    }
  },
  [type.CONNECTION_STATUS_ALL] (state, data) {
    state.status = data.status
    state.stats = data.stats
    if (data.ip !== null) {
      state.ip = data.ip
    }
  },
  [type.CONNECTION_STATUS] (state, status) {
    state.status = status
  }
}

const actions = {
  async [type.STATUS_UPDATER_RUN] ({dispatch}) {
    await dispatch(type.CONNECTION_STATUS_ALL)
    updaterTimeout = setTimeout(() => {
      dispatch(type.STATUS_UPDATER_RUN)
    }, config.statusUpdateTimeout)
  },
  async [type.CONNECTION_IP] ({commit}) {
    try {
      const ip = await tequilapi.connection.ip()
      commit(type.CONNECTION_IP, ip)
    } catch (err) {
      commit(type.REQUEST_FAIL, err)
      throw err
    }
  },
  async [type.CONNECTION_STATUS_ALL] ({commit}) {
    try {
      const statusPromise = tequilapi.connection.status()
      const statsPromise = tequilapi.connection.statistics()
      const ipPromise = tequilapi.connection.ip()
      const [status, stats, ip] = await Promise.all([statusPromise, statsPromise, ipPromise])
      commit(type.CONNECTION_STATUS_ALL, {status: status.status, stats, ip})
    } catch (err) {
      commit(type.REQUEST_FAIL, err)
      throw (err)
    }
  },
  async [type.CONNECTION_STATUS] ({commit}) {
    const res = await tequilapi.connection.status()
    commit(type.CONNECTION_STATUS, res.status)
  },
  async [type.CONNECT] ({commit, dispatch}, consumerId, providerId) {
    try {
      const res = await tequilapi.connection.connect(consumerId, providerId)
      commit(type.CONNECTION_STATUS, res.status)
      dispatch(type.STATUS_UPDATER_RUN)
      return res
    } catch (err) {
      commit(type.REQUEST_FAIL, err)
      throw (err)
    }
  },
  async [type.DISCONNECT] ({commit, dispatch}) {
    try {
      const res = await tequilapi.connection.disconnect()
      clearTimeout(updaterTimeout)
      await dispatch(type.CONNECTION_IP)
      await dispatch(type.CONNECTION_STATUS)
      return res
    } catch (err) {
      commit(type.REQUEST_FAIL, err)
      throw (err)
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
