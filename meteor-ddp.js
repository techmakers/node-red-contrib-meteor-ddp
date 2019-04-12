module.exports = function(RED) {
	function MeteorDDPConnect(config) {
		RED.nodes.createNode(this,config);
		config.session = config.session || "defaultsession" ;
		var node = this;
		node.status({});
		node.on('input', function(msg) {
			
			if (msg.config) Object.keys(msg.config).forEach(function(key){
				config[key] = msg.config[key] ;
			});
			
			var m = node.context().global.get("meteor-ddp") || {} ;
			if (m.sessions && m.sessions[config.session]) {
				console.log("already connected") ;
				return ;
			}
			DDPConnect({
				hostname : config.hostname,
				hostport : config.hostport,
				noderedsessionname : config.session,
				ssl : config.ssl,
				autoReconnect: config.autoReconnect,
				autoReconnectTimer: config.autoReconnectTimer,
				maintainCollections: config.maintainCollections
			},node) ;
		});

	}
	
	function MeteorDDPSubscribeNode (config) {
		RED.nodes.createNode(this,config);
		config.session = config.session || "defaultsession" ;
		var node = this;
		node.status(); 
		node.on('input', function(msg) {
			node.status();
			var m = node.context().global.get("meteor-ddp") || {} ;
			if (!m.sessions) return ;
			var ddpclient = m.sessions[config.session] ;
			if (!ddpclient) {
				node.warn("ddp session expired",config.session) ;
				return ;
			}
			if (node.sub){
				ddpclient.unsubscribe(node.sub._id) ;
			}
			if (!node.onMessage) {
				node.onMessage = function (ddpmessage) {
					var message = ddpclient.EJSON.parse(ddpmessage);
					if (config.collectionname == message.collection){
						if (['added','changed','removed'].indexOf(message.msg) === -1) return ;
						msg.payload = message ;
						node.send([msg]) ;
					}
				}
				ddpclient.on('message', node.onMessage);
			};
			node.sub = {} ;
			node.status({fill:"yellow",shape:"ring",text:"Subscribing..."});
			node.sub._id = ddpclient.subscribe(config.publishname || msg.topic,[msg.payload || {}],function(){
				node.status({fill:"green",shape:"ring",text:"Subscribed"});
				if (config.collectionname) {
					msg.payload = ddpclient.collections[config.collectionname]; 
					node.send([null,msg]) ;
				}
			});
		});
	}
	
	function MeteorDDPMethodCallNode(config) {
		RED.nodes.createNode(this,config);
		config.session = config.session || "defaultsession" ;
		var node = this;
		node.on('input', function(msg) {
			node.status({}) ;
			var m = node.context().global.get("meteor-ddp") || {} ;
			if (!m.sessions) return ;
			var ddpclient = m.sessions[config.session] ;
			if (!ddpclient) {
				node.warn("ddp session expired",config.session) ;
				return ;
			}
			msg.topic = msg.topic || config.methodname ;
			node.status({fill:"yellow",shape:"ring",text:"Calling..."});
			ddpclient.call(msg.topic, [msg.payload], function (err, result) {
				if (err) {
					node.status({fill:"red",shape:"ring",text:"Error"});
					return node.error(err);
				}
				node.status({fill:"green",shape:"ring",text:"Called"});
				msg.payload = result ;
				node.send([msg]) ;
			},function(){
				node.status({fill:"green",shape:"ring",text:"Updated"});
				msg.payload = "updated" ;
				node.send([null,msg])
			});
		});
	}
	
	function MeteorDDPClose(config) {
		RED.nodes.createNode(this,config);
		config.session = config.session || "defaultsession" ;
		var node = this;
		node.on('input', function(msg) {
			var m = node.context().global.get("meteor-ddp") || {} ;
			if (!m.sessions) return ;
			var ddpclient = m.sessions[config.session] ;
			if (!ddpclient) {
				node.warn("ddp session expired",config.session) ;
				return ;
			}
			ddpclient.close();
			delete(m.sessions[config.session]) ;
			node.context().global.set("meteor-ddp",m) ;
			msg.payload = {success:true} ;
			node.send(msg) ;
		});
	}
	
	
	function DDPConnect(ddpconfig,nodeInstance) {
		var DDPClient = require("ddp");
		ddpclient = new DDPClient({
			host: ddpconfig.hostname || "localhost",
			port: ddpconfig.hostport || 3000,
			ssl: ddpconfig.ssl || false,
			autoReconnect: ddpconfig.autoReconnect || true,
			autoReconnectTimer: ddpconfig.autoReconnectTimer || 500,
			maintainCollections: ddpconfig.maintainCollections || true,
			ddpVersion: '1',  // ['1', 'pre2', 'pre1'] available
			// uses the SockJs protocol to create the connection
			// this still uses websockets, but allows to get the benefits
			// from projects like meteorhacks:cluster
			// (for load balancing and service discovery)
			// do not use `path` option when you are using useSockJs
			useSockJs: true//,
			// Use a full url instead of a set of `host`, `port` and `ssl`
			// do not set `useSockJs` option if `url` is used
			// url: 'wss://example.com/websocket'
		});

		ddpclient.on('message', function (payload) {
			var msg = {} ;
			msg.topic = "message" ;
			msg.payload = ddpclient.EJSON.parse(payload);
			//msg.ddpsession = ddpclient.session || msg.ddpsession || msg.payload.session ;
			nodeInstance.send([msg,null]);
		});

		ddpclient.on('socket-close', function (code, message) {
			nodeInstance.status({fill:"red",shape:"ring",text:"Socket-close"});
			nodeInstance.send([null,{topic:'socket-close',error:{code:code,message:message}}]);
		});

		ddpclient.on('socket-error', function (error) {
			nodeInstance.status({fill:"red",shape:"ring",text:"Socket-error"});
			nodeInstance.send([null,{topic:'socket-error',error:{code:code,message:message}}]);
		});
		
		nodeInstance.status({fill:"yellow",shape:"ring",text:"Connecting..."});
		ddpclient.connect(function (error, wasReconnect) {
			// If autoReconnect is true, this callback will be invoked each time
			// a server connection is re-established
			if (error) {
				nodeInstance.status({fill:"red",shape:"ring",text:"Connection error"});
				nodeInstance.error('Meteor DDP connection error: ' + error);
				nodeInstance.send([null,{topic:'connection-error',error:error}]);
				return;
			}

			if (wasReconnect) {
				nodeInstance.send([null,{topic:'connected', payload:{wasReconnect:true}}]);
			} else {
				nodeInstance.send([null,{topic:'connected'}]);
			}
			
			var m = nodeInstance.context().global.get("meteor-ddp") || {sessions:{}} ;
			m.sessions[ddpconfig.noderedsessionname] = ddpclient ;
			nodeInstance.context().global.set("meteor-ddp",m) ;
			
			nodeInstance.status({fill:"green",shape:"ring",text:"Connected"});

		});
		
		return ddpclient ;
	}
	
	RED.nodes.registerType("meteor-ddp-connect",MeteorDDPConnect);
	RED.nodes.registerType("meteor-ddp-subscribe", MeteorDDPSubscribeNode) ;
	RED.nodes.registerType("meteor-ddp-call", MeteorDDPMethodCallNode) ;
	RED.nodes.registerType("meteor-ddp-close", MeteorDDPClose) ;

}


