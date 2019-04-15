# NODE-RED DDP CLIENT

A suite of Node-Red nodes for communicate with MeteorJS DDP servers.

MeteorJS is a great Javascript framework, it's reactivity model is very interesting for IoT applications, but it can't run on edge devices like Raspberry PI with  no tricky compilations.

Furthermore NODE-RED runs on Raspberry PI very well, and can be used not only on these devices but in the cloud too or on desktop PC. So if you want to connect a NODE-RED flow to a MeteorJS application re-using your API with Publish and Methods you are in the right place.

Another reason we at [Techmakers](https://www.techmakers.it) developed this nodes is we want to connect to our MeteorJS developed applications with some technologies were the DDP protocol implememtation is difficult and time conuming, so we use NODE-RED as a "broker" from these tecnologies to the MeteorJS applications we distribute.

This work is a NODE-RED full implmementation of the [DDP Client NodeJS package](https://github.com/oortcloud/node-ddp-client#readme).

You can connect to one ore more MeteorJS applications, subscribe to the Meteor.publish and call the Meteor.methods from your NODE-RED flow.

Using the ```SESSION``` parameter in every node you can attach any subscribe, observe and call node to the right MeteorJS connection.

MeteorJS connections are stored in the NODE-RED global context so you can attach to the same MeteorJS connection from different NODE-RED flows.

## Installing the NODE-RED nodes

This is a standard NODE-RED contribution, the name is: ```node-red-contrib-meteor-ddp``` so the usual 

```npm install node-red-contrib-meteor-ddp``` 

will do the job. Don't forget to ```cd``` in the ```.node-red``` directory before lounching the npm install command.


## Example flow

This picture shows how the [example flow](https://github.com/techmakers/node-red-contrib-meteor-ddp/blob/master/NodeRedExampleFlow/flow.json) should appear on your NODE-RED interface.

![NODE-RED DDP NODES EXAMPLE FLOW](images/NODE-RED_DDP_NODES_EXAMPLE_FLOW.png)

## Example Meteor application

1. download if needed [MeteorJS](https://www.meteor.com/)
2. enter a desired directory
3. create a Meteor Application with the command ```meteor create myexample``` and enter the directory with ```cd myexample```
4. remove the "autopublish" package with the command ```meteor remove autopublish``` to avoid unwanted documents on the client
5. edit the file in myexample/server/main.js to obtain something like that

```
import { Meteor } from 'meteor/meteor';

var list = new Mongo.Collection("list") ;

Meteor.publish("list",function(params){
	console.log("Params",params) ;
	return list.find(params) ;
})

Meteor.methods({"add":function(params){
	return list.insert(params) ;
}});

Meteor.methods({"update":function(params){
	return list.update(params.criteria,params.modifier,{multi:true}) ;
}});

Meteor.methods({"remove":function(params){
	return list.remove(params) ;
}});

Meteor.startup(() => {
	// code to run on server at startup
	list.insert({
		name:'Ciao',
		addedOn: new Date() 
	})
});

```

6. now you can run the Meteor application with command ```meteor``` and test the example flow clicking on the left-side injections nodes.

## How to use example flow

We suggest some readings before start to play with this about the [Meteor Publish and Subscribe concepts](https://docs.meteor.com/api/pubsub.html)

1. Be sure you have the Meteor Example Application up and running on the same machine you are running node-red, otherwise, update the ```meteor-ddp-connect``` node to attach to a different server
2. Copy the [example flow](https://github.com/techmakers/node-red-contrib-meteor-ddp/blob/master/NodeRedExampleFlow/flow.json) in the clipboard
3. In your NODE-RED application, using the top-right menu icon -> import -> clipboard paste the clipboard content and select "new flow"
4. Deploy the imported flow
5. The flow automatically connects to the Meteor Example Application
6. Subscribe and observe all documents in the ```list``` collection with name equals to "Adam" by clicking on the ```{"name":"Adam"}``` node.
7. Add a document to the collection clicking on the ```add:{"name":"Adam"}``` node.
8. If everything is ok you should see on the right debug pane messages coming from the subscribe ```list``` and ```meteor-ddp-observe``` nodes.
9. You can play switching from Adam to Eve and see what appens if you add a document in the ```list``` collection with the subscribe and observe.
10. You can also try to modifiy documents in the meteor database using MongoDB commands to insert, update, remove documents and receive events on the NODE-RED flow thanks the Meteor reactivity model.

## Some words about security

MeteorJS security is usually implemented server side by limiting the access to datasets in the Meteor.publish and specifying the rules about writing in the database collection via the ```allow``` and ```deny``` collection methods: [https://docs.meteor.com/api/collections.html#Mongo-Collection-allow](https://docs.meteor.com/api/collections.html#Mongo-Collection-allow).

These rules are based on checking the ```Meteor.userId()``` before publishing documents to the subscribing clients.

You can use the meteor-ddp-call node to call the "login" DDP method to have a valid Meteor.userId() on server side to check against methods and subscribes calls from the clients. Passing the credentials in the ```msg.payload``` object is possible.

 