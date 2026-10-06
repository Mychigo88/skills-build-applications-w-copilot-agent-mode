import { model, Schema } from 'mongoose';

const leaderboardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    points: { type: Number, required: true, default: 0, min: 0 },
    period: { type: String, required: true, default: 'weekly' },
    periodStart: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true },
);

export default model('Leaderboard', leaderboardSchema);
