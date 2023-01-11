# portable-text-to-liquid

Render [Portable Text](https://portabletext.org/) on a Shopify storefront using Liquid.

## Installation

Add the contents of the `snippets` folder in this repo to the `snippets` folder of your Shopify theme. You can then customise the output according to your requirements.

## Basic usage

Pass the snippet a `portableText` variable containing the JSON value of the Portable Text you want to display:

```liquid
{% render 'portable-text', portableText: liquidVariable %}
```

For example, you might have a Sanity document – synced to a product metafield in the namespace `sanity` and the key `published` – with a `body` field containing Portable Text. To render this, your Liquid code would be:

```liquid
{% render 'portable-text', portableText: product.metafields.sanity.published.value.body %}
```

## How it works

The key principle of this collection of snippets is that the `portable-text.liquid` snippet loops through the blocks in the Portable Text and outputs a different snippet based on the `_type` of the block.

For example, if the `_type` is `block`, then `portable-text-block.liquid` will be rendered. If the `_type` is `span`, then `portable-text-span.liquid` will be rendered.

This is done recursively, so blocks containing nested blocks or spans will render as appropriate.

If you have customised your Portable Text editor, you may need to [amend the provided snippets](#customizing-output) to recognise other `_type` values, span `mark` definitions or `listItem` types.

We have provided some examples of custom snippets in this repo.

## Styling the output

The rendered HTML does not have any styling applied, so you may want to either render a parent container with a class name you can target in your CSS (for example in the Dawn theme, the `pte` class), or [customize the output](#customizing-output) of the Liquid snippets.

## Customizing output

Snippets are provided in this package which make a decision about what to render. The snippets use Liquid to process these into output. Default snippets are provided for all standard features of the Portable Text spec, with logical defaults.

The `portable-text.liquid` snippet essentially loops through the blocks and outputs a different snippet based on the `_type` of the block.

In order to change the output, simply update the appropriate snippet according to the type:

### Types

Different types of Portable Text block content are rendered by the top level `portable-text.liquid` snippet. If you have created any custom types, you'll need to add these here. Essentially, just add an additional `when` to the `case` statement, and create a new snippet to render the content as needed.

There are a couple of examples in this repo - `portable-text-accordion.liquid` and `portable-text-callout.liquid` designed to illustrate this.

If an unknown type is encountered, nothing will be output, and a messaged will be logged in the browser console.

### Blocks

A snippet which renders portable text blocks with different style properties - such as `blockquote`, `h1` and `h2` – as well as list items.

You can amend the default HTML rendered here by amending the `portable-text-block.liquid` snippet. If you've created additional block styles, these can be added to the case statement here as well.

If an unknown block style is encountered, nothing will be output, and a message will be logged in the browser console.

#### List Items

In the Portable Text specification, list items are not nested in a list block type. We've therefore added additional logic to handle list types in order to understand when lists should be opened and closed.

If you need to add new list item types, you'll need to define opening and closing tags for these in `portable-text-block.liquid` where the `listOpen` variables are declared, as well as where the `lastListItem` variable is used to establish a list should be closed. Finally, this will also need to be defined in `portable-text.liquid` where the final output checks whether a list is unclosed by checking `lastListItem`.

If a list item type doesn't have it's own definition, we'll render this as a `<ul>` by default, and log a message in the browser console.

### Spans / Marks

A span renders inline text content and has marks to indicate the type of inline content - such as `strong`, `em` or `code`. The output of these can be handled by `portable-text-span.liquid`.

For custom marks with mark definitions, you can create additional definitions which can access the properties of the mark definition. An example of this is provided concerning a `link` mark where an `href` property contains the URL for the link.

If an unknown mark is encountered, then the span text will still be output. A message will be logged in the browser console to indicate a missing mark type.

## Disabling errors / handling unknown types

When a block, mark or list item with a type that is not known is encountered, by default message will be logged to the browser console indicating an unknown type has been encountered.

To disable this behavior, you can pass `false` to an `errors` variable when rendering the snippet:

```jsx
{% render 'portable-text', portableText: liquidVariable, errors: false %}
```

## License

MIT © [Sanity.io](https://www.sanity.io/)