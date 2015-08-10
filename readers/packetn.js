/**
 * Created by tdzl2_000 on 2015-08-05.
 */
"use strict";

function PacketNLE(read, byteOfLen, maxLength){
    var length = 0;
    var buf = new Buffer(0);

    function readPacket(cb){
        while (length <= 0 && buf.length >= byteOfLen){
            length = buf.readUIntLE(0, byteOfLen, true);
            buf = buf.slice(byteOfLen);
        }
        if (length > 0 && buf.length >= length){
            var ret = buf.slice(0, length);
            buf = buf.slice(length);
            return cb(ret);
        }
        read(data=>{
            buf = Buffer.concat([buf, data]);
            readPacket(cb);
        })
    }

    return readPacket;
}

exports.PacketNLE = PacketNLE;