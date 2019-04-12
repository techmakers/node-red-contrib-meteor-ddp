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
