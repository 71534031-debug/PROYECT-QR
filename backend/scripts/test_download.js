const http = require('http');

function api(method, path, token, body) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost', port: 3000, path: path, method: method,
      headers: {}
    };
    if (token) opts.headers['Authorization'] = 'Bearer ' + token;
    if (body) { opts.headers['Content-Type'] = 'application/json'; }
    const r = http.request(opts, (res) => {
      let data = [];
      res.on('data', c => data.push(c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(data) }));
    });
    r.on('error', reject);
    if (body) r.write(JSON.stringify(body));
    r.end();
  });
}

async function main() {
  const login = await api('POST', '/api/auth/login', null, { email: 'admin@cip.local', password: 'Password123' });
  const token = JSON.parse(login.body.toString()).token;
  console.log('Token OK');

  const dl = await api('GET', '/api/certificados/13/descargar', token);
  const disp = dl.headers['content-disposition'] || '';
  console.log('Status:', dl.status);
  console.log('Disposition:', disp);

  const match = disp.match(/filename=(.+)/);
  if (match) {
    let fn = match[1].replace(/["\']/g, '');
    console.log('Filename:', fn);
    console.log('Filename bytes:', Buffer.from(fn, 'latin1').toString('hex'));
  }
}
main().catch(e => console.error(e));
