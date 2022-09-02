const express = require('express')
const { resolve } = require('path')
const app = express()
const port = 3000

const { loadPlayer } = require('rtsp-relay/browser')
const { proxy, scriptUrl } = require('rtsp-relay')(app)

const handler = proxy({
  url: `rtsp://artem:artem12345@10.0.1.15:554/Streaming/channels/501`,
  // if your RTSP stream need credentials, include them in the URL as above
  verbose: false,
});

// the endpoint our RTSP uses
app.ws('/api/stream', handler);

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
    <body>
      <div>
        <canvas id='canvas'></canvas>
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

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})