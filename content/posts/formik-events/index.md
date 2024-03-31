---
title: React, Formik, and Events 
date: "2024-03-30T00:00:00.000Z"
description: "Musings on Formik's API, custom events in React, and why I might leave Formik"
tags: ['formik', 'react', 'development', 'events']
---
I've been using [Formik](https://formik.org/) lately for a form-intensive React app.
Formik is a React/JavaScript library that aims to make it easier to manage HTML forms
and inputs. It provides a level of abstraction on top of form inputs and attempts
to simplify form state and validation.

This article attempts to convey one of my biggest dislikes with Formik:
the way in which Formik treats native HTML input elements as different than
custom React components. Specifically, the way that Formik expects native HTML inputs
to communicate via `change` and `touched` events while not providing or suggesting
a comparable way for custom React components to raise similar events.

I argue that, while Formik's `setFieldValue` and `setFieldTouched` functions
are useful escape hatches, the official recommendation that they be used in lieu of
a common event interface (i.e., one that leverages the existing `onChange` and `onTouched` handlers)
is counter-productive to writing minimally-complex, maximally-expressive software.

Finally, I look at whether just using events (or hacking together a sort of "pseudo" event)
is enough to satisfy Formik's interface, and conclude with a few thoughts on using Formik
in general and why I'll probably look elsewhere for my next big project.

## Exploring Formik, Formik's API, and Events 
### Brief Introduction to Formik 
Formik provides a convenient way to wire up native HTML input elements to Formik forms.
Take the following example:
```
import React from 'react';
import { useFormik } from 'formik';

const SimpleFormikExample = () => {
  const formik = useFormik({
    initialValues: { title: 'Raiders of the Lost Ark' },
    onSubmit: (values, actions) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        actions.setSubmitting(false);
      }, 1000);
    },
  });

  return (
    <div>
      <h1>My Movie Form</h1>
      <p>Enter the title of your favorite movie.</p>
      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title}
          name="title"
        />
        {formik.errors.title && <div id="feedback">{formik.errors.title}</div>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
```

This is a simple form with a single text input. A user can enter the title of a movie.
The input has a default value of "Raiders of the Lost Ark"

Some quick notes about Formik's API:
- Form values are stored in an object under `formik.values`
- Form errors are stored in an object under `formik.errors`
- Form values are indexed by the input's `name` property (e.g., "title")
- Form errors are indexed by the input's `name` property (e.g., "title")

So we might have data structures like this (pseudocode):
```
formik.values = { title: 'Raiders of the Lost Ark' }
```

### Formik's handleChange and handleBlur
Something that makes Formik easy to use is the way it consumes 
`onChange` and `onBlur` callback functions provided by native HTML input elements.
These callbacks are called with HTML element `change` and `blur` events respectively.
The flow looks something like this:
- An input's `onChange` prop is wired up using `formik.handleChange`
- An input's `onBlur` prop is wired up using `formik.handleBlur`
- An input invokes its `onChange` callback with a `change` event
- An input invokes its `onBlur` callback with a `blur` event
- Formik derives the value of the input from the `change` event
- Formik derives the touched state of the input from the `blur` event

For both handlers, the `name` property of the input field does not have to be passed as an argument.
Formik is smart enough to get the name of the input from the events raised by that input.
Formik then uses that name to update its `formik.values` and `formik.touched` objects.

```
<input
    type="text"
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    value={formik.values.title}
    name="title"
/>
```
Formik also uses the name of the input ("title") to correlate the value taken from
the input's `change` event with the values in Formik's state.

