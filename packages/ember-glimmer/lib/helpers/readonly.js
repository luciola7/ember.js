/**
@module ember
@submodule ember-glimmer
*/
import { UPDATE } from '../utils/references';
import { unMut } from './mut';


/**
 
  @method readonly
  @param {Object} [attr] the immutable reference to the attribute.
  @for Ember.Templates.helpers
  @public
*/
export default function(vm, args) {
  let ref = unMut(args.positional.at(0));

  let wrapped = Object.create(ref);

  wrapped[UPDATE] = undefined;

  return wrapped;
}
