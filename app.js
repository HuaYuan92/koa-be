const Koa = require('koa');
const app = new Koa();
const router = require('./router');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const mongoose = require('mongoose');
const onerror = require('koa-onerror')
const dbConfig = require('./dbs/config');
const cors = require('koa2-cors')

mongoose.connect(dbConfig.dbs, {
  useNewUrlParser: true
});
onerror(app);
app.use(cors({
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
  maxAge: 100,
  credentials: true,
  allowMethods: ['GET', 'POST', 'OPTIONS','DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
}));

app.use(require('koa-static')(__dirname + '/public'));

app.use(bodyParser({
  enableTypes: ['json', 'form', 'text'],
  jsonLimit: "2mb",
  formLimit: "2mb"
}));
app.use(logger())

app.use(router.routes());

const port = 3000;

app.listen(port,()=>{
  console.log(`app started at port ${port}`);
});

