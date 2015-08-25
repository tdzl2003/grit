/**
 * Created by tdzl2_000 on 2015-08-05.
 */
"use strict";

function PacketNLE(read, byteOfLen, maxLength){
    var length = -1;
    var buf = new Buffer(0);

    function readPacket(cb){
        if (length < 0 && buf.length >= byteOfLen){
            length = buf.readUIntLE(0, byteOfLen, true);
            buf = buf.slice(byteOfLen);
        }
        if (length == 0){
            length = -1;
            return cb(null, null);
        } else if (length > 0 && buf.length >= length){
            let ret = buf.slice(0, length);
            buf = buf.slice(length);
            length = -1;
            return cb(null, ret);
        }
        read((err, data)=>{
            if (err){
                return cb(err);
            }
            buf = Buffer.concat([buf, data]);
            readPacket(cb);
        })
    }

    return readPacket;
}
PacketNLE.wrap = function(byteOfLen, maxLength){
    return read=>PacketNLE(read, byteOfLen, maxLength);
}

exports.PacketNLE = PacketNLE;