import * as tc from '@actions/tool-cache'
import * as core from '@actions/core'
import path from 'path'
import os from 'os'
import * as log from './log'

const TOOL = 'svu'

export interface Tool {
  dir: string
  bin: string
}

export interface Arch {
  platform: string
  arch: string
}

export const ensureSvuAsync = async (version: string): Promise<Tool> => {
  const {platform, arch} = getPlatformArch()
  const svu = await ensureSvuInstalledAsync(version, platform, arch)
  core.addPath(svu.dir)
  return svu
}

export const getPlatformArch = (): Arch => {
  let platform: string
  let arch: string

  const osPlatform = os.platform()
  switch (os.platform()) {
    case 'linux':
      platform = 'linux'
      break
    case 'darwin':
      platform = 'darwin'
      break
    case 'win32':
      platform = 'windows'
      break
    default:
      throw new Error(`Unsupported platform '${osPlatform}`)
  }

  if (platform === 'darwin') {
    arch = 'all'
  } else {
    arch = os.arch()
    switch (arch) {
      case 'x64':
        arch = 'amd64'
        break
      case 'x32':
        arch = 'amd32'
    }
  }

  return {platform, arch}
}

export const ensureSvuInstalledAsync = async (
  version: string,
  platform: string,
  arch: string
): Promise<Tool> => {
  log.info(`Checking for svu ${version} (${platform}-${arch})`)
  let dir = findCachedTool(version)
  if (!dir) {
    dir = await log.group('Installing svu from github', async () =>
      installSvuAsync(version, platform, arch)
    )
  }

  return {
    dir,
    bin: getBinaryPath(dir)
  }
}

export const installSvuAsync = async (
  version: string,
  platform: string,
  arch: string
): Promise<string> => {
  try {
    const dir = await downloadBinaryAsync(version, platform, arch)
    await cacheBinaryFolderAsync(dir, version)
    return dir
  } catch (err) {
    log.error(`Failed to install: ${(err as Error).message}`)
    throw err
  }
}

export const getReleaseFilename = (
  version: string,
  platform: string,
  arch: string
): string => `svu_${version}_${platform}_${arch}.tar.gz`

export const getReleaseBaseUrl = (version: string): string =>
  `https://github.com/caarlos0/svu/releases/download/v${version}`

export const getReleaseUrl = (
  version: string,
  platform: string,
  arch: string
): string => {
  const base = getReleaseBaseUrl(version)
  const file = getReleaseFilename(version, platform, arch)
  return `${base}/${file}`
}

//https://github.com/caarlos0/svu/releases/download/v1.9.0/svu_1.9.0_linux_amd64.tar.gz

export const downloadBinaryAsync = async (
  version: string,
  platform: string,
  arch: string
): Promise<string> => {
  const url = getReleaseUrl(version, platform, arch)

  log.info(`Downloading svu from ${url}`)
  const tarPath = await tc.downloadTool(url)
  const binFolder = await tc.extractTar(tarPath, `__tools/svu-${version}`)

  return binFolder
}

export const cacheBinaryFolderAsync = async (
  dirPath: string,
  version: string
): Promise<void> => {
  await tc.cacheDir(dirPath, TOOL, version)
}

export const findCachedTool = (version: string): string | undefined => {
  return tc.find(TOOL, version) || undefined
}

export const getBinaryPath = (dirPath: string): string =>
  path.join(dirPath, 'svu')

// https://github.com/caarlos0/svu/releases/download/v1.9/svu_1.9_linux_amd64.tar.gz
// https://github.com/caarlos0/svu/releases/download/v1.9.0/svu_1.9.0_linux_amd64.tar.gz
