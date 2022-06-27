const parseValue = (actualValue) => {
  const formats = { '%23': '#', '%2F': '/' };
  return Object.keys(formats).reduce((value, format) => value.replaceAll(format, formats[format]), actualValue);
};

const parseParams = (paramsString) => {
  const parsedParams = {};
  if (paramsString) {
    const params = paramsString.split('&');
    params.forEach((param) => {
      const [key, value] = param.split('=');
      parsedParams[key] = parseValue(value);
    });
  }
  return parsedParams;
};
const parseUri = (rawUri) => {
  const [uri, queryString] = rawUri.split('?');
  const queryParams = parseParams(queryString);
  return { uri, queryParams };
}

const parseRequestLine = (line) => {
  const [method, rawUri, httpVersion] = line.split(' ');
  return { method, ...parseUri(rawUri), httpVersion };
};
const splitHeader = (line) => {
  const index = line.indexOf(':');
  const key = line.slice(0, index).trim();
  const value = line.slice(index + 1).trim();
  return [key.toLowerCase(), value];
};
const parseHeader = (lines) => {
  let index = 0;
  const headers = {};
  while (index < lines.length && lines[index].length > 0) {
    const [key, value] = splitHeader(lines[index]);
    headers[key] = value;
    index++;
  }
  return headers;
};
const parseRequest = (request) => {
  const lines = request.split('\r\n');
  const requestLine = parseRequestLine(lines[0]);
  const headers = parseHeader(lines.slice(1));
  return { ...requestLine, headers };
};

module.exports = { parseHeader, parseRequestLine, parseRequest, splitHeader };