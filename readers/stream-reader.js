/**
 * Created by tdzl2_000 on 2015-08-05.
 */
"use strict";

function StreamReader(stream, maxSize){
    var closed;
    var waiting = [];

    function onReadable(){
        let cb;
        while(waiting.length > 0){
            let data = stream.read(maxSize);
            if (data != null){
                cb = waiting.shift();
                cb(data);
            }
        }
    }
    function read(cb){
        if (closed){
            return cb(closed);
        }
        if (waiting.length){
            waiting.push(cb);
            return;
        }
        var data = stream.read(maxSize);
        if (data){
            return cb(null, data);
        }
        waiting.push(cb);
        stream.once('readable', onReadable);
    }
    stream.on('close', function(){
        closed = new Error("Stream closed");
        waiting.forEach(cb=>cb(closed));
    })
    return read;
}
module.exports = StreamReader;