### Formik's setFieldValue and setFieldTouched
If you want to create a custom input component (one that doesn't use an HTML input/textarea/etc. under the hood),
Formik recommends you wire it up using `setFieldValue` and `setFieldTouched`. The docs say:
- `setFieldValue` is "useful for creating custom input change handlers" and
- `setFieldTouched` is "useful for creating custom input blur handlers"

Consider a React component that acts like a custom input.
Imagine that this `BerryPictureSelector` component allows the user to select a berry (strawberry, blueberry, etc.)
by clicking its picture. The name of the field according to Formik ("berry") is passed
explicitly in `formik.setFieldValue` and `formik.setFieldTouched`.
```
<BerryPictureSelector
    // Formik's recommended way to set values for custom input components
    onChange={(selectedBerry) => formik.setFieldValue("berry", selectedBerry)}
    // Formik's recommended way to set touched state for custom input components
    onBlur={() => formik.setFieldTouched("berry")}
    value={formik.values.berry}
/>
```

If you were to use `formik.setFieldValue` and `formik.setFieldTouched`
with a native HTML input element rather than using `onChange` and `onTouched`,
it might look like the example below.
Since it's a normal native HTML input, you'd normally use 
the event-based `formik.handleChange` and `formik.handleBlur` functions;
this example is solely pedagogical (don't do this in practice):
```
// just an example, don't do this in practice!
<input
    type="text"
    // a bit strange, using setFieldValue rather than handleChange
    onChange={(event) => formik.setFieldValue("title", event.target.value)}
    // a bit strange, using setFieldTouched rather than handleBlur
    onBlur={(event) => formik.setFieldTouched("title")}
    value={formik.values.title}
    // we don't specify the name property here
/>
```

## The Problem
While `setFieldValue` and `setFieldTouched` are useful escape hatches,
in my opinion they shouldn’t be the primary way to connect Formik to custom input components.
Given an arbitrary input (a native HTML input element or a custom component),
developers shouldn't have to worry about *how* to connect it to Formik, so long as their component
props conform to some loosely-defined interface.

While handling interaction from native HTML input elements *is* different from handling interaction
from custom input components, the distinction *should* only matter to Formik.
Worse, if you consider these two things to be equivalent,
**Formik effectively gives you two
different ways to do the same thing.**
- If I'm using native inputs, I use `handleChange` and `handleBlur`.
- If I'm using custom inputs, I use `setFieldValue` and `setFieldTouched`.

It's not ideal. It's likely that I will end up with a codebase where, when connecting inputs
to Formik, I have to know whether an input raises native HTML `change`/`blur` events or whether it invokes
custom callbacks. This division  *should* be an implementation detail of Formik,
but it adds mental overhead for developers for every form and input. Why can't my custom components
just appear to Formik as if they're native HTML inputs and use the same pattern everywhere?

## Exploring a Common Interface: Custom Events
Formik's `handleChange` and `handleBlur` functions are convenient because they
leverage HTML element `change` and `blur` events which have metadata (e.g., the input name) necessary to
correlate those callbacks with the relevant Formik state.

It seems intuitive to me that, if I want to make a custom React component
that behaves like an input, it should raise its own `change` and `blur` events.
If all of my custom React components raised events in the format that Formik expects,
I could just use `formik.handleChange` and `formik.handleBlur`.

What I really want is a common event interface *for all* inputs, not just native HTML inputs.

## Formik Internals 
Formik defines event handlers for `handleBlur` and `handleChange`, among others.
- `handleBlur` expects to receive a `React.FocusEvent<any>`
- `handleChange` expects to receive a `React.ChangeEvent<any>`
- The implementation of `handleBlur` calls into `executeChange`
- The implementation of `handleTouched` called into `executeBlur`

```
export interface FormikHandlers {
  ...
  // the interface/type of handleBlur
  handleBlur: {
    /** Classic React blur handler, keyed by input name */
    (e: React.FocusEvent<any>): void;
    /** Preact-like linkState. Will return a handleBlur function. */
    <T = string | any>(fieldOrEvent: T): T extends string
      ? (e: any) => void
      : void;
  };
  // the interface/type of handleChange
  handleChange: {
    /** Classic React change handler, keyed by input name */
    (e: React.ChangeEvent<any>): void;
    /** Preact-like linkState. Will return a handleChange function.  */
    <T = string | React.ChangeEvent<any>>(
      field: T
    ): T extends React.ChangeEvent<any>
      ? void
      : (e: string | React.ChangeEvent<any>) => void;
  };
  ...
}

// The implementation of handleBlur
const handleBlur = useEventCallback<FormikHandlers['handleBlur']>(
  (eventOrString: any): void | ((e: any) => void) => {
    if (isString(eventOrString)) {
      return event => executeBlur(event, eventOrString);
    } else {
      executeBlur(eventOrString);
    }
  }
);

// The implementation of handleChange
const handleChange = useEventCallback<FormikHandlers['handleChange']>(
  (
    eventOrPath: string | React.ChangeEvent<any>
  ): void | ((eventOrTextValue: string | React.ChangeEvent<any>) => void) => {
    if (isString(eventOrPath)) {
      return event => executeChange(event, eventOrPath);
    } else {
      executeChange(eventOrPath);
    }
  }
);

```
Both of these implementations are just thin wrappers around other functions:
- `handleChange` wraps `executeChange`
- `handleBlur` wraps `executeBlur`

### Formik Internals, executeChange
Here's the implementation of `executeChange`:
```
const executeChange = React.useCallback(
  (eventOrTextValue: string | React.ChangeEvent<any>, maybePath?: string) => {
    // By default, assume that the first argument is a string. This allows us to use
    // handleChange with React Native and React Native Web's onChangeText prop which
    // provides just the value of the input.
    let field = maybePath;
    let val = eventOrTextValue;
    let parsed;
    // If the first argument is not a string though, it has to be a synthetic React Event (or a fake one),
    // so we handle like we would a normal HTML change event.
    if (!isString(eventOrTextValue)) {
      // If we can, persist the event
      // @see https://reactjs.org/docs/events.html#event-pooling
      if ((eventOrTextValue as any).persist) {
        (eventOrTextValue as React.ChangeEvent<any>).persist();
      }

      // By default, Formik looks for the event target under event.target.
      // React's BaseSyntheticEvent has both `target` and `currentTarget` props.
      const target = eventOrTextValue.target
        ? (eventOrTextValue as React.ChangeEvent<any>).target
        : (eventOrTextValue as React.ChangeEvent<any>).currentTarget;

      const {
        type,
        name,
        id,
        value,
        checked,
        outerHTML,
        options,
        multiple,
      } = target;

      field = maybePath ? maybePath : name ? name : id;
      if (!field && __DEV__) {
        warnAboutMissingIdentifier({
          htmlContent: outerHTML,
          documentationAnchorLink: 'handlechange-e-reactchangeeventany--void',
          handlerName: 'handleChange',
        });
      }
      // This is where most of the actual event processing is performed,
      // based on the type of event.target.type (or event.currentTarget.type)
      val = /number|range/.test(type)
        ? ((parsed = parseFloat(value)), isNaN(parsed) ? '' : parsed)
        : /checkbox/.test(type) // checkboxes
        ? getValueForCheckbox(getIn(state.values, field!), checked, value)
        : options && multiple // <select multiple>
        ? getSelectedValues(options)
        // The default, just grabs event.target.value
        // (or event.currentTarget.value)
        : value; 
    }

    if (field) {
      // Set form fields by name
      setFieldValue(field, val);
    }
  },
  [setFieldValue, state.values]
);
```
Some things to note:
- Given an object, Formik will parse `event.target` and `event.currentTarget` 
- While there are various cases for parsing the event value based on its `type`,
the default is simply to return value (i.e., from `event.target.value`)
- `setFieldValue` takes an argument `field` that comes from `event.target.name` 

So in the simplest case, if you want to satisfy the event-driven interface that native HTML inputs
provide to Formik, but in a custom component, you just need to invoke `onChange` with an object that looks like:
```
{ target: { name: 'xxx', value: 'yyy' } }
```

### Formik Internals, executeBlur
Here's the implemetation of `executeBlur`:

```
const executeBlur = React.useCallback(
    (e: any, path?: string) => {
      if (e.persist) {
        e.persist();
      }
      const { name, id, outerHTML } = e.target;
      const field = path ? path : name ? name : id;

      if (!field && __DEV__) {
        warnAboutMissingIdentifier({
          htmlContent: outerHTML,
          documentationAnchorLink: 'handleblur-e-any--void',
          handlerName: 'handleBlur',
        });
      }

      setFieldTouched(field, true); // handleBlur eventually calls this setter
    },
    [setFieldTouched]
);
```

I was surprised how much simpler this was than the implementation of `executeChange`.
I also think it's useful to see that it always sets the touched status of a field to true.
Assuming we only call `onBlur` with an event, it looks like that event just needs to be an object with a `name` property
in order for it to play nice with Formik's `handleChange`.


## Raising Custom Events
React defines `ChangeEvent<...>` and `FocusEvent<...>` as:
```
interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
        target: EventTarget & T;
}

interface FocusEvent<Target = Element, RelatedTarget = Element> extends SyntheticEvent<Target, NativeFocusEvent> {
    relatedTarget: (EventTarget & RelatedTarget) | null;
    target: EventTarget & Target;
}
```
Both extend from `SyntheticEvent`, defined as:
```
interface SyntheticEvent<T = Element, E = Event> extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> {}
```

Given knowledge of Formik's internals, if we just wanted a bare-minimum event for Formik, we could write something like:
```
const event: React.ChangeEvent<HTMLInputElement> = {
  target: {
    value: 'some value',
    type: 'text',
  },
} as React.ChangeEvent<HTMLInputElement>;
```
We use the explicit cast to `React.ChangeEvent<HTMLInputElement>` because
otherwise we would have to specify a few dozen properties of `HTMLInputElement` as properties of `target`.

Also, we don't have to specify `type`. Apparently, if `RegExp.prototype.test()`
is called with `undefined`, JavaScript will first convert it to a string, and then
attempt all matches against the string "undefined".
Recall from earlier:
```
// This is where most of the actual event processing is performed,
// based on the type of event.target.type (or event.currentTarget.type)
val = /number|range/.test(type)
  ? ((parsed = parseFloat(value)), isNaN(parsed) ? '' : parsed)
  : /checkbox/.test(type) // checkboxes
  ? getValueForCheckbox(getIn(state.values, field!), checked, value)
  : options && multiple // <select multiple>
  ? getSelectedValues(options)
  // The default, just grabs event.target.value
  // (or event.currentTarget.value)
  : value;
```
Technically, the string "undefined" doesn't match `/number|range/` or `/checkbox/`,
so this will be evaluated as `val = value`. In practice, this is ungodly hacky
and dependent on specific Formik internals. You might be better off manually
specifying `event.target.type` as "text" or something similar, but *technically*
the only thing that matters is that it doesn't match any of the more specific value parsing blocks 🤷

## Putting It All Together
If you *really* wanted to use events as a common interface for all of your input components,
and you *really* wanted to use Formik, you could probably do something akin to:
```
type PseudoChangeEvent<T> = {
  target: {
    value: T;
    type: 'text',
  }
}

export function createPseudoChangeEvent<T>(value: T): React.ChangeEvent<any> {
  const event: PseudoChangeEvent<T> = {
    target: {
      value,
      type: 'text',
    },
  };
  return event as React.ChangeEvent<any>;
}
```
Then inside your component, when you want to express to the outside world
(e.g., to Formik) that your value has changed, you could create a new "pseudo" `change` event,
and invoke your component's `onChange` callback with this event.

**Full disclosure though, I've never actually tried this.**

And I don't actually think this is a good solution. One problem I can think of immediately
is that, if anyone wanted to consume your component without using Formik, your `onChange`/`onBlur`
interface is basically a lie. We're only providing the bare minimum information inside these events
that we need to satisfy Formik. If someone writes code against our components expecting
to get complete `React.FocusEvent` or `React.ChangeEvent` events in the `onBlur` and `onChange` callbacks,
they might make an incorrect assumption that breaks things in a major way.

This might be why the Formik authors recommend using `setFieldValue` and `setFieldTouched` in the first place,
but I still don't like effectively having two different interfaces to my inputs in order to satisfy
an implementation detail of Formik's.

## Closing Thoughts

It seems like I have three options when using Formik:
1. Use a mix of `handleChange`/`handleBlur` and `setFieldValue`/`setFieldTouched` and have to concern
myself with whether a component uses native events. I don't like this out of principle because I shouldn't have to
design my input component's APIs differently from one another based on implementation details imposed by Formik.
2. Wrap every input in a component that hides any native events, using only `handleChange`/`handleBlur`
across my application. This would simplify my interfaces, but lose the nice property that events usually (implicitly) include a `name`
3. Use `onChange`/`onBlur` everywhere, using a hacky pseudo event in all of my custom components
to satisfy the interfaces of Formik's `handleChange` and `handleBlur` functions. This would improve
consistency but add annoying boilerplate everywhere, and might cause issues when other things other than Formik
attempt to consume the components (because the events aren't actually real and we do a lot of casting).

Formik is okay. It works well enough for small projects and simple forms. But as soon as you 
try to build larger abstractions on top of Formik (e.g., form factories or form generation from API responses),
the schism that is introduced by Formik's reliance on native events becomes an annoyance
that carries through your codebase.

At this point I think I'm going to look for other form libraries 🙂  
Maybe I'll write a post later complaining about [React Hook Form](https://react-hook-form.com/).

