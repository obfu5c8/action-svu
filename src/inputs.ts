import * as core from '@actions/core'

export interface ActionInputs {
  type: string
  forceIncrement: boolean
  tagMode: string
  noMetadata: boolean
  noPreRelease: boolean
  noBuild: boolean
  stripPrefix: boolean
  prefix: string
  suffix?: string
  svuVersion: string
}

/**
 * Grabs all the action inputs
 */
export const getInputs = (): Partial<ActionInputs> => {
  return {
    type: notEmpty(core.getInput('type')),
    forceIncrement: core.getBooleanInput('force-increment'),
    tagMode: notEmpty(core.getInput('tag-mode')),
    noMetadata: core.getBooleanInput('no-metadata'),
    noPreRelease: core.getBooleanInput('no-pre-release'),
    noBuild: core.getBooleanInput('no-build'),
    stripPrefix: core.getBooleanInput('strip-prefix'),
    prefix: notEmpty(core.getInput('prefix')),
    suffix: notEmpty(core.getInput('suffix')),
    svuVersion: notEmpty(core.getInput('svu-version'))
  }
}

const notEmpty = (str: string): string | undefined => {
  if (!str) return undefined
  if (str === '') return undefined
  return str
}

/**
 * Grabs all action inputs and sets defaults
 */
export const getInputsWithDefaults = (): ActionInputs => ({
  type: 'auto',
  forceIncrement: false,
  tagMode: 'current-branch',
  noMetadata: false,
  noPreRelease: false,
  noBuild: false,
  stripPrefix: false,
  prefix: 'v',
  svuVersion: '1.9.0',
  ...getInputs()
})

export class InputError extends Error {
  readonly input: string
  readonly validationMessage: string

  constructor(input: string, msg: string) {
    super(`Input error: Input '${input}' is invalid: ${msg}`)
    this.input = input
    this.validationMessage = msg
  }
}

export const assertInputsAreValid = (inputs: ActionInputs): void => {
  if (!['none', 'auto', 'major', 'minor', 'patch'].includes(inputs.type)) {
    throw new InputError(
      'type',
      'Value must be one of none|auto|major|minor|patch'
    )
  }

  if (!['current-branch', 'all-branches'].includes(inputs.tagMode)) {
    throw new InputError(
      'tag-mode',
      'Value must be one of current-branch|all-branches'
    )
  }
}
