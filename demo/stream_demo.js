// const { Readable, Writable } = require('stream')
// const fs = require('fs')
//     // const r = fs.createReadStream('./error.js')
//     // const w = fs.createWriteStream('./writedata.js')

// class SomeReadableStream extends Readable {
//     constructor(opts) {
//         super(opts)
//         this.data = Array.from('abcdefghijklmnopqrstuvwxyz')
//     }
//     _read(size) {
//         let r = ''
//         for (let i = 0; i < size; i++) {
//             let single = this.data.shift()
//             if (!single) break
//             else r += single
//         }
//         this.push(Buffer.from(r))
//     }
// }
// class SomeWritableStream extends Writable {
//     constructor(opts) {
//         super(opts)
//     }
//     _write(chunk, encoding, cb) {
//         console.log(chunk.toString('utf-8'))
//         cb(null)
//     }
// }
// const someReadableStream = new SomeReadableStream({ highWaterMark: 10 })
// const someWritableStream = new SomeWritableStream()

// // let chunk
// // while ((chunk = someReadableStream.read(10)) !== null) {
// //     someWritableStream.write(chunk)
// // }
// someReadableStream.on('data', (buf) => {
//     someWritableStream.write(buf)
// })





const http = require('http')
const server = http.createServer()

server.on('request', (incomingMsg, res) => {

    let count = 0

    let anotherRequest = http.request({
        url: 'http://fexuy.com',
        method: incomingMsg.method,
        path: incomingMsg.url,
        headers: incomingMsg.headers,
    }, (anotherRes) => {
        anotherRes.pipe(res)
    })

    incomingMsg.pipe(anotherRequest)

    incomingMsg.on('data', (buf) => {
        console.log(count++)
    })

    res.end()
})

server.listen(8082)