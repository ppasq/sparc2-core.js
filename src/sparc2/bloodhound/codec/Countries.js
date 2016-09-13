module.exports = function(response, url)
{
  var countries_typeahead = [];

  var countries = response.countries;
  for(var i = 0; i < countries.length; i++)
  {
    var country = countries[i];
    var id = extract("iso.alpha3", country) || extract("gaul.admin0_code", country);
    var title = extract("gaul.admin0_name", country) || extract("dos.short", country);
    var country_typeahead = {
      'id': id,
      'text': title,
      'obj': country
    };
    countries_typeahead.push(country_typeahead);
  }

  return countries_typeahead;
};
