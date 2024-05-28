import './app.css'
import './styles/_material.scss'
import './styles/_variables.scss'
import App from './App.svelte'

// if (import.meta.env.MODE == 'production') {
//   console.log = function() {};
// }

const app = new App({
  target: document.getElementById('app'),
})

export default app
