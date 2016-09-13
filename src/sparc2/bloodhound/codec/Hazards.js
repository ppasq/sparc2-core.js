module.exports = function(response, url)
{
  var hazards_typeahead = [];

  var hazards = response.hazards;
  for(var i = 0; i < hazards.length; i++)
  {
    var hazard = hazards[i];
    var hazard_typeahead = {
      'id': hazard['id'],
      'text': hazard['title'],
      'obj': hazard
    };
    hazards_typeahead.push(hazard_typeahead);
  }

  return hazards_typeahead;
};
