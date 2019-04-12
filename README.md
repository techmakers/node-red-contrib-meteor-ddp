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
		"id": "f7652c36.b25e9",
		"type": "tab",
		"label": "Flow 1",
		"disabled": false,
		"info": ""
	},
	{
		"id": "e60d74cd.281948",
		"type": "meteor-ddp-subscribe",
		"z": "f7652c36.b25e9",
		"publishname": "list",
		"collectionname": "list",
		"session": "",
		"x": 390,
		"y": 200,
		"wires": [
			[
				"679f3ba3.554514"
			],
			[
				"7a56e053.0ff5"
			]
		]
	},
	{
		"id": "1c66f182.21d14e",
		"type": "meteor-ddp-call",
		"z": "f7652c36.b25e9",
		"methodname": "",
		"session": "",
		"x": 420,
		"y": 320,
		"wires": [
			[
				"d4b9fda6.7df12"
			],
			[
				"9c82eaae.a461b8"
			]
		]
	},
	{
		"id": "d4b9fda6.7df12",
		"type": "debug",
		"z": "f7652c36.b25e9",
		"name": "method executed",
		"active": true,
		"tosidebar": true,
		"console": false,
		"tostatus": false,
		"complete": "true",
		"x": 690,
		"y": 300,
		"wires": []
	},
	{
		"id": "679f3ba3.554514",
		"type": "debug",
		"z": "f7652c36.b25e9",
		"name": "subscribe events",
		"active": true,
		"tosidebar": true,
		"console": false,
		"tostatus": false,
		"complete": "payload",
		"x": 690,
		"y": 180,
		"wires": []
	},
	{
		"id": "8454a0f0.811b5",
		"type": "debug",
		"z": "f7652c36.b25e9",
		"name": "ddp1",
		"active": false,
		"tosidebar": true,
		"console": false,
		"tostatus": false,
		"complete": "true",
		"x": 650,
		"y": 60,
		"wires": []
	},
	{
		"id": "5a5efcd9.1b6f84",
		"type": "debug",
		"z": "f7652c36.b25e9",
		"name": "ddp2",
		"active": true,
		"tosidebar": true,
		"console": false,
		"tostatus": false,
		"complete": "true",
		"x": 650,
		"y": 100,
		"wires": []
	},
	{
		"id": "7583223c.79fabc",
		"type": "inject",
		"z": "f7652c36.b25e9",
		"name": "",
		"topic": "",
		"payload": "",
		"payloadType": "date",
		"repeat": "",
		"crontab": "",
		"once": true,
		"onceDelay": "1",
		"x": 150,
		"y": 80,
		"wires": [
			[
				"99909caa.4771f"
			]
		]
	},
	{
		"id": "c6225fdf.d3631",
		"type": "inject",
		"z": "f7652c36.b25e9",
		"name": "",
		"topic": "",
		"payload": "{\"name\":\"Ciao\"}",
		"payloadType": "json",
		"repeat": "",
		"crontab": "",
		"once": false,
		"onceDelay": 0.1,
		"x": 160,
		"y": 180,
		"wires": [
			[
				"e60d74cd.281948"
			]
		]
	},
	{
		"id": "3166c640.5ec5da",
		"type": "inject",
		"z": "f7652c36.b25e9",
		"name": "",
		"topic": "addToList",
		"payload": "{\"name\":\"Carletto\"}",
		"payloadType": "json",
		"repeat": "",
		"crontab": "",
		"once": false,
		"onceDelay": 0.1,
		"x": 200,
		"y": 320,
		"wires": [
			[
				"1c66f182.21d14e"
			]
		]
	},
	{
		"id": "99909caa.4771f",
		"type": "meteor-ddp-connect",
		"z": "f7652c36.b25e9",
		"hostname": "",
		"hostport": 3000,
		"session": "",
		"ssl": false,
		"x": 440,
		"y": 80,
		"wires": [
			[
				"8454a0f0.811b5"
			],
			[
				"5a5efcd9.1b6f84"
			]
		]
	},
	{
		"id": "b2dadc9b.20ae3",
		"type": "inject",
		"z": "f7652c36.b25e9",
		"name": "",
		"topic": "",
		"payload": "{\"name\":\"Carletto\"}",
		"payloadType": "json",
		"repeat": "",
		"crontab": "",
		"once": false,
		"onceDelay": 0.1,
		"x": 170,
		"y": 220,
		"wires": [
			[
				"e60d74cd.281948"
			]
		]
	},
	{
		"id": "7a56e053.0ff5",
		"type": "debug",
		"z": "f7652c36.b25e9",
		"name": "subscribe collection",
		"active": true,
		"tosidebar": true,
		"console": false,
		"tostatus": false,
		"complete": "payload",
		"x": 700,
		"y": 220,
		"wires": []
	},
	{
		"id": "9c82eaae.a461b8",
		"type": "debug",
		"z": "f7652c36.b25e9",
		"name": "method effect on data completed",
		"active": true,
		"tosidebar": true,
		"console": false,
		"tostatus": false,
		"complete": "true",
		"x": 740,
		"y": 340,
		"wires": []
	},
	{
		"id": "67ac7a39.9090d4",
		"type": "meteor-ddp-close",
		"z": "f7652c36.b25e9",
		"session": "",
		"x": 430,
		"y": 420,
		"wires": [
			[
				"8561f38a.aa7bf"
			]
		]
	},
	{
		"id": "e5866700.83f1b8",
		"type": "inject",
		"z": "f7652c36.b25e9",
		"name": "",
		"topic": "",
		"payload": "",
		"payloadType": "date",
		"repeat": "",
		"crontab": "",
		"once": false,
		"onceDelay": 0.1,
		"x": 140,
		"y": 420,
		"wires": [
			[
				"67ac7a39.9090d4"
			]
		]
	},
	{
		"id": "8561f38a.aa7bf",
		"type": "debug",
		"z": "f7652c36.b25e9",
		"name": "close",
		"active": true,
		"tosidebar": true,
		"console": false,
		"tostatus": false,
		"complete": "payload",
		"x": 650,
		"y": 420,
		"wires": []
	}
]
```