let debug = function() {};

if (process.env.DEBUG !== undefined) {
  debug = function(...datas) {
    process.stdout.write('DEBUG - freebox-v6-remote - ' + new Date() + ' - ');
    for (let data of datas) {
      if (typeof data === 'string') {
        process.stdout.write(data);
      } else {
        process.stdout.write(JSON.stringify(data));
      }
      process.stdout.write(' ');
    }
    process.stdout.write('\n');
  };
}

module.exports = debug;