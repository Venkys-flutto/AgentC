const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { exec } = require('child_process');

const app = express();
const PORT = 9000;

// Your GitHub webhook secret for the production environment
const GITHUB_SECRET = 'prod';

// Middleware to parse JSON and save raw body for signature verification
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Function to verify the GitHub signature
function verifySignature(req) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    throw new Error('Missing X-Hub-Signature-256 header');
  }

  const hmac = crypto.createHmac('sha256', GITHUB_SECRET);
  const digest = `sha256=${hmac.update(req.rawBody).digest('hex')}`;

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
    throw new Error('Invalid signature');
  }
}

// Route to handle GitHub webhook events
app.post('/prod', (req, res) => {
  try {
    verifySignature(req);

    const event = req.headers['x-github-event'];
    console.log(`Received GitHub event: ${event}`);
    console.log('Payload:', req.body);

    if (event === 'push') {
      console.log('Push event detected. Running prod.sh...');

      exec('./prod.sh', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing prod.sh: ${error.message}`);
          return res.status(500).send('Internal Server Error');
        }
        if (stderr) {
          console.error(`prod.sh stderr: ${stderr}`);
        }
        console.log(`prod.sh output: ${stdout}`);
        res.status(200).send('Production environment updated successfully!');
      });
    } else {
      res.status(200).send('No action for this event.');
    }
  } catch (err) {
    console.error(err.message);
    res.status(403).send('Forbidden - Invalid Signature');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Listening for GitHub webhooks on port ${PORT}`);
});
