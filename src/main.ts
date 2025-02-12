import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import { app, events, init, os, window as neuWindow } from '@neutralinojs/lib'

init()
createApp(App).mount('#app')

function onWindowClose() {
  app.exit()
}

events.on('windowClose', onWindowClose)

neuWindow.focus()

const tray = {
  icon: '/dist/icons/trayIcon.png',
  menuItems: [
    { text: '-' }, // A separator
    { id: 'quit', text: 'Quit' },
  ],
}
os.setTray(tray)

events.on('trayMenuItemClicked', (evt) => {
  switch (evt.detail.id) {
    case 'quit':
      app.exit()
      break
  }
})
