const router = require('koa-router')();
const Person = require('../dbs/models/person');

router.get('/', async (ctx, next) => {
  ctx.response.type='text/html';
  ctx.response.body='<h1>GOOD MORNING XY!</h1>'
});

/**
 *  一、 增加 内容 向person数据模型中
 *
 *     可以通过命令行执行：curl -d 'name=cck&age=27' http://localhost:3000/users/addPerson
 *     若返回: {
                "code": 0
              }
 证明添加数据成功。

 注意： save()方法是model自带的写入数据的方法, 通过实例 person 写入
 使用save()方法，需要先实例化为文档，再使用save()方法保存文档。而create()方法，则直接在模型Model上操作，并且可以同时新增多个文档
 */

router.post('/addPerson', async function (ctx) {
  // 创建实例
  const person = new Person({
    name: ctx.request.body.name,
    age: ctx.request.body.age
  })
  // let doc = await Person.create({
  //   username: 'cedric222',
  //   password: '123',
  //   age: 27
  // }, {
  //   username: 'cedric333',
  //   password: '123',
  //   age: 27
  // })
  let code = 0 // 状态码

  try {
    await person.save()
    code = 0
  } catch (e) {
    code = -1
  }

  // 返回状态（成功为0， 错误为-1）
  ctx.body = {
    code
  }
})

/**
 *  二、 读取 内容 从person数据模型中
 *      命令行中输入：curl -d 'name=cck' http://localhost:3000/users/getPerson
 *      返回：{
                "code": 0,
                "result": {
                  "_id": "5beb91bcd6e7060ffcca6a46",
                  "name": "cck",
                  "age": 27,
                  "__v": 0
                },
                "results": [
                  {
                    "_id": "5beb91bcd6e7060ffcca6a46",
                    "name": "cck",
                    "age": 27,
                    "__v": 0
                  }
                ]
              }
 *
 *    注意： findOne()和find()方法是model自带的读取数据的方法, 注意：这里直接通过模型 Person 写入 ！！！
 *          findOne() 只是找到一条符合条件的内容
 *          find() 可以找到整个符合条件的集合(数组)
 */

router.get('/getPerson', async function (ctx) {
  const name = ctx.query.name||'';
  const result = await Person.findOne({name})
  const results = await Person.find()

  // 这里没有考虑异常，直接返回了结果
  ctx.body = {
    code: 0,
    result,
    results
  }
})

/**
 *  三、 修改 内容 从person数据模型中
 *      命令行中输入：curl -d 'name=wy&age=19' http://localhost:3000/users/updatePerson
 *      返回：{
                "code": 0,
              }
 *
 *    注意： where()和update()方法是model自带的读取数据的方法, 注意：这里直接通过模型 Person 写入 ！！！
 *          where() 找到符合条件的内容
 *          update() 修改该内容
 */

router.post('/updatePerson', async function (ctx) {
  // 找到符合条件的name,并修改其age
  const result = await Person.where({
    name: ctx.request.body.name
  }).update({
    age: ctx.request.body.age
  })

  // 这里没有考虑异常，直接返回了结果
  ctx.body = {
    code: 0
  }
})

/**
 *  四、 删除 内容 从person数据模型中
 *
 *    注意： where()和update()方法是model自带的读取数据的方法, 注意：这里直接通过模型 Person 写入 ！！！
 *          where() 找到符合条件的内容
 *          remove() 删除该内容
 */

router.delete('/removePerson', async function (ctx) {
  // 找到符合条件的name,并修改其age
  const result = await Person.findByIdAndRemove(ctx.query._id);

  // 这里没有考虑异常，直接返回了结果
  ctx.body = {
    code: 0,
    result
  }
})

module.exports = router;