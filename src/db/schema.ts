import { pgTable, text, integer, boolean, timestamp, primaryKey, serial } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  displayName: text("display_name").notNull(),
  avatar: text("avatar"),
  points: integer("points").notNull().default(0),
  referralCode: text("referral_code").notNull().unique(),
  referredBy: text("referred_by"),
  accessToken: text("access_token"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastCheckinAt: timestamp("last_checkin_at"),
});

export const completedTasks = pgTable("completed_tasks", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  taskId: text("task_id").notNull(),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
  proofUrl: text("proof_url"),
}, (t) => ({ pk: primaryKey({ columns: [t.userId, t.taskId] }) }));

export const pointsLog = pgTable("points_log", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: text("referrer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  referredId: text("referred_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  rewardGiven: boolean("reward_given").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
