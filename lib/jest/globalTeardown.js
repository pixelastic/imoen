module.exports = async function () {
  return await new Promise((resolve) => {
    global.server.on('close', resolve);
    global.server.close();
  });
};
