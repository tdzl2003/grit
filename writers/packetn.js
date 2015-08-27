/**
 * Created by tdzl2_000 on 2015-08-07.
 */

"use strict";

function PacketNLE(write, byteOfLen, maxLength){
    var lenZero = new Buffer(byteOfLen);
    lenZero.writeUIntLE(0, 0, byteOfLen);

    function writePacket(buf, cb){
        if (!buf || buf.length == 0){
            return write(lenZero, cb);
        }
        if (buf.length > maxLength){
            let ret = Promise.reject(new Error("maxLength exceeded."));
            if (cb) {
                ret.catch(cb);
            }
            return ret;
        }
        var lenBuf = new Buffer(byteOfLen);
        lenBuf.writeUIntLE(buf.length, 0, byteOfLen);
        write(lenBuf);
        let ret = write(buf);
        if (cb){
            ret.then((v)=>cb(null, v), (e)=>cb(e));
        }
        return ret;
    }
    return writePacket;
}
PacketNLE.wrap = function(byteOfLen, maxLength){
    return write=>PacketNLE(write, byteOfLen, maxLength);
}

exports.PacketNLE = PacketNLE;