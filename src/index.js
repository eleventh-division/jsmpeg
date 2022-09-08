const express = require('express')
const app = express()

const {loadPlayer} = require('rtsp-relay/browser')
const {proxy, scriptUrl} = require('rtsp-relay')(app)

app.ws('/api/stream', (ws, req) => {
  // console.log(req.query)
  // rtsp://artem:artem12345@10.0.1.15:554/Streaming/channels/101

  proxy({
    // url: `rtsp://artem:artem12345@10.0.1.15:554/Streaming/channels/${req.params.channel}01`,
    // url: 'rtsp://admin:leery8bit@10.0.1.87',
    url: req.query.url,
    transport: "tcp"
  })(ws)
})

// rtsp://admin:Tosh123456@172.18.3.20:554/cam/realmonitor?channel=1&subtype=1
// rtsp://artem:artem12345@10.0.1.15:554/Streaming/channels/101
// rtsp://admin:leery8bit@10.0.1.39

app.get('/', (req, res) => {
  res.send(`
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Streaming IP Camera Nodejs</title>
    </head>
    <body style="
        padding: 0;
        margin: 0;
        font-family: Roboto, Helvetica, Arial, sans-serif;
    ">
      <div>
        <form id="frm" style="
            padding: 16px;
            display: flex;
            justify-content: center;
            gap: 8px;
        ">
            <label>Ссылка</label>
            <input style="flex: 1" id="url" type="text" placeholder="rtsp://...">
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

            const url = encodeURIComponent(document.getElementById('url').value)
            
            await loadPlayer({
              url: 'ws://' + location.host + '/api/stream/?url=' + url,
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
