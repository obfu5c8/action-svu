import * as core from '@actions/core'
import * as log from './log'
import {getInputsWithDefaults, assertInputsAreValid} from './inputs'
import {ensureSvuAsync} from './installer'
import {executeSvuAsync} from './svu'

export async function runActionAsync(): Promise<void> {
  log.info('Hello world')

  // Gather the inputs and validate
  const inputs = getInputsWithDefaults()
  assertInputsAreValid(inputs)

  // Ensure correct SVU version is installed
  const svu = await ensureSvuAsync(inputs.svuVersion)

  // Set output containing path to binary
  core.setOutput('bin_path', svu.bin)

  // Execute SVU
  if (inputs.type !== 'none') {
    const output = await executeSvuAsync(inputs, svu)
    core.info(`New version: ${output}`)

    const vbits = output.split('.')
    const major = vbits[0]
    const majorminor = [vbits[0], vbits[1]].join('.')

    core.setOutput('version', output)
    core.setOutput('version_major', major)
    core.setOutput('version_majorminor', majorminor)
  }
}
