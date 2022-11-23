const db = require('../../models/index')

const updatePostState = async(req, res) => {
    await db.job_posts.update(
        { state: "마감" },
        { where: { end_date: { [Op.lte]: date.format("YYYY-MM-DD") } } }
    )
}

// const tableexists = async (tablename) => {
//     let resp = await db.sequelize.query(`SHOW TABLES LIKE '${tablename}'`);
//     return resp[0][0];
// };

// const fieldexists = async (tablename, fieldname) => {
//     let resp = await db.sequelize.query(
//         `SHOW COLUMNS FROM ${tablename} LIKE '${fieldname}'`
//     );
//     return resp[0][0];
// };

module.exports = {
    updatePostState,
}