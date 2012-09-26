var db = require("./database");

function Keyring(tablePrefix, tablePrefix2, ownerCol, ownerId) {
	this.tablePrefix = tablePrefix;
	this.tablePrefix2 = tablePrefix2;
	this.ownerCol = ownerCol;
	this.ownerId = ownerId;
}

function getKeyringForUser(userId) {
	return new Keyring("users_keyrings", "users_keyrings_with_groups", "user", userId);
}

function getKeyringForGroup(groupId) {
	return new Keyring("groups_keyrings", "groups_keyrings", "group", groupId);
}

function keyringContainsKey(keyring, keyId, callback, onlyKeyring, con) {
	var filter = { "key" : keyId };
	filter[keyring.ownerCol] = keyring.ownerId;
	db.entryExists((onlyKeyring ? keyring.tablePrefix : keyring.tablePrefix2)+"_keys", filter, callback, con);
}

function keyringContainsIdentity(keyring, keyId, identityId, callback, onlyKeyring, con) {
	var filter = { "identityKey" : keyId, "identity" : identityId };
	filter[keyring.ownerCol] = keyring.ownerId;
	db.entryExists((onlyKeyring ? keyring.tablePrefix : keyring.tablePrefix2)+"_identities", filter, callback, con);
}

function keyringContainsAttribute(keyring, keyId, attributeId, callback, onlyKeyring, con) {
	var filter = { "attributeKey" : keyId, "attribute" : attributeId };
	filter[keyring.ownerCol] = keyring.ownerId;
	db.entryExists((onlyKeyring ? keyring.tablePrefix : keyring.tablePrefix2)+"_attributes", filter, callback, con);
}

function addKeyToKeyring(keyring, keyId, callback, con) {
	keyringContainsKey(keyring, keyId, function(err, contains) {
		if(err)
			callback(err);
		else if(contains)
			callback(null);
		else
		{
			var data = { key: keyId };
			data[keyring.ownerCol] = keyring.ownerId;
			db.insert(keyring.tablePrefix+'_keys', data, callback, con);
		}
	}, true, con);
}

function addIdentityToKeyring(keyring, keyId, identityId, callback, con) {
	keyringContainsIdentity(keyring, keyId, identityId, function(err, contains) {
		if(err)
			callback(err);
		else if(contains)
			callback(null);
		else
		{
			var data = { identityKey: keyId, identity: identityId };
			data[keyring.ownerCol] = keyring.ownerId;
			db.insert(keyring.tablePrefix+'_identities', data, callback, con);
		}
	}, true, con);
}

function addAttributeToKeyring(keyring, keyId, attributeId, callback, con) {
	keyringContainsAttribute(keyring, keyId, attributeId, function(err, contains) {
		if(err)
			callback(err);
		else if(contains)
			callback(null);
		else
		{
			var data = { attributeKey: keyId, attribute: attributeId };
			data[keyring.ownerCol] = keyring.ownerId;
			db.insert(keyring.tablePrefix+'_attributes', data, callback, con);
		}
	}, true, con);
}

exports.getKeyringForUser = getKeyringForUser;
exports.keyringContainsKey = keyringContainsKey;
exports.keyringContainsIdentity = keyringContainsIdentity;
exports.keyringContainsAttribute = keyringContainsAttribute;
exports.addKeyToKeyring = addKeyToKeyring;
exports.addIdentityToKeyring = addIdentityToKeyring;
exports.addAttributeToKeyring = addAttributeToKeyring;