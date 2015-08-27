/**
 * Created by tdzl2_000 on 2015-08-05.
 */
"use strict";

function StreamReader(stream){
    var closed;
    var waiting = null;

    function read(resolve, reject){
        if (closed){
            return reject(closed);
        }

        var data = stream.read();
        if (data){
            console.log(data);
            resolve(data);
        }

        waiting = reject;
        stream.once('readable', ()=>{
            waiting = null;
            resolve(stream.read());
        });
    }
    function onClose(){
        closed = closed || new Error("Stream closed");
        waiting && waiting(closed);
        waiting = null;
    }
    stream.on('close', onClose);
    stream.on('error', onClose);
    return cb=>{
        var ret = new Promise(read);
        if (cb){
            ret.then((v)=> cb(null, v), (e)=>cb(e));
        }
        return ret;
    };
}
module.exports = StreamReader;