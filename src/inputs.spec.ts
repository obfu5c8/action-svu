/// <reference types="jest" />
import {describe, expect, it, jest} from '@jest/globals'
import * as _core from '@actions/core'
import {
  ActionInputs,
  assertInputsAreValid,
  getInputs,
  InputError
} from './inputs'

jest.mock('@actions/core')
const core = _core as jest.MockedObject<typeof _core>

describe('getInputs()', () => {
  const testStringInput = (input: string, key: keyof ActionInputs) => {
    const EXPECTED = 'foo'
    it(`sets ${input}`, () => {
      core.getInput.mockReturnValue(EXPECTED)
      const val1 = getInputs()
      expect(val1[key]).toBe(EXPECTED)

      core.getInput.mockReturnValue('')
      const val2 = getInputs()
      expect(val2[key]).toBe(undefined)
    })
  }

  const testBooleanInput = (input: string, key: keyof ActionInputs) => {
    const EXPECTED = true
    it(`sets ${input}`, () => {
      core.getBooleanInput.mockReturnValue(EXPECTED)
      const val1 = getInputs()
      expect(val1[key]).toBe(EXPECTED)

      core.getBooleanInput.mockReturnValue(false)
      const val2 = getInputs()
      expect(val2[key]).toBe(false)
    })
  }

  testStringInput('type', 'type')
  testStringInput('tag-mode', 'tagMode')
  testStringInput('prefix', 'prefix')
  testStringInput('suffix', 'suffix')
  testStringInput('svu-version', 'svuVersion')
  testBooleanInput('force-increment', 'forceIncrement')
  testBooleanInput('no-metadata', 'noMetadata')
  testBooleanInput('no-pre-release', 'noPreRelease')
  testBooleanInput('no-build', 'noBuild')
})

describe('assertInputsAreValid()', () => {
  it('throws an error if invalid type is provided', () => {
    let thrownErr
    try {
      assertInputsAreValid({
        type: 'not_acceptable'
      } as any)
    } catch (err) {
      thrownErr = err
    }
    expect(thrownErr).toBeInstanceOf(InputError)
    expect(thrownErr).toHaveProperty('input', 'type')
  })

  it('throws an error if invalid tagMode is provided', () => {
    let thrownErr
    try {
      assertInputsAreValid({
        type: 'auto',
        tagMode: 'not_acceptable'
      } as any)
    } catch (err) {
      thrownErr = err
    }
    expect(thrownErr).toBeInstanceOf(InputError)
    expect(thrownErr).toHaveProperty('input', 'tag-mode')
  })
})
