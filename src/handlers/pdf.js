//
//
// HEY! Be sure to re-incorporate changes from @albinekb
// https://github.com/adieuadieu/serverless-chrome/commit/fca8328134f1098adf92e115f69002e69df24238
//
//
//
import '@babel/polyfill'
import log from '../utils/log'
import pdf, { makePrintOptions } from '../chrome/pdf'

export function computePdfFilename(url) {
  const URL = require('url').URL
  return decodeURIComponent(new URL(url).pathname.
    replace(/\/$/, '').
    replace(/.*\//, '')).
    replace(/\.html$/, '').
    replace(/$/, '.pdf')
}

export default async function handler (event, context, callback) {
  const queryStringParameters = event.queryStringParameters || {}
  const {
    url = 'https://github.com/adieuadieu/serverless-chrome',
    ...printParameters
  } = queryStringParameters
  const printOptions = makePrintOptions(printParameters)
  let data

  log('Processing PDFification for', url, printOptions)

  const startTime = Date.now()

  try {
    data = await pdf(url, printOptions)
  } catch (error) {
    console.error('Error printing pdf for', url, error)
    return callback(error)
  }

  log(`Chromium took ${Date.now() - startTime}ms to load URL and render PDF.`)

  var headers = {
    'Content-Type': 'application/pdf'
  }

  // Ask browsers to save using a name that is based on the URL and not just `pdf.pdf`.
  const pdfFilename = computePdfFilename(url);
  if (pdfFilename.indexOf('"') == -1)
    headers['Content-Disposition'] =  'inline; filename="' + pdfFilename + '"'

  // TODO: handle cases where the response is > 10MB
  // with saving to S3 or something since API Gateway has a body limit of 10MB
  return callback(null, {
    statusCode: 200,
    body: data,
    isBase64Encoded: true,
    headers: headers
  })
}
