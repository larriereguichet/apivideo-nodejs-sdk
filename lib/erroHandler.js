const errorHandler = (error) => {
  const { response, request: { options } } = error;
  if (response && response.body) {
    console.error(`${options.method} ${options.url.href}`);
    console.error('Headers:', options.headers);
    console.error('Response:');
    console.error('Headers:', response.headers);
    console.error('Body:', response.body);
  }

  return error;
};

module.exports = errorHandler;
