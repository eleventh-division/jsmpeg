const express = require('express')
const app = express()

const {loadPlayer} = require('rtsp-relay/browser')
const {proxy, scriptUrl} = require('rtsp-relay')(app)

app.ws('/api/stream/:channel', (ws, req) => {
  proxy({
      url: `rtsp://artem:artem12345@10.0.1.15:554/Streaming/channels/${req.params.channel}01`,
      // url: 'rtsp://admin:leery8bit@10.0.1.87',
      transport: "tcp"
  })(ws)
})

app.get('/', (req, res) => {
  res.send(`
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Streaming IP Camera Nodejs</title>
    </head>
    <body style="padding: 0; margin: 0">
      <div>
        <form id="frm">
            <label>Канал</label>
            <input id="channel" type="text" value="1">
            <button type="submit">Применить</button>
        </form>
        <div id="div-canvas" style="position: relative; width: 100vw; padding-bottom: 56.25%">
            <canvas id="canvas" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%"></canvas>
        </div>
        <script src='${scriptUrl}'></script>
        <script>
          async function getChannel(e) {
            e.preventDefault()
            e.stopPropagation()
            
            await loadPlayer({
                url: 'ws://' + location.host + '/api/stream/' + document.getElementById('channel').value,
                canvas: document.getElementById('canvas')
            })
          }
          
          document.getElementById('frm').onsubmit = getChannel
        </script>
      </div>
    </body>
    </html>
  `)
})

function start(port) {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
}

start(3010)
