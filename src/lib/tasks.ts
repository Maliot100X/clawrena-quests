export type TaskType = "follow" | "like" | "repost" | "quote" | "reply";
export interface Task { id: string; type: TaskType; title: string; description: string; points: number; xUrl: string; requiresProof: boolean; proofPlaceholder?: string; icon: string; }

export const TASKS: Task[] = [
  { id: "follow_clawrenai", type: "follow", title: "Follow CLAWRENAi on X", description: "Follow @CLAWRENAi on X to stay in the arena.", points: 10, xUrl: "https://x.com/intent/follow?screen_name=CLAWRENAi", requiresProof: false, icon: "👤" },
  { id: "like_post", type: "like", title: "Like the CLAWRENA post", description: "Like our latest post on X.", points: 10, xUrl: "https://x.com/intent/like?tweet_id=2104738579637264735", requiresProof: false, icon: "❤️" },
  { id: "repost_post", type: "repost", title: "Repost the CLAWRENA post", description: "Repost our post to spread the word.", points: 10, xUrl: "https://x.com/intent/retweet?tweet_id=2104738579637264735", requiresProof: false, icon: "🔁" },
  { id: "quote_post", type: "quote", title: "Quote the CLAWRENA post", description: "Quote our post with your thoughts. Submit your quote URL.", points: 10, xUrl: "https://x.com/CLAWRENAi/status/2104738579637264735", requiresProof: true, proofPlaceholder: "https://x.com/yourhandle/status/...", icon: "💬" },
  { id: "reply_post", type: "reply", title: "Reply to the CLAWRENA post", description: "Reply to our post on X. Submit your reply URL.", points: 10, xUrl: "https://x.com/CLAWRENAi/status/2104738579637264735", requiresProof: true, proofPlaceholder: "https://x.com/yourhandle/status/...", icon: "↩️" },
];
export const CHECKIN_POINTS = 10;
export const REFERRAL_POINTS = 20;
