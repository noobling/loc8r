module.exports.locationsCreate = function(req, res) {
  sendJSONResponse(res, 200, {"status" : "success"});
};

sendJSONResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
}