const {WebcastPushConnection} = require('tiktok-live-connector')
const {EventLimitter} = require('events')

let globalConnectionCount = 0

class TiktokConnectionWrapper extends EventLimitter{
    constructor(uniqueId, options, enableLog){
        super();

        this.uniqueId = uniqueId;
        this.enableLog = enableLog;
        
        //connection state
        this.clientDisconnected = false;
        this.reconnectEnabled = true;
        this.reconnectCount = 0;
        this.reconnectWaitMs = 1000;
        this.maxReconnectAttemps = 5;

        this.connection = new WebcastPushConnection(uniqueId, options);

        this.connection.on('streamEnd',() => {
            this.enableLog(`streamEnd event recevied, giving up connection`);
            this.reconnectEnabled = false;
        });

        this.connection.on('disconnect', ()=> {
            globalConnectionCount -= 1;
            this.log(`Tiktok connection disconnect`);
            this.
        });
    }

    connect(isReconnect){

    this.connection.connect().then((state)=>{

        this.log(`${isReconnect ? 'Reconnected' : 'Connected'} to room id ${state.roomId}, websocket:${state.upgradeToWebsocket}`);
        globalConnectionCount += 1;

        // STOP DULU KARNA UDAH MALEM 
    });
    }

    scheduleRecconect(reason){
        if(!this.reconnectEnabled){
            return;
        }

        if(this.reconnectCount >= this.maxReconnectAttemps){
            this.log(`Give up connection, max reconnect attemps`);
            this.emit('disconnect', `connection lost.${reason}`);
        }
        this.log(`Try reconnect in. ${this.reconnectWaitMs}`);

        setTimeout(()=> {
            if(!this.reconnectEnabled || this.reconnectCount >= this.maxReconnectAttemps){
                return;
            }
            this.reconnectCount += 1;
            this.reconnectWaitMs *= 2;
            this.connect(true);
        },this.reconnectWaitMs);
    }



    disconnect(){
        this.log(`Client connection disconnect`);

        this.clientDisconnected =true;
        this.reconnectEnabled =false;

        if(this.connection.getState().isConnected){
            this.connection.disconnect();
        }


    }

    log(logString){
        if(this.enableLog){
           console.log(`Wrapper ${this.uniqueId}:${this.logString}`);
            }
        }
    
}