/**
 * Created by tdzl2_000 on 2015-08-05.
 */
"use strict";

var net = require("net");
var events = require("events");
var StreamReader = require("../readers/stream-reader");

var http = require("http");
var WebSocketServer = require('websocket').server;


class Server extends events.EventEmitter
{
    constructor(options){
        super();
        this.options = options;

        this.listens = [];
        this.wslistens = [];
        this._processing = 0;

        if (options && options.sessionFactory){
            this.sessionFactory = options.sessionFactory;
        }

        if (options && options.process) {
            this._process = options.process;
        }
    }
    listen(port, address, options){
        let readerTransformers = options.readerTransformers || [options.readerTransformer];
        let writerTransformers = options.writerTransformers || [options.writerTransformer];
        let looper = options.looper;

        return new Promise((resolver, reject)=>{
            let server = net.createServer(c => {

                var reader = c;
                for (let i = 0; i < readerTransformers.length; i++){
                    reader = readerTransformers[i](reader);
                }
                var writer = c;
                for (let i = 0; i < writerTransformers.length; i++){
                    writer = writerTransformers[i](writer);
                }
                this._onConnection(c, reader, writer, looper);
            });
            this.listens.push(server);

            server.on('error', e=> {
                reject && reject(e);
                this.removeListen(server);
            });
            server.listen(port, address, ()=>{
                reject = null;  // to release reference.
                resolver(server)
            });
        })
    }
    _originIsAllowed(origin){
        return true;
    }
    listenWS(port, address, options){
        let readerTransformers = options.readerTransformers || [options.readerTransformer];
        let writerTransformers = options.writerTransformers || [options.writerTransformer];
        let looper = options.looper;

        return new Promise((resolver, reject)=>{
            let httpserver = http.createServer((req, resp)=> {
                resp.writeHead(404);
                resp.end();
            });
            let server = new WebSocketServer({
                httpServer: httpserver,
                autoAcceptConnections: false
            });
            server.on('request', (r)=>{
                if (!this._originIsAllowed(r.origin)){
                    r.reject();
                    return;
                }
                var c = r.accept(null, r.origin);
                var reader = c;
                for (let i = 0; i < readerTransformers.length; i++){
                    reader = readerTransformers[i](reader);
                }
                var writer = c;
                for (let i = 0; i < writerTransformers.length; i++){
                    writer = writerTransformers[i](writer);
                }
                this._onConnection(c, reader, writer, looper);
            })

            this.listens.push(httpserver);
            this.wslistens.push(server);

            httpserver.on('error', e=> {
                reject && reject(e);
                this.removeListen(server);
                this.removeWSListen(httpserver);
            });
            httpserver.listen(port, address, ()=>{
                reject = null;  // to release reference.
                resolver(httpserver)
            });
        })
    }
    close(){
        this.listens.forEach(v=>v.close());
        this.listens = [];
        this.wslistens.forEach(v=>v.shutDown());
        this.wslistens = [];
    }
    removeListen(l){
        this.listens = this.listens.filter(v=>v!=l);
    }
    removeWSListen(l){
        this.wslistens = this.wslistens.filter(v=>v!=l);
    }
    _onConnection(c, reader, writer, looper){
        var session = this.sessionFactory(reader, writer);
        looper(session, reader, writer, (sess, req, resp)=>this.process(sess, req, resp))
            .catch(e=>{
                if (e.message != 'Stream closed') {
                    console.log(e.stack);
                }
                c.destroy();
            })
    }
    process(sess, req, write){
        //TODO: limit max processnig request.
        this._processing ++;
        return this._process(sess, req, write).then(()=>{
            this.onJobDone();
        }).catch(e=>{
            console.error(e.stack);
            this.onJobDone();
        });
    }
    isIdle(){
        return this._processing == 0;
    }
    onJobDone(){
        if (--this._processing == 0){
            this.emit('idle');
        }
    }
    _process(sess, req, write){
        return Promise.resolve();
    }
    sessionFactory(){
        return {};
    }
}

module.exports = Server;