module.exports = function(response)
{
  //var r = response.split(",");
  var r = response;
  var view = new DataView(new ArrayBuffer(r.length));
  for(var i = 0; i < r.length; i++)
  {
    //view.setInt8(i, parseInt(r[i], 16));
    view.setInt8(i, r.charCodeAt(i));
  }
  return view;
};
