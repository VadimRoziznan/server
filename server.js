

const http = require('http');
const Koa = require("koa");
const {koaBody} = require('koa-body');
const koaStatic = require('koa-static');
const path = require('path');
const uuid = require('uuid');
const fs = require('fs');
const cors = require('@koa/cors');

const tickets = [
  {id: '6226b804-0b73-47c5-adcc-a62ce79a2b26', name: 'Выучить английский', description: 'sdvase', date: '11.05.2024 17:52'},
  {id: '1aab2c9d-1149-4aa1-a3ef-97bd3c2b3e8a', name: 'Выучить китайский', description: 'aefefefe', date: '11.05.2024 17:53'}

];


function getCurrentDateTime() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function generateUniqueId() {
  return uuid.v4();
}


const app = new Koa();


const public = path.join(__dirname, '/public');

app.use(koaStatic(public));

app.use(cors({
  origin: 'http://localhost:8080'
}));

app.use(koaBody({
  urlencoded: true,
  multipart: true,
}));

app.use((ctx, next) => {
  if (ctx.request.method !== 'OPTIONS') {
    next();

    return;
  }

  ctx.response.set('Access-Control-Allow-Origin', '*');

  ctx.response.set('Access-Control-Allow-Methods', 'DELETE, PUT, PATCH, GET, POST');

  ctx.response.status = 204;
});


app.use((ctx, next) => {

  ctx.response.body = "server response";

  next();
})


app.use(async (ctx, next) => {
  if (ctx.request.method === 'GET' && ctx.request.path === '/tickets') {
    ctx.response.body = tickets;
    console.log(tickets)
  } else {
    await next();
  }
});


app.use((ctx, next) => {
  if (ctx.request.method !== 'POST') {
    next();

    return;
  }

  console.log(ctx.request.body);

  const { name, description } = ctx.request.body;

  ctx.response.set('Access-Control-Allow-Origin', '*');

  if (tickets.some(sub => sub.name === name)) {
    ctx.response.status = 400;
    ctx.response.body = 'ticit exists';

    return;
  }

  tickets.push({ id: generateUniqueId(), name, description, date: getCurrentDateTime() });

  ctx.response.body = 'OK';
  console.log(tickets)
  next();
});

const server = http.createServer(app.callback());

const port = process.env.PORT || 7070;

server.listen(port, (err) => {
  if(err) {
    console.log(err);

    return;
  }

  console.log('Server is listening to ' + port);
});







