import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import Leaderboard from '../models/Leaderboard.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';

const connectionString =
  process.env.MONGODB_URI ?? 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase(): Promise<void> {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    const existingCounts = await Promise.all([
      User.countDocuments(),
      Team.countDocuments(),
      Activity.countDocuments(),
      Leaderboard.countDocuments(),
      Workout.countDocuments(),
    ]);

    if (existingCounts.some((count) => count > 0)) {
      throw new Error(
        'Refusing to seed a non-empty database. Remove existing data or use a fresh octofit_db.',
      );
    }

    const teams = await Team.insertMany([
      { name: 'Coral Crushers', points: 2450 },
      { name: 'Wave Warriors', points: 2180 },
    ]);
    const teamsByName = new Map(teams.map((team) => [team.name, team]));

    const users = await User.insertMany([
      {
        name: 'Avery Chen',
        email: 'avery.chen@example.com',
        team: teamsByName.get('Coral Crushers')!._id,
        points: 1320,
      },
      {
        name: 'Jordan Patel',
        email: 'jordan.patel@example.com',
        team: teamsByName.get('Coral Crushers')!._id,
        points: 1130,
      },
      {
        name: 'Morgan Rivera',
        email: 'morgan.rivera@example.com',
        team: teamsByName.get('Wave Warriors')!._id,
        points: 1190,
      },
      {
        name: 'Riley Kim',
        email: 'riley.kim@example.com',
        team: teamsByName.get('Wave Warriors')!._id,
        points: 990,
      },
    ]);

    await Promise.all([
      teamsByName.get('Coral Crushers')!.updateOne({
        members: users
          .filter((user) => user.email.endsWith('@example.com') && user.team.equals(teamsByName.get('Coral Crushers')!._id))
          .map((user) => user._id),
      }),
      teamsByName.get('Wave Warriors')!.updateOne({
        members: users
          .filter((user) => user.team.equals(teamsByName.get('Wave Warriors')!._id))
          .map((user) => user._id),
      }),
    ]);

    const userByEmail = new Map(users.map((user) => [user.email, user]));
    await Activity.insertMany([
      {
        user: userByEmail.get('avery.chen@example.com')!._id,
        type: 'running',
        durationMinutes: 32,
        distanceKm: 5.2,
        points: 320,
        recordedAt: new Date('2026-10-05T07:30:00.000Z'),
      },
      {
        user: userByEmail.get('jordan.patel@example.com')!._id,
        type: 'cycling',
        durationMinutes: 45,
        distanceKm: 14.8,
        points: 410,
        recordedAt: new Date('2026-10-04T16:00:00.000Z'),
      },
      {
        user: userByEmail.get('morgan.rivera@example.com')!._id,
        type: 'swimming',
        durationMinutes: 38,
        distanceKm: 1.5,
        points: 360,
        recordedAt: new Date('2026-10-05T12:15:00.000Z'),
      },
      {
        user: userByEmail.get('riley.kim@example.com')!._id,
        type: 'walking',
        durationMinutes: 50,
        distanceKm: 4.1,
        points: 250,
        recordedAt: new Date('2026-10-03T09:00:00.000Z'),
      },
    ]);

    await Leaderboard.insertMany([
      {
        user: userByEmail.get('avery.chen@example.com')!._id,
        points: 1320,
        period: 'weekly',
        periodStart: new Date('2026-10-05T00:00:00.000Z'),
      },
      {
        user: userByEmail.get('jordan.patel@example.com')!._id,
        points: 1130,
        period: 'weekly',
        periodStart: new Date('2026-10-05T00:00:00.000Z'),
      },
      {
        user: userByEmail.get('morgan.rivera@example.com')!._id,
        points: 1190,
        period: 'weekly',
        periodStart: new Date('2026-10-05T00:00:00.000Z'),
      },
      {
        user: userByEmail.get('riley.kim@example.com')!._id,
        points: 990,
        period: 'weekly',
        periodStart: new Date('2026-10-05T00:00:00.000Z'),
      },
      {
        team: teamsByName.get('Coral Crushers')!._id,
        points: 2450,
        period: 'weekly',
        periodStart: new Date('2026-10-05T00:00:00.000Z'),
      },
      {
        team: teamsByName.get('Wave Warriors')!._id,
        points: 2180,
        period: 'weekly',
        periodStart: new Date('2026-10-05T00:00:00.000Z'),
      },
    ]);

    await Workout.insertMany([
      {
        title: 'Easy Run Builder',
        description: 'A comfortable aerobic run to build endurance and consistency.',
        activityType: 'running',
        difficulty: 'beginner',
        durationMinutes: 25,
      },
      {
        title: 'Tempo Ride',
        description: 'Alternate steady cycling with short, controlled tempo efforts.',
        activityType: 'cycling',
        difficulty: 'intermediate',
        durationMinutes: 40,
      },
      {
        title: 'Swim Intervals',
        description: 'Build swim speed with repeat intervals and relaxed recovery lengths.',
        activityType: 'swimming',
        difficulty: 'advanced',
        durationMinutes: 35,
      },
    ]);

    console.log('Seeded 4 users, 2 teams, 4 activities, 6 leaderboard entries, and 3 workouts.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

void seedDatabase();
