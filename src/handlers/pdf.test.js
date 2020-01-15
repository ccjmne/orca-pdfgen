import test from 'ava'
import handler, { computePdfFilename } from '../handlers/pdf'

const testUrl = 'https://github.com/adieuadieu'
const testEvent = {
  queryStringParameters: { url: testUrl },
}

test('computePdfFilename replaces html with pdf', t => {
  t.is(computePdfFilename('https://example.com/Bar.html'), 'Bar.pdf')
})

test('computePdfFilename removes directories from pth', t => {
  t.is(computePdfFilename('https://example.com/foo/bar/Baz.html'), 'Baz.pdf')
})

test('computePdfFilename appends pdf to non-HTML name', t => {
  t.is(computePdfFilename('https://example.com/foo/Bar'), 'Bar.pdf')
})

test('computePdfFilename uses the last directory if the path does not have a filename', t => {
  t.is(computePdfFilename('https://example.com/foo/bar/'), 'bar.pdf')
})

test('computePdfFilename decodes the filename', t => {
  t.is(computePdfFilename('https://example.com/foo/bar%20baz.html'), 'bar baz.pdf')
})

test('PDF handler', async (t) => {
  await t.notThrows(async () => {
    const result = await handler(testEvent, {})

    t.is(result.statusCode, 200)
  })
})
