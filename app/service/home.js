const Service = require('egg').Service
class HomeService extends Service {
  async user() {
    const { ctx, app } = this;
    const QUERY_STR = 'id,name';
    let sql = `select ${QUERY_STR} from user;`
    try {
      const result = await app.mysql.query(sql);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async addUser(name) {
    const { ctx, app } = this;
    try {
      const result = await app.mysql.insert('user', { name });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async editUser(name, id) {
    const { ctx, app } = this;
    try {
      const result = await app.mysql.update('user', { name }, {
        where: {
          id
        }
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async delUser(id) {
    const { ctx, app } = this;
    try {
      const result = await app.mysql.delete('user', { id });
      return result
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
module.exports = HomeService