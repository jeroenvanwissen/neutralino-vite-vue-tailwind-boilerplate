import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import type { WindowMenuItem } from '@neutralinojs/lib'
import { app, events, init, window as neuWindow } from '@neutralinojs/lib'

init()
createApp(App).mount('#app')

events.on('windowClose', () => app.exit())

// -- Main menu --

const menu: WindowMenuItem[] = [
  {
    id: 'app',
    text: 'App',
    menuItems: [
      { id: 'about', text: 'About', action: 'orderFrontStandardAboutPanel:' },
      { text: '-' },
      { id: 'hide', text: 'Hide', action: 'hide:', shortcut: 'h' },
      { id: 'hideOthers', text: 'Hide Others', action: 'hideOtherApplications:' },
      { id: 'showAll', text: 'Show All', action: 'unhideAllApplications:' },
      { text: '-' },
      { id: 'quit', text: 'Quit', action: 'terminate:', shortcut: 'q' },
    ],
  },
  {
    id: 'edit',
    text: 'Edit',
    menuItems: [
      { id: 'undo', text: 'Undo', action: 'undo:', shortcut: 'z' },
      { id: 'redo', text: 'Redo', action: 'redo:', shortcut: 'Z' },
      { text: '-' },
      { id: 'cut', text: 'Cut', action: 'cut:', shortcut: 'x' },
      { id: 'copy', text: 'Copy', action: 'copy:', shortcut: 'c' },
      { id: 'paste', text: 'Paste', action: 'paste:', shortcut: 'v' },
      { id: 'selectAll', text: 'Select All', action: 'selectAll:', shortcut: 'a' },
    ],
  },
  {
    id: 'view',
    text: 'View',
    menuItems: [
      { id: 'fullscreen', text: 'Toggle Full Screen', action: 'toggleFullScreen:', shortcut: 'f' },
    ],
  },
  {
    id: 'window',
    text: 'Window',
    menuItems: [
      { id: 'minimize', text: 'Minimize', action: 'performMiniaturize:', shortcut: 'm' },
      { id: 'zoom', text: 'Zoom', action: 'performZoom:' },
    ],
  },
]

events.on('ready', async () => {
  await neuWindow.setMainMenu(menu)
  await neuWindow.focus()
})
