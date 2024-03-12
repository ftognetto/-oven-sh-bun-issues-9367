import express from 'express';

import { PubSub } from '@google-cloud/pubsub';

const app = express();
const port = process.env.PORT || 8080;

/*** Middlewares ***/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*** Routes ***/
app.get('/test', async (req, res) => {
  try {
    // try to send an event
    await sendMessage();
  } catch (e) {
    console.error(e);
    return res.status(500).send('Error');
  }
  return res.status(200).send('OK');
});

async function sendMessage() {
  const pubSub = new PubSub();

  try {
    const dataBuffer = Buffer.from(JSON.stringify({ type: 'test' }));

    const [messageId] = await pubSub
      .topic(`${process.env.TOPIC}`, { messageOrdering: true })
      .publishMessage({ data: dataBuffer, orderingKey: `1` });
    if (!messageId) {
      throw Error();
    }

    console.log(`Event sent`);
    return messageId;
  } catch (e) {
    const error = `Error sending event - ${JSON.stringify(e)}}`;
    console.error(new Error(error));
    throw new Error(error);
  }
}

/*** Start ***/
app.listen(port, async () => {
  console.log('Test-service listening on port', port);
});
