import * as exec from '@actions/exec'
import {ActionInputs} from './inputs'
import {Tool} from './installer'

export const buildSvuArgsFromInputs = (inputs: ActionInputs): string[] => {
  const args: string[] = []

  if (['current', 'major', 'minor', 'patch'].includes(inputs.type)) {
    args.push(inputs.type)
  }

  inputs.forceIncrement && args.push('--force-patch-increment')

  args.push('--tag-mode', inputs.tagMode)

  inputs.noMetadata && args.push('--no-metadata')
  inputs.noPreRelease && args.push('--no-pre-release')
  inputs.noBuild && args.push('--no-prebuild')

  inputs.stripPrefix && args.push('--strip-prefix')
  inputs.prefix && args.push('--prefix', inputs.prefix)
  inputs.suffix && args.push('--suffix', inputs.suffix)

  return args
}

export const executeSvuAsync = async (
  inputs: ActionInputs,
  svu: Tool
): Promise<string> => {
  const args = buildSvuArgsFromInputs(inputs)

  const result = await exec.getExecOutput(svu.bin, args)

  if (result.exitCode !== 0) {
    throw new Error(
      `SVU return non-zero exit code (${result.exitCode}): ${result.stderr}`
    )
  }

  return result.stdout.trim()
}
