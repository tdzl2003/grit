/**
 * Created by tdzl2_000 on 2015-08-05.
 */
"use strict";

function PacketNLE(read, byteOfLen, maxLength){
    var length = -1;
    var buf = new Buffer(0);

    function readPacket(resolve, reject){
        if (length < 0 && buf.length >= byteOfLen) {
            length = buf.readUIntLE(0, byteOfLen, true);
            buf = buf.slice(byteOfLen);
        }
        if (length == 0) {
            length = -1;
            return resolve(null);
        } else if (length > 0 && buf.length >= length) {
            let ret = buf.slice(0, length);
            buf = buf.slice(length);
            length = -1;
            return resolve(ret);
        }
        read().then(data=>{
            buf = Buffer.concat([buf, data]);
            readPacket(resolve, reject)
        }, err=>reject(err));
    }

    return cb=>{
        var ret = new Promise(readPacket);
        if (cb){
            ret.then((v)=> cb(null, v), (e)=>cb(e));
        }
        return ret;
    };
}
PacketNLE.wrap = function(byteOfLen, maxLength){
    return read=>PacketNLE(read, byteOfLen, maxLength);
}

exports.PacketNLE = PacketNLE;