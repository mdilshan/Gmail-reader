module.exports = function parser(response) {

  function decode(input) {
    const text = new Buffer.from(input, 'base64').toString('ascii')
    return decodeURIComponent(escape(text))
  }

  const result = {
   text: '',
   html: '',
   attachments: []
  }

  let parts = [response.payload]

  while (parts.length) {
    let part = parts.shift()

    if (part.parts)
      parts = parts.concat(part.parts)

    if (part.mimeType === 'text/plain')
      result.text = decode(part.body.data)

    if (part.mimeType === 'text/html')
      result.html = decode(part.body.data)

    if (part.body.attachmentId) {
      result.attachments.push({
        'partId': part.partId,
        'mimeType': part.mimeType,
        'filename': part.filename,
        'body': part.body
      })
    }
  }

  return result
}