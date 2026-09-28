// Runs after every `yarn install`: prepares a fresh clone so the suites and the dev servers run as they are.
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync } from 'node:fs'

const workspacesWithEnv = ['backend', 'frontend', 'sut']

for (const workspace of workspacesWithEnv) {
  const env = `packages/${workspace}/.env`
  if (!existsSync(env)) {
    copyFileSync(`${env}.example`, env)
    console.log(`postinstall: created ${env} from its example`)
  }
}

execFileSync('husky', { stdio: 'inherit' })
execFileSync('yarn', ['workspace', 'sut', 'playwright', 'install', 'chromium'], { stdio: 'inherit' })
