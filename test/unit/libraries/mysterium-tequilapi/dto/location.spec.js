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

import {expect} from 'chai'
import LocationDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/location'

describe('TequilapiClient DTO', () => {
  describe('LocationDTO', () => {
    it('sets properties with full structure', async () => {
      const location = new LocationDTO({
        asn: '',
        country: 'LT'
      })

      expect(location.country).to.equal('LT')
    })

    it('sets empty properties structure', async () => {
      const location = new LocationDTO({})

      expect(location.country).to.be.undefined
    })

    it('sets wrong properties structure', async () => {
      const location = new LocationDTO('I am wrong')

      expect(location.country).to.be.undefined
    })
  })
})