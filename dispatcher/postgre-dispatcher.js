"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Pool } = require("pg");
const winston = require("winston");

class PostgresDispatcher extends winston.Transport {
  constructor(options) {
    super();
    console.log("options in postgres", options);
    this.options = options;

    // Create PostgreSQL connection pool
    this.pool = new Pool({
      host: this.options.pgHost,
      port: this.options.pgPort,
      user: this.options.pgUser,
      password: this.options.pgPassword,
      database: this.options.pgDatabase,
    });

    // Check PostgreSQL connection
    this.pool.connect((err, client, release) => {
      if (err) {
        console.error("PostgreSQL Connection Error", err);
        process.exit(1);
      } else {
        console.log("PostgreSQL DB Connected!");
        release();
      }
    });

    if (this.pool) {
      let table_name = this.options.table;

      // Create table if not exists (PostgreSQL query)
      let sql = `
                CREATE TABLE IF NOT EXISTS ${table_name} (
                    id SERIAL PRIMARY KEY,
                    api_id VARCHAR(255) NOT NULL,
                    ver VARCHAR(15) NOT NULL,
                    params JSONB NOT NULL,
                    ets BIGINT NOT NULL,
                    events JSONB NOT NULL,
                    channel VARCHAR(50) NOT NULL,
                    pid VARCHAR(50) NOT NULL,
                    mid VARCHAR(50) NOT NULL,
                    syncts BIGINT NOT NULL
                );
            `;

      // Run table creation query
      this.pool.query(sql, (err, result) => {
        if (err) {
          console.error("Error while creating table", err);
          process.exit(1);
        }
        console.log("Telemetry table created or already exists.");
      });
    }
  }

  log(level, msg, meta, callback) {
    console.log("in log callback: ", callback);
    console.log("msg", msg);
    let msgData = JSON.parse(msg);
    console.log("msgData", msgData);

    let promises = [];
    let table_name = this.options.table;

    try {
      for (const iterator of msgData.events) {
        // Insert query to PostgreSQL table one by one
        const query = `
                    INSERT INTO ${table_name} (api_id, ver, params, ets, events, channel, pid, mid, syncts)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                `;

        const values = [
          msgData.id,
          msgData.ver,
          JSON.stringify(msgData.params),
          msgData.ets,
          JSON.stringify(iterator),
          iterator.context.channel,
          iterator.context.pdata.pid,
          msgData.mid,
          msgData.syncts,
        ];

        promises.push(this.pool.query(query, values));
      }
    } catch (err) {
      return callback(err);
    }

    // Handle insertion promises
    Promise.all(promises)
      .then(() => {
        console.log("postgres Data inserted successfully!");
        // if (typeof callback === "function") {
           callback();
        // } else {
        //   console.error("No callback function provided!");
        // }
      })
      .catch((err) => {
        console.error("Unable to insert data", err);
        return callback(err);
      });
  }
}

// Register PostgreSQL dispatcher as a winston transport
winston.transports.postgres = PostgresDispatcher;

module.exports = { PostgresDispatcher };
