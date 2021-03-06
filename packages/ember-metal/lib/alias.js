import { inspect } from 'ember-utils';
import { assert } from './debug';
import { get } from './property_get';
import { set } from './property_set';
import EmberError from './error';
import {
  Descriptor,
  defineProperty
} from './properties';
import { ComputedProperty } from './computed';
import { meta as metaFor } from './meta';
import {
  addDependentKeys,
  removeDependentKeys
} from './dependent_keys';

export default function alias(altKey) {
  return new AliasedProperty(altKey);
}

export function AliasedProperty(altKey) {
  this.isDescriptor = true;
  this.altKey = altKey;
  this._dependentKeys = [altKey];
}

AliasedProperty.prototype = Object.create(Descriptor.prototype);

AliasedProperty.prototype.setup = function(obj, keyName) {
  assert(`Setting alias '${keyName}' on self`, this.altKey !== keyName);
  let meta = metaFor(obj);
  if (meta.peekWatching(keyName)) {
    addDependentKeys(this, obj, keyName, meta);
  }
};

AliasedProperty.prototype._addDependentKeyIfMissing = function(obj, keyName) {
  let meta = metaFor(obj);
  if (!meta.peekDeps(this.altKey, keyName)) {
    addDependentKeys(this, obj, keyName, meta);
  }
};

AliasedProperty.prototype._removeDependentKeyIfAdded = function(obj, keyName) {
  let meta = metaFor(obj);
  if (meta.peekDeps(this.altKey, keyName)) {
    removeDependentKeys(this, obj, keyName, meta);
  }
};

AliasedProperty.prototype.willWatch = AliasedProperty.prototype._addDependentKeyIfMissing;
AliasedProperty.prototype.didUnwatch = AliasedProperty.prototype._removeDependentKeyIfAdded;
AliasedProperty.prototype.teardown = AliasedProperty.prototype._removeDependentKeyIfAdded;

AliasedProperty.prototype.get = function AliasedProperty_get(obj, keyName) {
  this._addDependentKeyIfMissing(obj, keyName);

  return get(obj, this.altKey);
};

AliasedProperty.prototype.set = function AliasedProperty_set(obj, keyName, value) {
  return set(obj, this.altKey, value);
};

AliasedProperty.prototype.readOnly = function() {
  this.set = AliasedProperty_readOnlySet;
  return this;
};

function AliasedProperty_readOnlySet(obj, keyName, value) {
  throw new EmberError(`Cannot set read-only property '${keyName}' on object: ${inspect(obj)}`);
}

AliasedProperty.prototype.oneWay = function() {
  this.set = AliasedProperty_oneWaySet;
  return this;
};

function AliasedProperty_oneWaySet(obj, keyName, value) {
  defineProperty(obj, keyName, null);
  return set(obj, keyName, value);
}

// Backwards compatibility with Ember Data.
AliasedProperty.prototype._meta = undefined;
AliasedProperty.prototype.meta = ComputedProperty.prototype.meta;
