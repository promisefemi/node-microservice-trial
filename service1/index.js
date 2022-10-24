const express = require("express");
const ampq = require("amqplib");

const app = express();
const port = 3001;
let channel, connection;

connect();
async function connect() {
  try {
    const rabbitMQServer = "amqp://localhost:5672";
    connection = await ampq.connect(rabbitMQServer);
    channel = await connection.createChannel();
    channel.assertQueue("rabbitmq");
  } catch (e) {
    console.log(e);
  }
}

app.get("/send", async (req, res) => {
  const testData = {
    name: "Resident Winch",
    powerLevel: "Awesome",
  };

  await channel.sendToQueue("rabbitmq", Buffer.from(JSON.stringify(testData)));
  // await channel.close();
  // await connection.close();
  return res.send("done");
});

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
