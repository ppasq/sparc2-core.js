module.exports = function(value, ratio, id, index)
{
  if(value == "rp25")
  {
    return "Every 25 Years (4%)"
  }
  else if(value == "rp100")
  {
    return "Every 100 Years (1%)"
  }
  else if(value == "rp1000")
  {
    return "Every 1000 Years (0.1%)"
  }
  else
  {
    return value;
  }
};
