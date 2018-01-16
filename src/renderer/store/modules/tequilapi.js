const state = {
  init: '',
  error: {
    message: '',
    request: {},
    response: {
      data: {}
    }
  },
  uptime: '',
  mystCli: {},
  currentId: '',
  proposals: []
}

const mutations = {
  INIT_SUCCESS (state) { state.init = 'success' },
  INIT_PENDING (state) { state.init = 'pending' },
  INIT_FAIL (state, err) { state.init = 'fail'; state.error = err },
  PROPOSAL_LIST_SUCCESS (state, proposals) {
    state.proposals = proposals
  },
  IDENTITY_GET_SUCCESS (state, id) {
    state.currentId = id
  },
  TEQUILAPI_REQUEST_FAIL (state, err) {
    state.error = err
  },
  HEALTHCHECK_SUCCESS (state, data) {
    state.mystCli = {...state.mystCli, ...data} // object mystCli extend with data
  },
  IDENTITY_LIST_SUCCESS (state, data) {
    state.identites = data
  }
}

const getPassword = async () => ''

function factory (tequilapi) {
  const actions = {
    async identityCreate ({commit}) {
      try {
        const newIdentity = await tequilapi.post('/identities', {password: await getPassword()})
        return newIdentity
      } catch (err) {
        commit('TEQUILAPI_REQUEST_FAIL', err)
        throw (err)
      }
    },
    async identityList ({commit}) {
      try {
        const res = await tequilapi.get('/identities')
        return res.identities
      } catch (err) {
        commit('TEQUILAPI_REQUEST_FAIL', err)
        throw (err)
      }
    },
    async proposalList ({commit}) {
      try {
        const proposalRes = await tequilapi.get('/proposals')
        commit('PROPOSAL_LIST_SUCCESS', proposalRes.proposals)
        return proposalRes.proposals
      } catch (err) {
        commit('TEQUILAPI_REQUEST_FAIL', err)
        throw (err)
      }
    },
    async healthcheck ({commit}) {
      try {
        const res = await tequilapi.get('/healthcheck')
        commit('HEALTHCHECK_SUCCESS', res)
      } catch (err) {
        commit('TEQUILAPI_REQUEST_FAIL', err)
        throw (err)
      }
    }
  }
  return {
    state,
    mutations,
    actions
  }
}

export default factory
