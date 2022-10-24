const express = require("express");
const ampq = require("amqplib");

const app = express();
const port = 3002;
let channel, connection;

connect();
async function connect() {
  try {
    const rabbitMQServer = "amqp://localhost:5672";
    connection = await ampq.connect(rabbitMQServer);
    channel = await connection.createChannel();
    channel.assertQueue("rabbitmq");

    channel.consume("rabbitmq", (data) => {
      if (data) {
        console.log(`Received : ${Buffer.from(data.content)}`);
        channel.ack(data)
      }
    });
  } catch (e) {
    console.log(e);
  }
}

app.get("/send", (req, res) => {});

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
