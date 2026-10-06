import express from 'express';
import mongoose from 'mongoose';
import Activity from './models/Activity.js';
import Leaderboard from './models/Leaderboard.js';
import Team from './models/Team.js';
import User from './models/User.js';
import Workout from './models/Workout.js';
import { connectDatabase } from './config/database.js';

const app = express();
const port = Number(process.env.PORT ?? 8000);
const codespaceName = process.env.CODESPACE_NAME;

export const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());
app.use((request, response, next) => {
  const origin = request.headers.origin;
  const localFrontend = 'http://localhost:5173';
  const codespaceFrontend = codespaceName
    ? `https://${codespaceName}-5173.app.github.dev`
    : undefined;

  if (origin && (origin === localFrontend || origin === codespaceFrontend)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Vary', 'Origin');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (request.method === 'OPTIONS') {
    response.sendStatus(204);
    return;
  }

  next();
});

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/users/', async (_request, response) => {
  response.json(await User.find().populate('team').lean());
});

app.get('/api/teams/', async (_request, response) => {
  response.json(await Team.find().populate('members').lean());
});

app.get('/api/activities/', async (_request, response) => {
  response.json(await Activity.find().populate('user').lean());
});

app.get('/api/leaderboard/', async (_request, response) => {
  response.json(
    await Leaderboard.find()
      .populate('user')
      .populate('team')
      .sort({ points: -1 })
      .lean(),
  );
});

app.get('/api/workouts/', async (_request, response) => {
  response.json(await Workout.find().lean());
});

app.use(
  (
    error: unknown,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction,
  ) => {
    if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
      response.status(400).json({ error: error.message });
      return;
    }

    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    ) {
      response.status(409).json({ error: 'A record with that unique value already exists.' });
      return;
    }

    console.error('API request failed:', error);
    response.status(500).json({ error: 'Internal server error.' });
  },
);

async function startServer(): Promise<void> {
  await connectDatabase();
  app.listen(port, '0.0.0.0', () => {
    console.log(`OctoFit Tracker API listening at ${baseUrl}`);
  });
}

void startServer().catch((error: unknown) => {
  console.error('Unable to start OctoFit Tracker API:', error);
  process.exitCode = 1;
});
