/**
 * Created by tdzl2_000 on 2015-08-31.
 */
"use strict";

var assert = require("assert");

function WebsocketReader(stream){
    let closed;

    let bufferSize = 0;
    let buffer = [];
    let waiting = null;
    stream.pause();

    stream.on('message', function(m){
        if (m.type == 'utf8'){
            m = m.utf8Data;
        } else if (m.type == 'binary') {
            m = m.binaryData;
        }
        if (waiting){
            let p = waiting;
            waiting = null;
            p && p(null, m);
        } else {
            bufferSize += m.length;
            buffer.push(Promise.resolve(m));
            stream.pause();
        }
    })
    function read(){
        if (closed){
            return Promise.reject(closed);
        }
        if (buffer.length){
            let p = buffer.shift();
            p.then(function(buf){
                bufferSize -= m.length;
            });
            return p;
        }
        assert(waiting == null);
        return new Promise((resolve, reject) => {
            waiting = (err, data) => err?reject(err):resolve(data);
            stream.resume();
        });
    }
    function onClose(){
        closed = closed || new Error("Stream closed");
        let p = waiting;
        waiting = null;
        p && p(closed);
    }
    stream.on('close', onClose);
    stream.on('error', onClose);

    return cb=>{
        var ret = read();
        if (cb){
            ret.then((v)=> cb(null, v), (e)=>cb(e));
        }
        return ret;
    }
}
module.exports = WebsocketReader;
