import { v4 as uuidv4 } from 'uuid'; // UUID生成ライブラリをインポート

// User データ
const users = [
  { id: uuidv4(), username: "alice", email: "alice@example.com", passwordHash: "hashed_password_1" },
  { id: uuidv4(), username: "bob", email: "bob@example.com", passwordHash: "hashed_password_2" },
  { id: uuidv4(), username: "charlie", email: "charlie@example.com", passwordHash: "hashed_password_3" },
];

// Group データ
const groups = [
  { id: uuidv4(), name: "Gaming Group", description: "A group for gamers", members: 10, isPublic: true, createdBy: users[0].id },
  { id: uuidv4(), name: "Private Study Group", description: "A private study group", members: 5, isPublic: false, createdBy: users[1].id },
];

// Thread データ
const threads = [
  {
    id: uuidv4(),
    userId: users[0].id,
    groupId: groups[0].id,
    title: "Favorite Games?",
    content: "What are your favorite games?",
    createdAt: new Date("2023-08-01T10:00:00Z"),
    commentCount: 2,
  },
  {
    id: uuidv4(),
    userId: users[1].id,
    groupId: groups[1].id,
    title: "Study Tips",
    content: "Any good tips for studying effectively?",
    createdAt: new Date("2023-08-02T12:30:00Z"),
    commentCount: 1,
  },
];

// Comment データ
const comments = [
  {
    id: uuidv4(),
    threadId: threads[0].id,
    userId: users[1].id,
    content: "I love RPG games like Final Fantasy!",
    createdAt: new Date("2023-08-01T10:15:00Z"),
  },
  {
    id: uuidv4(),
    threadId: threads[0].id,
    userId: users[2].id,
    content: "I enjoy FPS games like Call of Duty.",
    createdAt: new Date("2023-08-01T10:20:00Z"),
  },
  {
    id: uuidv4(),
    threadId: threads[1].id,
    userId: users[0].id,
    content: "Break your study sessions into shorter, focused blocks.",
    createdAt: new Date("2023-08-02T12:45:00Z"),
  },
];

// FavoriteGroup データ
const favoriteGroups = [
  { id: uuidv4(), userId: users[0].id, groupId: groups[1].id },
  { id: uuidv4(), userId: users[1].id, groupId: groups[0].id },
];

export { users, groups, threads, comments, favoriteGroups };
