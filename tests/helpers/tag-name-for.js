export default function tagNameFor(view, selector) {
  return view.$(selector).get(0).tagName.toLowerCase();
}
