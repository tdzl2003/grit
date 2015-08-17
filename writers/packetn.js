/**
 * Created by tdzl2_000 on 2015-08-07.
 */

"use strict";

function PacketNLE(write, byteOfLen, maxLength){
    var lenZero = new Buffer(byteOfLen);
    lenZero.writeUIntLE(0, 0, byteOfLen);

    function writePacket(buf, cb){
        if (!buf || buf.length == 0){
            write(lenZero, cb);
            return;
        }
        if (buf.length > maxLength){
            return cb(new Error("maxLength exceeded."));
        }
        var lenBuf = new Buffer(byteOfLen);
        lenBuf.writeUIntLE(buf.length, 0, byteOfLen);
        write(lenBuf);
        write(buf, cb);
    }
    return writePacket;
}
PacketNLE.wrap = function(byteOfLen, maxLength){
    return write=>PacketNLE(write, byteOfLen, maxLength);
}

exports.PacketNLE = PacketNLE;