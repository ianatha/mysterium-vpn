/*
 * Copyright (C) 2017 The "MysteriumNetwork/mysterion" Authors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// TODO: rename to messages.js
export default {
  CONNECTION_STATUS_CHANGED: 'connection.status.changed',
  CONNECTION_REQUEST: 'connection.request',
  CONNECTION_CANCEL: 'connection.cancel',

  MYSTERIUM_CLIENT_READY: 'mysterium-client.ready',
  MYSTERIUM_CLIENT_LOG: 'mysterium-client.log',
  CURRENT_IDENTITY_CHANGED: 'current.identity.changed',

  TERMS_REQUESTED: 'terms.requested',
  TERMS_ANSWERED: 'terms.answered',
  TERMS_ACCEPTED: 'terms.accepted',

  RENDERER_BOOTED: 'renderer.booted',
  RENDERER_SHOW_ERROR: 'renderer.show-error',

  HEALTHCHECK: 'healthcheck',
  PROPOSALS_UPDATE: 'proposals.update'
}