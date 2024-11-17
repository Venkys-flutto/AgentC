const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { exec } = require('child_process');

const app = express();
const PORT = 9000;

// Your GitHub webhook secret
const GITHUB_SECRET = 'stage';

// Middleware to parse JSON with raw body saving for signature verification
app.use(bodyParser.json({
  verify: (req, res, buf, encoding) => {
    req.rawBody = buf.toString(encoding || 'utf-8');
    console.log('Raw Body:', req.rawBody);
  }
}));

// Function to verify the GitHub signature
function verifySignature(req, res, buf) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    console.error('No X-Hub-Signature-256 header');
    throw new Error('No X-Hub-Signature-256 header');
  }

  const hmac = crypto.createHmac('sha256', GITHUB_SECRET);
  const digest = 'sha256=' + hmac.update(buf).digest('hex');

  // Log for debugging
  console.log('Computed digest:', digest);
  console.log('Received signature:', signature);

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
    console.error('Signatures do not match!');
    throw new Error('Invalid signature');
  }
}


// Middleware to verify the signature
app.use((req, res, next) => {
  try {
    verifySignature(req, res, req.rawBody);
    next();
  } catch (err) {
    res.status(403).send('Forbidden - Invalid Signature');
  }
});

// Route to handle GitHub webhook events
app.post('/stage', (req, res) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;

  // Log event type and payload
  console.log(`Received GitHub event: ${event}`);
  console.log('Payload:', payload);

  // Check if the event is a push event
  if (event === 'push') {
    console.log('Push event detected. Running prod.sh...');
    
    // Execute the shell script
    exec('./stage.sh', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing prod.sh: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stage.sh stderr: ${stderr}`);
        return;
      }
      console.log(`stage.sh output: ${stdout}`);
    });
  }

  // Respond with a 200 status code
  res.status(200).send({ status: 'Webhook received' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Listening for GitHub webhooks on port ${PORT}`);
});
