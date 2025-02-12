#!/usr/bin/env tsx

import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

// Helper to print errors and exit
function errorExit(message: string): never {
  console.error(`ERROR: ${message}`)
  process.exit(1)
}

// Run a shell command and inherit stdio
function runCommand(command: string) {
  try {
    execSync(command, { stdio: 'inherit' })
  } catch (err) {
    errorExit(`Command failed: ${command} (${err})`)
  }
}

// Replace placeholders in a file (e.g. {APP_NAME} with the actual name)
function replacePlaceholders(filePath: string, placeholders: Record<string, string>) {
  let content = fs.readFileSync(filePath, 'utf8')
  for (const [key, value] of Object.entries(placeholders)) {
    const regex = new RegExp(`\\{${key}\\}`, 'g')
    content = content.replace(regex, value)
  }
  fs.writeFileSync(filePath, content, 'utf8')
}

// Check if a file or directory exists
function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath)
}

// Recursive copy helper using fs.cpSync (requires Node 16.7+)
function copyRecursive(src: string, dest: string) {
  try {
    fs.cpSync(src, dest, { recursive: true })
  } catch (e) {
    errorExit(`Failed to copy from ${src} to ${dest}: ${e}`)
  }
}

function main() {
  const OS = process.platform // 'darwin' for macOS

  console.log('Neutralino BuildScript for macOS')

  const ROOT_DIR = process.cwd()
  const CONF = path.join(ROOT_DIR, 'neutralino.config.json')
  const BUILDSCRIPTS = path.join(ROOT_DIR, 'build-scripts')
  const APP_CONTAINER = path.join(BUILDSCRIPTS, 'app_containers', 'mac', 'myapp.app')

  if (!fileExists(CONF)) {
    errorExit(`${CONF} not found.`)
  }

  if (!fileExists(APP_CONTAINER)) {
    errorExit(`App container not found: ${APP_CONTAINER}`)
  }

  let config
  try {
    const configContent = fs.readFileSync(CONF, 'utf8')
    config = JSON.parse(configContent)
  } catch (e) {
    errorExit(`Failed to parse ${CONF}: ${e}`)
  }

  if (!config.buildScript || !config.buildScript.mac) {
    errorExit(`Missing buildScript.mac configuration in ${CONF}`)
  }

  const APP_ARCH_LIST: string[] = config.buildScript.mac.architecture
  const APP_VERSION: string = config.version
  const APP_MIN_OS: string = config.buildScript.mac.minimumOS
  const APP_BINARY: string = config.cli.binaryName
  const APP_NAME: string = config.buildScript.mac.appName
  const APP_ID: string = config.buildScript.mac.appIdentifier
  const APP_BUNDLE: string = config.buildScript.mac.appBundleName
  const APP_ICON: string = config.buildScript.mac.appIcon

  APP_ARCH_LIST.forEach((arch) => {
    console.log(`\nBuilding for: ${arch}`)

    const APP_DST = path.join(ROOT_DIR, 'dist', `mac_${arch}`, `${APP_NAME}.app`)
    const APP_MACOS = path.join(APP_DST, 'Contents', 'MacOS')
    const APP_RESOURCES = path.join(APP_DST, 'Contents', 'Resources')
    const EXE = path.join(ROOT_DIR, 'dist', APP_BINARY, `${APP_BINARY}-mac_${arch}`)
    const RES = path.join(ROOT_DIR, 'dist', APP_BINARY, 'resources.neu')
    const EXT = path.join(ROOT_DIR, 'dist', APP_BINARY, 'extensions')

    console.log(`Minimum macOS: ${APP_MIN_OS}`)
    console.log(`App Name:      ${APP_NAME}`)
    console.log(`Bundle Name:   ${APP_BUNDLE}`)
    console.log(`Identifier:    ${APP_ID}`)
    console.log(`Icon:          ${APP_ICON}`)
    console.log(`Container:     ${APP_CONTAINER}`)
    console.log(`Destination:   ${APP_DST}`)

    if (!fileExists(EXE)) {
      errorExit(`Binary not found: ${EXE}`)
    }
    if (!fileExists(RES)) {
      errorExit(`Resource file not found: ${RES}`)
    }

    // Create destination directories and copy container.
    fs.mkdirSync(APP_DST, { recursive: true })
    copyRecursive(APP_CONTAINER, APP_DST)
    fs.mkdirSync(APP_MACOS, { recursive: true })
    fs.mkdirSync(APP_RESOURCES, { recursive: true })

    console.log('Copying binary and resources...')
    const destBinary = path.join(APP_MACOS, 'main')
    fs.copyFileSync(EXE, destBinary)
    fs.chmodSync(destBinary, 0o755)

    fs.copyFileSync(RES, path.join(APP_RESOURCES, path.basename(RES)))

    if (fileExists(EXT)) {
      console.log('Copying extensions...')
      const destExt = path.join(APP_RESOURCES, path.basename(EXT))
      copyRecursive(EXT, destExt)
    }

    if (fileExists(APP_ICON)) {
      console.log('Copying icon...')
      const destIcon = path.join(APP_RESOURCES, path.basename(APP_ICON))
      copyRecursive(APP_ICON, destIcon)
    }

    console.log('Processing Info.plist...')
    const plistPath = path.join(APP_DST, 'Contents', 'Info.plist')
    const placeholders = {
      APP_NAME: APP_NAME,
      APP_BUNDLE: APP_BUNDLE,
      APP_ID: APP_ID,
      APP_VERSION: APP_VERSION,
      APP_MIN_OS: APP_MIN_OS,
    }
    replacePlaceholders(plistPath, placeholders)

    // Clear extended attributes on macOS.
    if (OS === 'darwin') {
      console.log('Clearing Extended Attributes...')
      runCommand(`find "${APP_DST}" -type f -exec xattr -c {} \\;`)
    }

    console.log(`\nBuild finished for ${arch}.`)
  })
}

main()
