import assert from 'node:assert/strict'
import {test} from 'node:test'
import {Liquid} from 'liquidjs'

const engine = new Liquid({
  root: new URL('../snippets/', import.meta.url).pathname,
  extname: '.liquid',
  jekyllInclude: false,
})

function renderLink(href, text = 'click') {
  return engine.parseAndRender(`{% render 'portable-text', portableText: portableText %}`, {
    portableText: [
      {
        _type: 'block',
        style: 'normal',
        markDefs: [{_key: 'l1', _type: 'link', href}],
        children: [{_type: 'span', text, marks: ['l1']}],
      },
    ],
  })
}

const safe = [
  'https://example.com',
  'http://example.com',
  'HTTPS://example.com',
  'mailto:hi@example.com',
  'tel:+4712345678',
  '#section',
  '/absolute/path',
  '//example.com/same-protocol',
  'relative/path',
  'page.html',
  '  https://example.com  ',
  'site/search?query=author:espen',
  'site/search#my:encoded:data',
  '',
]

const unsafe = [
  'javascript:alert(1)',
  'JavaScript:alert(1)',
  '  javascript:alert(1)',
  'data:text/html,<script>alert(1)</script>',
  'vbscript:msgbox(1)',
  'file:///etc/passwd',
  'ftp://example.com',
  ':foo',
]

for (const href of safe) {
  test(`renders a link for ${JSON.stringify(href)}`, async () => {
    assert.equal(await renderLink(href), `<p><a href="${href}">click</a></p>`)
  })
}

for (const href of unsafe) {
  test(`renders plain text for ${JSON.stringify(href)}`, async () => {
    assert.equal(await renderLink(href), '<p>click</p>')
  })
}

test('escapes the href so it cannot break out of the attribute', async () => {
  const html = await renderLink('/a" onmouseover="alert(1)')
  assert.match(html, /^<p><a href="[^"]*">click<\/a><\/p>$/)
})
