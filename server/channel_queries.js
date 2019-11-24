const config = require("./config");
const Pool = require("pg").Pool;
var querystring = require("querystring");

const pool = new Pool({
  user: global.gConfig.database.user,
  host: global.gConfig.database.host,
  database: global.gConfig.database.database,
  password: global.gConfig.database.password,
  port: global.gConfig.database.port
});

// GET (/channel/:id)
// get all info of channel by id
const getChannelById = (request, response) => {
  const id = request.params.id;

  pool.query("SELECT * FROM channels WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// GET (/channel/host/:host_id)
const getChannelByHostId = (request, response) => {
  const host_id = request.params.host_id;

  pool.query(
    "SELECT * FROM channels WHERE host = $1",
    [host_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

// GET (/channel/code/:join_code)
const getChannelByJoinCode = (request, response) => {
  const join_code = request.params.join_code;

  pool.query(
    "SELECT * FROM channels WHERE join_code = $1",
    [join_code],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

// POST (/channel/create)
const createChannel = (request, response) => {
  const username = request.query.username;
  const join_code = request.query.join_code;

  pool.query(
    "SELECT id from users where username=$1", [username], (error,results) => {
      let host = results.rows[0].id;
      pool.query(
        "INSERT INTO channels (host, join_code) VALUES ($1, $2) RETURNING id",
        [host, join_code],
        (error, results) => {
          if (error) {
            throw error;
          }
          console.log(results.rows[0].id);
          response.status(201).send(
            querystring.stringify({
              id: results.rows[0].id,
            })
          );
        }
      );
    });
};

// PUT (/channel/:id)
const updateChannel = (request, response) => {
  const id = parseInt(request.params.id);
  const { host_id, join_code } = request.body;

  pool.query(
    "UPDATE channels SET host_id = $1, join_code = $2 WHERE id = $3",
    [host_id, join_code, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Channel modified with ID: ${id}`);
    }
  );
};

// DELETE (/channel/remove)
const deleteChannel = (request, response) => {
  const id = request.query.id;

  console.log(id);

  pool.query("DELETE FROM channels WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Channel deleted with ID: ${id}`);
  });

  // Todo: Clear all songs with channel_id
};

module.exports = {
  getChannelById,
  getChannelByHostId,
  getChannelByJoinCode,
  createChannel,
  updateChannel,
  deleteChannel
};
