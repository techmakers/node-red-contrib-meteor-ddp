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
