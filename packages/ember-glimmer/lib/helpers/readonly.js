/**
@module ember
@submodule ember-glimmer
*/
import { UPDATE } from '../utils/references';
import { unMut } from './mut';


/**
  The `readonly` helper let's you specify that when you updated a value passed in
  to a child component, it does not update in the parent component.
  
  To specify that a parameter is read-only, when invoking the child `Component`:
  
    ```javascript
  // my-parent.js
  export default Component.extend({
    totalClicks: 3
  });
  ```
  
  ```handlebars
  {{log totalClicks}} // -> 3
  {{my-child childClickCount=(readonly totalClicks)}}
  ```
  
  Now, when you update `childClickCount`:
  
  ```javascript
  // my-child.js
  export default Component.extend({
    click() {
      this.incrementProperty('childClickCount');
    }
  });
  ```
  
  The value updates in the child component, but not the parent component:
  
  ```handlebars
  // my-child.hbs
  {{log childClickCount}} //-> 4
  ```
  
  ```handlebars
  // my-parent.hbs
  {{log totalClicks}} //-> 3
  {{my-child childClickCount=(readonly totalClicks)}}
  ```
  
  ### Objects and Arrays
  
  Note that while properties passed in as `readonly` parameters won't update
  the property itself, if it is an Object or an Array, you can still modify
  properties of it and it'll update in the parent. You can think of this as
  working similarly to the `const` keyword introduced in ES6. Let's look at
  an example:
  
  First let's set up the parent component:
  
  ```javascript
  // my-parent.js
  export default Ember.Component.extend({
    clicks: { total: 3 }
  });
  ```
  
  ```handlebars
  // my-parent.hbs
  {{log clicks.total}} //-> 3
  {{my-child childClicks=(readonly clicks)}}
  ```
  
  Now, if you update the `total` property of `childClicks`:
  
  ```javascript
  // my-child.js
  export default Ember.Component.extend({
    click() {
      this.get('clicks').incrementProperty('total');
    }
  });
  ```
  
  You will see the following happen:
  
  ```handlebars
  // my-parent.hbs
  {{log clicks.total}} //-> 4
  {{my-child childClicks=(readonly clicks)}}
  ```
  
  ```handlebars
  // my-child.hbs
  {{log childClicks.total}} //-> 4
  ```

  @method readonly
  @param {Object} [attr] the read-only attribute.
  @for Ember.Templates.helpers
  @public
*/
export default function(vm, args) {
  let ref = unMut(args.positional.at(0));

  let wrapped = Object.create(ref);

  wrapped[UPDATE] = undefined;

  return wrapped;
}
