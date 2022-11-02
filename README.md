![GitHub](https://img.shields.io/github/license/obfu5c8/action-svu?style=for-the-badge)
![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/obfu5c8/action-svu/CI/main?logo=github&style=for-the-badge)
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/obfu5c8/action-svu?style=for-the-badge)

# SVU Github Action

Install and use [svu](https://github.com/caarlos0/svu) semver tool in your github actions.

# Usage

## Basic usage

Most inputs map directly to `svu` cli arguments. The new version is available as a step output

```yml
steps:
  - uses: obfu5c8/action-svu
    id: generate_next_version
    with:
      force-increment: true

  - run: |
      git tag ${{ steps.generate_next_version.outputs.version }}
```

## Use as a tool installer

You can use this action to simply install `svu` into the workflow agent without executing it.
Once installed, `svu` will be available on `PATH` and also returns the exact binary path as an
output. Set the `type` input to `none` to disable `svu` execution.

```yaml
steps:
  - uses: obfu5c8/action-svu
    id: install_svu
    with:
      type: none

  - run: |
      ## svu is now available on PATH
      svu major

      ## You can also get to direct path
      ${{ steps.install_svu.outputs.bin_path }} major
```

# All Inputs

## `type`

Allowed values: `none` | `auto` | `major` | `minor` | `patch`

The type of bump to perform. Set to `none` to skip execution and just install the tool.
Defaults to `auto`.

## `force-increment`

Type: `boolean`

Force at least a patch increment, even if no commits demand it.
Results in passing a `--force-patch-increment` flag to `svu`

## `tag-mode`

Allowed values: `current-branch` | `all-branches`

Default value: `current-branch`

Change 'last tag' lookup behaviour. Accepted values are 'current-branch' and 'all-branches'

## `no-metadata`

Type: `boolean`

Discards pre-release and build metadata

## `no-pre-release`

Type: `boolean`

Discards pre-release metadata

## `no-build`

Type: `boolean`

Discards build metadata

## `strip-prefix`

The prefix of the tag. Default is `v`

## `suffix`

Can be used to set a custom suffix for the tag, e.g. build metadata or prelease

## `prefix`

The prefix of the tag. Default is `v`

## `svu-version`

Default: `1.9.0`

The svu binary version to install
