import { db } from '@vercel/postgres'; // VercelのPostgresクライアントをインポート
import bcrypt from 'bcrypt';
import { users, groups, threads, comments, favoriteGroups } from '@/lib/roomy-data'; // 仮データをインポート

const client = await db.connect();

// User テーブルの作成とデータ挿入
async function seedUsers() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.passwordHash, 10);
      return client.sql`
        INSERT INTO users (id, username, email, password)
        VALUES (${user.id}, ${user.username}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

// Group テーブルの作成とデータ挿入
async function seedGroups() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS groups (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      members INT NOT NULL,
      is_public BOOLEAN NOT NULL,
      created_by UUID NOT NULL REFERENCES users(id)
    );
  `;

  const insertedGroups = await Promise.all(
    groups.map((group) =>
      client.sql`
        INSERT INTO groups (id, name, description, members, is_public, created_by)
        VALUES (${group.id}, ${group.name}, ${group.description}, ${group.members}, ${group.isPublic}, ${group.createdBy})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedGroups;
}

// Thread テーブルの作成とデータ挿入
async function seedThreads() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS threads (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      group_id UUID NOT NULL REFERENCES groups(id),
      user_id UUID NOT NULL REFERENCES users(id),
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  const insertedThreads = await Promise.all(
    threads.map((thread) =>
      client.sql`
        INSERT INTO threads (id, group_id, user_id, title, content, created_at)
        VALUES (${thread.id}, ${thread.groupId}, ${thread.userId}, ${thread.title}, ${thread.content}, ${thread.createdAt.toISOString()})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedThreads;
}

// Comment テーブルの作成とデータ挿入
async function seedComments() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS comments (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      thread_id UUID NOT NULL REFERENCES threads(id),
      user_id UUID NOT NULL REFERENCES users(id),
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  const insertedComments = await Promise.all(
    comments.map((comment) =>
      client.sql`
        INSERT INTO comments (id, thread_id, user_id, content, created_at)
        VALUES (${comment.id}, ${comment.threadId}, ${comment.userId}, ${comment.content}, ${comment.createdAt.toISOString()})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedComments;
}

// FavoriteGroup 中間テーブルの作成とデータ挿入
async function seedFavoriteGroups() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS favorite_groups (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id),
      group_id UUID NOT NULL REFERENCES groups(id)
    );
  `;

  const insertedFavoriteGroups = await Promise.all(
    favoriteGroups.map((favorite) =>
      client.sql`
        INSERT INTO favorite_groups (id, user_id, group_id)
        VALUES (${favorite.id}, ${favorite.userId}, ${favorite.groupId})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedFavoriteGroups;
}

// データベースのシードを実行
export async function GET() {
  try {
    await client.sql`BEGIN`; // トランザクションを開始
    await seedUsers();
    await seedGroups();
    await seedThreads();
    await seedComments();
    await seedFavoriteGroups();
    await client.sql`COMMIT`; // トランザクションをコミット

    return new Response(JSON.stringify({ message: 'Database seeded successfully' }), {
      status: 200,
    });
  } catch (error) {
    await client.sql`ROLLBACK`; // トランザクションをロールバック
    console.error(error instanceof Error ? error : new Error(String(error))); // エラーメッセージを適切に処理
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), { // エラーメッセージを適切に処理
      status: 500,
    });
  }
}
