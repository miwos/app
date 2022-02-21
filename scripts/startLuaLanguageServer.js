import { startLanguageServer } from '@monaco-lua/server'
import { resolve } from 'path'

startLanguageServer(
  8080,
  resolve(
    process.cwd(),
    'node_modules/@monaco-lua/server/lua-language-server/.bin/Windows/lua-language-server.exe'
  )
)
