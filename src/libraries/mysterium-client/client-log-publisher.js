/*
 * Copyright (C) 2017 The "mysteriumnetwork/mysterium-vpn" Authors.
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

// @flow
import fs from 'fs'
import type { BugReporter } from '../../app/bug-reporting/interface'
import Publisher from '../publisher'
import logLevels from './log-levels'
import type { LogCallback } from './index'
import createFileIfMissing from '../create-file-if-missing'
import { INVERSE_DOMAIN_PACKAGE_NAME } from './launch-daemon/config'
import { prependWithFn } from '../strings'
import { TimeFormatter } from '../formatters/time-formatter'

type Publishers = {
  [logLevels.INFO | logLevels.ERROR]: Publisher<string>,
}

type DateFunction = () => Date
type TailFunction = (filePath: string, logCallback: LogCallback) => void

const prependWithSpace = prependWithFn(() => ` `)

class ClientLogPublisher {
  _publishers: Publishers
  _bugReporter: BugReporter
  _stdoutPath: string
  _stderrPath: string
  _systemFilePath: ?string
  _dateFunction: DateFunction
  _timeFormatter: TimeFormatter
  _tailFunction: TailFunction

  constructor (
    bugReporter: BugReporter,
    stdoutPath: string,
    stderrPath: string,
    systemFilePath: ?string,
    dateFunction: DateFunction,
    timeFormatter: TimeFormatter,
    tailFunction: TailFunction
  ) {
    this._bugReporter = bugReporter
    this._stdoutPath = stdoutPath
    this._stderrPath = stderrPath
    this._systemFilePath = systemFilePath
    this._dateFunction = dateFunction
    this._timeFormatter = timeFormatter
    this._tailFunction = tailFunction

    this._publishers = {
      [logLevels.INFO]: new Publisher(),
      [logLevels.ERROR]: new Publisher()
    }
  }

  async setup (): Promise<void> {
    await this._prepareLogFiles()

    this._tailLogs()
  }

  onLog (level: string, cb: LogCallback): void {
    if (!this._publishers[level]) {
      throw new Error(`Unknown process logging level: ${level}`)
    }

    this._publishers[level].addSubscriber(cb)
  }

  _tailLogs () {
    this._tailInfoFile()
    this._tailErrorFile()
    this._tailSystemFile()
  }

  _tailInfoFile () {
    this._tailFile(this._stdoutPath, this._notifySubscribersWithLog.bind(this, logLevels.INFO))
  }

  _tailErrorFile () {
    const prependWithCurrentTime = prependWithFn(() => this._timeFormatter.formatISODateTime(this._dateFunction()))

    this._tailFile(this._stderrPath, (data) => {
      this._notifyOnErrorSubscribers(prependWithCurrentTime(prependWithSpace(data)))
    })
  }

  _tailSystemFile () {
    const systemFilePath = this._systemFilePath

    if (!systemFilePath) {
      return
    }

    if (!fs.existsSync(systemFilePath)) {
      this._bugReporter.captureErrorException(new Error(`System log file doesn't exist`))
      return
    }

    this._tailFile(systemFilePath, (data) => {
      if (data.includes(INVERSE_DOMAIN_PACKAGE_NAME)) {
        this._notifyOnErrorSubscribers(data)
      }
    })
  }

  _notifyOnErrorSubscribers (data: string): void {
    this._notifySubscribersWithLog(logLevels.ERROR, data)
  }

  _notifySubscribersWithLog (level: string, data: string): void {
    this._publishers[level].publish(data)
  }

  _tailFile (filePath: string, subscriberCallback: LogCallback): void {
    this._tailFunction(filePath, subscriberCallback)
  }

  async _prepareLogFiles (): Promise<void> {
    await createFileIfMissing(this._stdoutPath)
    await createFileIfMissing(this._stderrPath)
  }
}

export default ClientLogPublisher
export type { TailFunction }
