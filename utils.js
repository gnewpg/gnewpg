var config = require("./config");
var fs = require("fs");
var pgp = require("node-pgp");

function encodePassword(password) {
	return pgp.utils.hash(password, "sha256", "base64").substring(0, 43);
}

/**
 * Encodes the PGP key to the specified format. The format is one from the select box that is generated by the
 * gnewpg.ui.exportFormats template.
*/
function encodeToFormat(data, format) {
	if(!(data instanceof pgp.BufferedStream))
		data = new pgp.BufferedStream(data);

	switch(format) {
		case "binary":
			return data;
		case "ascii":
		default:
			return pgp.formats.enarmor(data, pgp.consts.ARMORED_MESSAGE.PUBLIC_KEY);
	}
}

/**
 * Gets the file extension for the specified format. The format is one from the select box that is generated by the
 * gnewpg.ui.exportFormats template.
*/
function getInfoForFormat(format) {
	switch(format) {
		case "binary":
			return { extension: ".bexpk", mimetype: "application/octet-stream" };
		case "ascii":
		default:
			return { extension: ".asc", mimetype: "application/pgp-keys" };
	}
}

exports.extend = pgp.utils.extend;
exports.encodePassword = encodePassword;
exports.encodeToFormat = encodeToFormat;
exports.getInfoForFormat = getInfoForFormat;