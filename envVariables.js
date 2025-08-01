const os = require("os");

const envVariables = {
  level: process.env.telemetry_log_level || "info",
  localStorageEnabled: process.env.telemetry_local_storage_enabled || "true",
  telemetryProxyEnabled: "false",
  // dispatcher: process.env.telemetry_local_storage_type,
  proxyURL: "http://localhost:9001",
  proxyAuthKey: process.env.telemetry_proxy_auth_key,
  encodingType: process.env.telemetry_encoding_type,
  kafkaHost: process.env.telemetry_kafka_broker_list,
  topic: process.env.telemetry_kafka_topic,
  compression_type: process.env.telemetry_kafka_compression || "none",
  filename: process.env.telemetry_file_filename || "telemetry-%DATE%.log",
  maxSize: process.env.telemetry_file_maxsize || "100m",
  maxFiles: process.env.telemetry_file_maxfiles || "100",
  partitionBy: process.env.telemetry_cassandra_partition_by || "hour",
  keyspace: process.env.telemetry_cassandra_keyspace,
  contactPoints: (
    process.env.telemetry_cassandra_contactpoints || "localhost"
  ).split(","),
  cassandraTtl: process.env.telemetry_cassandra_ttl,
  port: process.env.telemetry_service_port || 9001,
  threads: process.env.telemetry_service_threads || os.cpus().length,
  table: process.env.telemetry_table_name || "telemetry",
  mysqlHost: process.env.MYSQL_HOST,
  mysqlUser: process.env.MYSQL_USER,
  mysqlPort: process.env.MYSQL_PORT,
  mysqlDatabase: process.env.MYSQL_DATABASE,
  mysqlPassword: process.env.MYSQL_PASSWORD,
  pgHost: "database-dev-pratham.cxka2844ez4h.ap-south-1.rds.amazonaws.com",
  pgPort: 5432,
  pgUser: "postgres",
  pgPassword: "Pr$th!m#4512#",
  pgDatabase: "telemetry",
  dispatcher: "postgre",
};
module.exports = envVariables;
