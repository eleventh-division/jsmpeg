const express = require('express')
const app = express()
require('express-ws')(app)

const {loadPlayer} = require('rtsp-relay/browser')
const {proxy, scriptUrl} = require('rtsp-relay')(app)

const handler = proxy({
  url: `rtsp://artem:artem12345@10.0.1.15:554/Streaming/channels/501`,
  verbose: false,
  transport: 'tcp'
})

app.ws('/api/stream', handler)

app.get('/api', (req, res) => {
  if (!req?.query?.channel) {
    res.status(400).json({ message: "Fuck you!" })
    return
  }

  const channel = req.query.channel

  const url = `rtsp://artem:artem12345@10.0.1.15:554/Streaming/channels/${ channel }01`
  // TODO change handler
  res.json({ message: 'ok' })
})

// this is an example html page to view the stream
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
        <div style="position: relative; width: 100vw; padding-bottom: 56.25%">
            <canvas id='canvas' style="position: absolute; left: 0; top: 0; width: 100%; height: 100%"></canvas>
        </div>
        <script src='${scriptUrl}'></script>
        <script>
          loadPlayer({
            url: 'ws://' + location.host + '/api/stream',
            canvas: document.getElementById('canvas')
          });
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
