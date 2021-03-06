<!--
  - Copyright (C) 2017 The "mysteriumnetwork/mysterium-vpn" Authors.
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU General Public License as published by
  - the Free Software Foundation, either version 3 of the License, or
  - (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  - GNU General Public License for more details.
  -
  - You should have received a copy of the GNU General Public License
  - along with this program.  If not, see <http://www.gnu.org/licenses/>.
  -->

<template>
  <div>
    <div
      class="control__action btn"
      :class="{'btn--transparent':buttonTransparent}"
      @click="buttonPressed"
      v-text="buttonText"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import type from '../store/types'
import { ConnectionStatus } from 'mysterium-vpn-js'
import messages from '../../app/messages'

export default {
  name: 'ConnectionButton',
  props: {
    providerId: {
      type: String,
      required: true
    },
    providerCountry: {
      type: String,
      required: false,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      status: 'status',
      consumerId: 'currentIdentity'
    }),
    buttonText: (vm) => {
      let text = 'Connect'
      switch (vm.$store.getters.status) {
        case ConnectionStatus.CONNECTED:
          text = 'Disconnect'
          break
        case ConnectionStatus.CONNECTING:
          text = 'Cancel'
          break
        case ConnectionStatus.NOT_CONNECTED:
          text = 'Connect'
          break
        case ConnectionStatus.DISCONNECTING:
          text = 'Disconnecting'
          break
      }
      return text
    },
    buttonTransparent: (comp) => {
      const status = comp.$store.getters.status
      const isTransparent = (
        status === ConnectionStatus.CONNECTING ||
          status === ConnectionStatus.DISCONNECTING ||
          status === ConnectionStatus.CONNECTED
      )

      return isTransparent
    }
  },
  methods: {
    buttonPressed: function () {
      const status = this.$store.getters.status
      const canConnect = status === ConnectionStatus.NOT_CONNECTED
      const canDisconnect = (
        status === ConnectionStatus.CONNECTED ||
          status === ConnectionStatus.CONNECTING
      )

      if (canDisconnect) {
        this.$store.dispatch(type.DISCONNECT)
        return
      }

      if (!this.providerId) {
        this.$store.commit(type.SHOW_ERROR_MESSAGE, messages.locationNotSelected)
        return
      }

      if (canConnect) {
        const provider = { id: this.providerId, country: this.providerCountry }
        this.$store.dispatch(type.CONNECT, provider)
      }
    }
  }
}
</script>
