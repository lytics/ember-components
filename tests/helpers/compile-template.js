import Ember from 'ember';

export default function compileTemplate(fn) {
  return Ember.Handlebars.compile(heredoc(fn));
}

function heredoc (f) {
  return f.toString().match(/\/\*\s*([\s\S]*?)\s*\*\//m)[1];
}
