

const http = require('http');
const Koa = require("koa");
const {koaBody} = require('koa-body');
const koaStatic = require('koa-static');
const path = require('path');
const uuid = require('uuid');
const fs = require('fs');
const cors = require('@koa/cors');

const tickets = [
  {id: '6226b804-0b73-47c5-adcc-a62ce79a2b26', name: 'Выучить английский', description: 'В этом году', date: '11.05.2024 17:52'},
  {id: '1aab2c9d-1149-4aa1-a3ef-97bd3c2b3e8a', name: 'Выучить китайский', description: 'В следующем году', date: '11.05.2024 17:53'},
  {id: '6aab2c9d-1147-4aa1-a3ef-97bd3c2b3e8a', name: 'Не сойти с ума', description: 'В этом году', date: '11.05.2024 17:53'}

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
  const { name, description } = ctx.request.body;

  ctx.response.set('Access-Control-Allow-Origin', '*');

  if (tickets.some(sub => sub.name === name)) {
    ctx.response.status = 400;
    ctx.response.body = 'ticit exists';

    return;
  }

  tickets.push({ id: generateUniqueId(), name, description, date: getCurrentDateTime() });

  console.log(ctx.request.body)

  ctx.response.body = 'OK';
  next();
});


app.use((ctx, next) => {
  if (ctx.request.method !== 'PUT') {
    next();
    return;
  }
  const { name, description, uuid } = ctx.request.body;

  ctx.response.set('Access-Control-Allow-Origin', '*');

  if (tickets.some(sub => sub.name === name)) {
    ctx.response.status = 400;
    ctx.response.body = 'ticit exists';

    return;
  }

  const index = tickets.findIndex(entry => entry.id === uuid);

  if (index !== -1) {
    tickets[index] = { id: uuid, name, description, date: getCurrentDateTime() };
  }
  console.log(ctx.request.body)

  

  ctx.response.body = 'OK';
  next();
});

app.use((ctx, next) => {
  if (ctx.request.method !== 'DELETE') {
    next();
    return;
  }
  const { name, description, uuid } = ctx.request.body;

  ctx.response.set('Access-Control-Allow-Origin', '*');

  if (tickets.some(sub => sub.name === name)) {
    ctx.response.status = 400;
    ctx.response.body = 'ticit exists';

    return;
  }

  const index = tickets.findIndex(entry => entry.id === uuid);

  if (index !== -1) {
    /*tickets[index] = { id: uuid, name, description, date: getCurrentDateTime() };*/
  }
  console.log(ctx.request.body)

  

  ctx.response.body = 'OK';
  next();
});

console.log(tickets)
const server = http.createServer(app.callback());

const port = process.env.PORT || 7070;

server.listen(port, (err) => {
  if(err) {
    console.log(err);

    return;
  }

  console.log('Server is listening to ' + port);
});







