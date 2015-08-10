/**
 * Created by tdzl2_000 on 2015-08-07.
 */

"use strict";
var process = require("process");

function PacketNLE(write, byteOfLen){
    function writePacket(buf, cb){
        if (buf.length == 0){
            return process.nextTick(cb);
        }
        var lenBuf = new Buffer(byteOfLen);
        lenBuf.writeUIntLE(buf.length, 0, byteOfLen);
        write(lenBuf);
        write(buf, byteOfLen, cb);
    }
}

exports.PacketNLE = PacketNLE;