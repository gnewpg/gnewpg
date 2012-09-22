var pgpUpload = require("../pgpUpload");
var fs = require("fs");

module.exports.post = function(req, res, next) {
	var f = req.files.file;
	if(!f)
		f = [ ];
	else if(!Array.isArray(f))
		f = [ /*f*/ ];
	
	var uploadedKeys = [ ];
	var errors = [ ];
	var failed = [ ];
	
	handleNext(0);
	function handleNext(i) {
		if(i == f.length)
		{
			end();
			return;
		}
		
		pgpUpload.uploadKey(fs.createReadStream(f[i].path), function(err, uploaded) {
			if(err)
			{
				console.log("Error while uploading key", err);
				errors.push(err);
			}
			else
			{
				uploadedKeys = uploadedKeys.concat(uploaded.uploadedKeys);
				failed = failed.concat(uploaded.failed);
			}
			
			handleNext(++i);
		});
	}
	
	function end() {
		pgpUpload.uploadKey(req.body.paste || "", function(err, uploaded) {
			if(err)
			{
				console.log("Error while uploading key", err);
				errors.push(err);
			}
			else
			{
				uploadedKeys = uploadedKeys.concat(uploaded.uploadedKeys);
				failed = failed.concat(uploaded.failed);
			}
			
			req.params.uploadedKeys = uploadedKeys;
			req.params.failed = failed;
			req.params.errors = errors;
			
			next();
		});
	}
}