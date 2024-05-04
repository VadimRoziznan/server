const http = require('http');
const Koa = require("koa");
const {koaBody} = require('koa-body');


const app = new Koa();

app.use(koaBody({
  urlencoded: true,
  multipart: true,
}));

app.use((ctx, next) => {
  console.log(ctx.request.body);

  ctx.response.body = "server response";

  next();
})


const server = http.createServer(app.callback());

const port = 7070;

server.listen(port, (err) => {
  if(err) {
    console.log(err);

    return;
  }

  console.log('Server is listening to ' + port);
});
