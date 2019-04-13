# NODE-RED DDP

A suite of Node-Red nodes for communicate with DDP servers

## Example Meteor application

2. download if needed [MeteorJS](https://www.meteor.com/)
3. enter a desired directory
4. create a Meteor Application with the command ```meteor create myexample``` and enter the directory with ```cd myexample```
5. edit the file in myexample/server/main.js to obtain something like that

```
import { Meteor } from 'meteor/meteor';

var list = new Mongo.Collection("list") ;

Meteor.publish("list",function(params){
	console.log("Params",params) ;
	return list.find(params) ;
})

Meteor.methods({"addToList":function(params){
	console.log("Method addToList",params) ;
	return list.insert(params) ;
}});

Meteor.startup(() => {
	// code to run on server at startup
	list.insert({
		name:'Ciao',
		addedOn: new Date() 
	})
});
```

6. now you can run the Meteor application with command ```meteor```


## Example flow

Import the following flow in Node-red and test every Meteor DDP Node.

```
[
	{
		"id": "ebdf300b.cfe4",
		"type": "tab",
		"label": "Flow 1",
		"disabled": false,
		"info": ""
	},
	{
		"id": "2093cb21.c70964",
		"type": "meteor-ddp-subscribe",
		"z": "ebdf300b.cfe4",
		"publishname": "list",
		"collectionname": "list",
		"session": "",
		"x": 570,
		"y": 200,
		"wires": [
			[
				"1e8d3688.9c6779"
			],
			[
				"1103e8dd.09eed7"
			]
		]
	},
	{
		"id": "1e8d3688.9c6779",
		"type": "debug",
		"z": "ebdf300b.cfe4",
		"name": "subscribe events",
		"active": false,
		"tosidebar": true,
		"console": false,
		"tostatus": false,
		"complete": "payload",
		"x": 870,
		"y": 180,
		"wires": []
	},
	{
		"id": "25e0ccb0.1e7714",
		"type": "debug",
		"z": "ebdf300b.cfe4",
		"name": "ddp1",
		"active": false,
		"tosidebar": true,
		"console": false,
		"tostatus": false,
		"complete": "true",
		"x": 830,
		"y": 60,
		"wires": []
	},
	{
		"id": "3fbca72.285ff58",
		"type": "debug",
		"z": "ebdf300b.cfe4",
		"name": "ddp2",
		"active": true,
		"tosidebar": true,
		"console": false,
		"tostatus": false,
		"complete": "true",
		"x": 830,
		"y": 100,
		"wires": []
	},
	{
		"id": "2fd1e4a.c91a11c",
		"type": "inject",
		"z": "ebdf300b.cfe4",
		"name": "",
		"topic": "",
		"payload": "",
		"payloadType": "str",
		"repeat": "",
		"crontab": "",
		"once": true,
		"onceDelay": "1",
		"x": 90,
		"y": 80,
		"wires": [
			[
				"9d98ba64.e58d48"
			]
		]
	},
	{
		"id": "9d98ba64.e58d48",
		"type": "meteor-ddp-connect",
		"z": "ebdf300b.cfe4",
		"hostname": "",
		"hostport": 3000,
		"session": "",
		"ssl": false,
		"x": 620,
		"y": 80,
		"wires": [
			[
				"25e0ccb0.1e7714"
			],
			[
				"3fbca72.285ff58"
			]
		]
	},
	{
		"id": "e2961460.8ff638",
		"type": "inject",
		"z": "ebdf300b.cfe4",
		"name": "",
		"topic": "",
		"payload": "{\"name\":\"Adam\"}",
		"payloadType": "json",
		"repeat": "",
		"crontab": "",
		"once": false,
		"onceDelay": 0.1,
		"x": 120,
		"y": 200,
		"wires": [
			[
				"2093cb21.c70964",
				"d6d58b8e.9fb068"
			]
		]
	},
	{
		"id": "1103e8dd.09eed7",
		"type": "debug",
		"z": "ebdf300b.cfe4",
		"name": "subscribe collection",
		"active": false,
		"tosidebar": true,
		"console": false,
		"tostatus": false,
		"complete": "payload",
		"x": 880,
		"y": 220,
		"wires": []
	},
	{
		"id": "f728b1b1.f4017",
		"type": "meteor-ddp-close",
		"z": "ebdf300b.cfe4",
		"session": "",
		"x": 610,
		"y": 780,
		"wires": [
			[
				"a81ad964.600078"
			]
		]
	},
	{
		"id": "ed366849.9396d8",
		"type": "inject",
		"z": "ebdf300b.cfe4",
		"name": "",
		"topic": "",
		"payload": "",
		"payloadType": "str",
		"repeat": "",
		"crontab": "",
		"once": false,
		"onceDelay": 0.1,
		"x": 90,
		"y": 780,
		"wires": [
			[
				"f728b1b1.f4017"
			]
		]
	},
	{
		"id": "a81ad964.600078",
		"type": "debug",
		"z": "ebdf300b.cfe4",
		"name": "close",
		"active": true,
		"tosidebar": true,
		"console": false,
		"tostatus": false,
		"complete": "payload",
		"x": 830,
		"y": 780,
		"wires": []
	},
	{
		"id": "d6d58b8e.9fb068",
		"type": "meteor-ddp-observe",
		"z": "ebdf300b.cfe4",
		"criteria": "",
		"session": "",
		"collectionname": "list",
		"x": 620,
		"y": 360,
		"wires": [
			[
				"473f5306.6341ec"
			],
			[
				"d166bfcc.9d14a"
			],
			[
				"226c7969.4950f6"
			]
		]
	},
	{
		"id": "473f5306.6341ec",
		"type": "debug",
		"z": "ebdf300b.cfe4",
		"name": "Added to list",
		"active": true,
		"tosidebar": true,
		"console": false,
		"tostatus": false,
		"complete": "payload",
		"x": 850,
		"y": 320,
		"wires": []
	},
	{
		"id": "d166bfcc.9d14a",
		"type": "debug",
		"z": "ebdf300b.cfe4",
		"name": "Changed in list",
		"active": true,
		"tosidebar": true,
		"console": false,
		"tostatus": false,
		"complete": "payload",
		"x": 860,
		"y": 360,
		"wires": []
	},
	{
		"id": "226c7969.4950f6",
		"type": "debug",
		"z": "ebdf300b.cfe4",
		"name": "Removed from list",
		"active": true,
		"tosidebar": true,
		"console": false,
		"tostatus": false,
		"complete": "payload",
		"x": 870,
		"y": 400,
		"wires": []
	},
	{
		"id": "555cdaf3.cd2454",
		"type": "inject",
		"z": "ebdf300b.cfe4",
		"name": "",
		"topic": "",
		"payload": "false",
		"payloadType": "bool",
		"repeat": "",
		"crontab": "",
		"once": false,
		"onceDelay": 0.1,
		"x": 90,
		"y": 360,
		"wires": [
			[
				"d6d58b8e.9fb068",
				"2093cb21.c70964"
			]
		]
	},
	{
		"id": "319f8a95.3483e6",
		"type": "meteor-ddp-call",
		"z": "ebdf300b.cfe4",
		"methodname": "",
		"session": "",
		"x": 600,
		"y": 540,
		"wires": [
			[
				"6ccfe8fc.1a7398"
			],
			[
				"3ededb9b.57def4"
			]
		]
	},
	{
		"id": "6ccfe8fc.1a7398",
		"type": "debug",
		"z": "ebdf300b.cfe4",
		"name": "method executed",
		"active": true,
		"tosidebar": true,
		"console": false,
		"tostatus": false,
		"complete": "true",
		"x": 870,
		"y": 520,
		"wires": []
	},
	{
		"id": "4f37815a.f8ec4",
		"type": "inject",
		"z": "ebdf300b.cfe4",
		"name": "",
		"topic": "add",
		"payload": "{\"name\":\"Adam\"}",
		"payloadType": "json",
		"repeat": "",
		"crontab": "",
		"once": false,
		"onceDelay": 0.1,
		"x": 140,
		"y": 420,
		"wires": [
			[
				"319f8a95.3483e6"
			]
		]
	},
	{
		"id": "3ededb9b.57def4",
		"type": "debug",
		"z": "ebdf300b.cfe4",
		"name": "method effect on data completed",
		"active": true,
		"tosidebar": true,
		"console": false,
		"tostatus": false,
		"complete": "true",
		"x": 920,
		"y": 560,
		"wires": []
	},
	{
		"id": "3e4e54e.b4fecac",
		"type": "inject",
		"z": "ebdf300b.cfe4",
		"name": "",
		"topic": "update",
		"payload": "Adam",
		"payloadType": "str",
		"repeat": "",
		"crontab": "",
		"once": false,
		"onceDelay": 0.1,
		"x": 110,
		"y": 520,
		"wires": [
			[
				"defdbf70.eb8ff"
			]
		]
	},
	{
		"id": "bc41842f.31b608",
		"type": "inject",
		"z": "ebdf300b.cfe4",
		"name": "",
		"topic": "remove",
		"payload": "{\"name\":\"Adam\"}",
		"payloadType": "json",
		"repeat": "",
		"crontab": "",
		"once": false,
		"onceDelay": 0.1,
		"x": 150,
		"y": 620,
		"wires": [
			[
				"319f8a95.3483e6"
			]
		]
	},
	{
		"id": "a5dd904b.f5047",
		"type": "inject",
		"z": "ebdf300b.cfe4",
		"name": "",
		"topic": "",
		"payload": "{\"name\":\"Eve\"}",
		"payloadType": "json",
		"repeat": "",
		"crontab": "",
		"once": false,
		"onceDelay": 0.1,
		"x": 120,
		"y": 280,
		"wires": [
			[
				"2093cb21.c70964",
				"d6d58b8e.9fb068"
			]
		]
	},
	{
		"id": "f0cb08e5.7ad788",
		"type": "inject",
		"z": "ebdf300b.cfe4",
		"name": "",
		"topic": "add",
		"payload": "{\"name\":\"Eve\"}",
		"payloadType": "json",
		"repeat": "",
		"crontab": "",
		"once": false,
		"onceDelay": 0.1,
		"x": 130,
		"y": 460,
		"wires": [
			[
				"319f8a95.3483e6"
			]
		]
	},
	{
		"id": "5cb57dd2.eaa604",
		"type": "inject",
		"z": "ebdf300b.cfe4",
		"name": "",
		"topic": "remove",
		"payload": "{\"name\":\"Eve\"}",
		"payloadType": "json",
		"repeat": "",
		"crontab": "",
		"once": false,
		"onceDelay": 0.1,
		"x": 140,
		"y": 660,
		"wires": [
			[
				"319f8a95.3483e6"
			]
		]
	},
	{
		"id": "defdbf70.eb8ff",
		"type": "function",
		"z": "ebdf300b.cfe4",
		"name": "Criteria and Modifier",
		"func": "msg.payload = {\n    \"criteria\":{\"name\":msg.payload},\n    \"modifier\":{\"$inc\":{\"age\":1}}\n}\nreturn msg;",
		"outputs": 1,
		"noerr": 0,
		"x": 320,
		"y": 540,
		"wires": [
			[
				"319f8a95.3483e6"
			]
		]
	},
	{
		"id": "9f1f4298.0e96e",
		"type": "inject",
		"z": "ebdf300b.cfe4",
		"name": "",
		"topic": "update",
		"payload": "Eve",
		"payloadType": "str",
		"repeat": "",
		"crontab": "",
		"once": false,
		"onceDelay": 0.1,
		"x": 110,
		"y": 560,
		"wires": [
			[
				"defdbf70.eb8ff"
			]
		]
	}
]
```