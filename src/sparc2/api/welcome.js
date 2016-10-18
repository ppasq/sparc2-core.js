module.exports = function(options)
{
  options = options || {};
  /*var scope = options['$scope'] || options['scope'] || angular.element("#geodash-main").scope();
  var intentData = {
    "id": "geodash-modal-sparc-welcome",
    "modal": {
      "backdrop": "static",
      "keyboard": false
    },
    "dynamic": {},
    "static": {
      "welcome": extract("welcome", scope.config || scope.map_config)
    }
  };
  geodash.api.intend("toggleModal", intentData, scope);*/

  var id = "geodash-modal-sparc-welcome";
  var main_scope = geodash.util.getScope("geodash-main");
  var modal_scope = geodash.util.getScope(id);
  modal_scope.$apply(function (){
    modal_scope.push({
      "welcome": extract("welcome", main_scope.config || main_scope.map_config)
    });
    setTimeout(function(){
      $("#"+id).modal({'backdrop': 'static'});
    },0);
  });
};
