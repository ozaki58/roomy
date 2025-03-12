import postgres from 'postgres';
 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

import {
    User,
    Group,
    Thread,
    Comment,
    User_Group,

} from './definitions';

//publicかどうかで条件分岐
export async function fetchAllGroupsByUser(userId: string, isPublic: boolean) {
  try {
    console.log("Running query with:", { userId, isPublic });
   
    const data = await sql`
      SELECT 
        g.id ,
        g.name,
        g.description,
        g.members,
        g.is_public,
        g.created_by,
        g.image_url
      FROM groups g 
      JOIN user_groups ug ON g.id = ug.group_id
      WHERE ug.user_id = ${userId} AND g.is_public = ${isPublic}
    `;
    console.log("Query result:", data);
    return data;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

  export async function createGroupByUser(groupName:string, groupDescription:string, groupType:string, createdBy:string, imageUrl:string) {
    try {
      const isPublic = groupType === "public";
      const result = await sql`
        INSERT INTO groups (name, description, is_public, created_by,image_url)
        VALUES (${groupName}, ${groupDescription}, ${isPublic}, ${createdBy}, ${imageUrl})
        RETURNING *
      `;
      
      await joinGroup(createdBy, result[0].id);
      return result;
    }
    catch (error) {
      console.error("Database query error:", error); 
      throw error;
    }
  }
  
// スレッド作成関数
export async function createThread(
  groupId: string,
 
  content: string,
  createdBy: string
) {
  const result = await sql`
    INSERT INTO threads (group_id, content, user_id)
    VALUES (${groupId}, ${content}, ${createdBy})
    RETURNING *
  `;
  return result;
}

export async function fetchThreadsByGroup(groupId: string) {
  const result = await sql`
    SELECT
      t.id,
      t.group_id,
      t.likes_count,
      t.user_id,
      t.content,
      t.created_at,
      json_build_object(
        'id', u.id,
        'username', u.username,
        'image_url', u.image_url,
        'bio', u.bio,
        'interests', u.interests
      ) AS user,
      COALESCE(
        json_agg(
          json_build_object(
            'id', c.id,
            'thread_id', c.thread_id,
            'user_id', c.user_id,
            'content', c.content,
            'created_at', c.created_at,
            'user', json_build_object(
              'id', cu.id,
              'username', cu.username,
              'image_url', cu.image_url,
              'bio', cu.bio,
              'interests', cu.interests
            )
          )
        ) FILTER (WHERE c.id IS NOT NULL),
        '[]'
      ) AS comments
    FROM threads t
    LEFT JOIN users u ON t.user_id = u.id
    LEFT JOIN comments c ON t.id = c.thread_id
    LEFT JOIN users cu ON c.user_id = cu.id
    WHERE t.group_id = ${groupId}
    GROUP BY t.id, t.group_id, t.user_id, t.content, t.created_at, u.id, u.username, u.image_url, u.bio, u.interests
    ORDER BY t.created_at DESC
  `;
  return result;
}



// コメント一覧を取得する関数
export async function fetchCommentsByGroup(threadId: string) {
  const result = await sql`
    SELECT
      *
    FROM threads 
    WHERE thread_id = ${threadId}
    ORDER BY t.created_at DESC
  `;
  return result;
}


// コメント作成
export async function createCommentByUser(
  threadId: string,
 
  content: string,
  createdBy: string
) {
  const result = await sql`
    INSERT INTO comments (thread_id, content, user_id)
    VALUES (${threadId}, ${content}, ${createdBy})
    RETURNING *
  `;
  return result;
}


// スレッドidに紐づくコメント一覧を取得する関数
export async function fetchThreadById(threadId: string) {
  const result = await sql`
    SELECT
      t.id,
      t.likes_count,
      t.group_id,
      t.user_id,
      t.content,
      t.created_at,
      json_build_object(
        'id', u.id,
        'username', u.username,
        'image_url', u.image_url,
        'bio', u.bio,
        'interests', u.interests
      ) AS user,
      COALESCE(
        json_agg(
          json_build_object(
            'id', c.id,
            'thread_id', c.thread_id,
            'user_id', c.user_id,
            'content', c.content,
            'created_at', c.created_at,
            'user', json_build_object(
              'id', cu.id,
              'username', cu.username,
              'image_url', cu.image_url,
              'bio', cu.bio,
              'interests', cu.interests
            )
          )
        ) FILTER (WHERE c.id IS NOT NULL),
        '[]'
      ) AS comments
    FROM threads t
    LEFT JOIN users u ON t.user_id = u.id
    LEFT JOIN comments c ON t.id = c.thread_id
    LEFT JOIN users cu ON c.user_id = cu.id
    WHERE t.id = ${threadId}
    GROUP BY
      t.id,
      t.group_id,
      t.user_id,
      t.content,
      t.created_at,
      u.id,
      u.username,
      u.image_url,
      u.bio,
      u.interests
    LIMIT 1
  `;
  return result;
}


export async function fetchAllPublicGroups() {
  const result = await sql`
    SELECT * FROM groups
    WHERE is_public = TRUE
    ORDER BY created_at DESC

  `;
  return result;
}

// グループに参加
export async function joinGroup(userId: string, groupId: string) {
  
  const result = await sql`
    INSERT INTO user_groups (user_id, group_id)
    VALUES (${userId}, ${groupId})
    RETURNING *
  `;
  return result;
}

export async function checkJoinGroup(userId: string, groupId: string) {
  const result = await sql`
    SELECT 1 
    FROM user_groups
    WHERE user_id = ${userId} AND group_id = ${groupId}
  `;
  return result.length > 0;
}
export async function checkThreadLiked(userId: string, threadId: string) {
  const result = await sql`
    SELECT 1 
    FROM thread_likes
    WHERE user_id = ${userId} AND thread_id = ${threadId}
  `;
  return result.length > 0;
}
export async function GroupDetailById(groupId: string) {
  const result = await sql`
      SELECT 
        id,
        name,
        description,
        members,
        is_public,
        created_by,
        image_url
      FROM groups
      WHERE id = ${groupId}
      LIMIT 1
    `;
  return result;
}

export async function leaveGroup(userId: string, groupId: string) {
  try {
    const result = await sql`
      DELETE FROM user_groups
      WHERE user_id = ${userId} AND group_id = ${groupId}
      RETURNING *
    `;
    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}
export async function deleteLike(userId: string, threadId: string) {
  try {
    const result = await sql`
      DELETE FROM thread_likes
      WHERE user_id = ${userId} AND thread_id = ${threadId}
      RETURNING *
    `;
    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}
export async function createLike(userId: string, threadId: string) {
  try {
    const result = await sql`
      INSERT INTO thread_likes (user_id, thread_id)
      VALUES (${userId}, ${threadId})
      RETURNING *
    `;
    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}
export async function deleteThreadById(threadId: string) {
  try {
    const result = await sql`
      DELETE FROM threads
      WHERE id = ${threadId}
      RETURNING *
    `;
    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}
export async function deleteCommentById(commentId: string) {
  try {
    const result = await sql`
      DELETE FROM comments
      WHERE id = ${commentId}
      RETURNING *
    `;
    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

export async function updateUserProfile(userId: string,username: string,bio: string,interests: string,imageUrl:string) {
  try {
    const result = await sql`
    UPDATE users
    SET username = ${username},
        bio = ${bio},
        interests = ${interests},
        image_url = ${imageUrl}
    WHERE id = ${userId}
    RETURNING *
  `;
  return result;
  }
  catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

export async function UserDetailById(userId: string) {
  const result = await sql`
      SELECT 
        *
      FROM users
      WHERE id = ${userId}
      LIMIT 1
    `;
  return result;
}





// 既存のDMグループを検索する関数
export async function findDirectMessageGroup(userId: string, targetUserId: string) {
  const result = await sql`
    WITH direct_message_groups AS (
      SELECT g.*
      FROM groups g
      JOIN user_groups ug1 ON g.id = ug1.group_id AND ug1.user_id = ${userId}
      JOIN user_groups ug2 ON g.id = ug2.group_id AND ug2.user_id = ${targetUserId}
      WHERE g.is_direct_message = true
      AND g.members = 2
    )
    SELECT * FROM direct_message_groups
  `;
  
  return result;
}

// DMグループを新規作成する関数
export async function createDirectMessageGroup(userId: string, targetUserId: string,targetUserName: string) {
  
  
  const userName = await UserDetailById(userId);
  const groupName = `${userName} と ${targetUserName}`;
  
  // トランザクションを使用して、グループとユーザーグループ関連を同時に作成
  const result = await sql.begin(async (sql) => {
    // グループを作成
    const groupResult = await sql`
      INSERT INTO groups (
        name, description, is_public, is_direct_message, 
        created_by, members
      )
      VALUES (
        ${groupName}, 'プライベートメッセージ', false, true,
        ${userId}, 2
      )
      RETURNING *
    `;
    
    const groupId = groupResult[0].id;
    
    // ユーザーグループの関連付けを作成
    await sql`
      INSERT INTO user_groups (user_id, group_id)
      VALUES 
        (${userId}, ${groupId}),
        (${targetUserId}, ${groupId})
    `;
    
    return groupResult;
  });
  
  return result;
}

// 複数スレッドのいいね状態を一括取得する関数
export async function fetchBatchLikeStatus(userId: string, threadIds: string[]) {
  try {
    // 効率的なクエリ - IN句で複数のスレッドIDを一度に検索
    const result = await sql`
      SELECT thread_id
      FROM thread_likes
      WHERE user_id = ${userId}
      AND thread_id IN ${sql(threadIds)}
    `;
    
    console.log("DB結果:", result); // デバッグ出力
    
    // 結果をthreadId: trueの形式のオブジェクトに変換
    const likedThreadsMap: Record<string, boolean> = {};
    threadIds.forEach(id => {
      likedThreadsMap[id] = false;
    });
    
    // 各行を処理してマップを更新
    for (const row of result) {
      if (row && row.thread_id) {
        likedThreadsMap[row.thread_id] = true;
      }
    }
    
    console.log("変換後のマップ:", likedThreadsMap); // デバッグ出力
    return likedThreadsMap;
  } catch (error) {
    console.error("いいね状態の一括取得エラー:", error);
    throw error;
  }
}

// お気に入り関連の関数
export async function checkThreadFavorited(userId: string, threadId: string) {
  const result = await sql`
    SELECT 1 
    FROM thread_favorites
    WHERE user_id = ${userId} AND thread_id = ${threadId}
  `;
  return result.length > 0;
}

export async function createFavorite(userId: string, threadId: string) {
  try {
    const result = await sql`
      INSERT INTO thread_favorites (user_id, thread_id)
      VALUES (${userId}, ${threadId})
      RETURNING *
    `;
    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

export async function deleteFavorite(userId: string, threadId: string) {
  try {
    const result = await sql`
      DELETE FROM thread_favorites
      WHERE user_id = ${userId} AND thread_id = ${threadId}
      RETURNING *
    `;
    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

// 複数スレッドのお気に入り状態を一括取得する関数
export async function fetchBatchFavoriteStatus(userId: string, threadIds: string[]) {
  try {
    const result = await sql`
      SELECT thread_id
      FROM thread_favorites
      WHERE user_id = ${userId}
      AND thread_id IN ${sql(threadIds)}
    `;
    

    const favoritedThreadsMap: Record<string, boolean> = {};
    threadIds.forEach(id => {
      favoritedThreadsMap[id] = false;
    });
    
    for (const row of result) {
      if (row && row.thread_id) {
        favoritedThreadsMap[row.thread_id] = true;
      }
    }
    
    return favoritedThreadsMap;
  } catch (error) {
    console.error("お気に入り状態の一括取得エラー:", error);
    throw error;
  }
}

// 人気スレッド取得関数
export async function fetchPopularThreadsByGroup(groupId: string) {
  const result = await sql`
    SELECT
      t.id,
      t.group_id,
      t.likes_count,
      t.user_id,
      t.content,
      t.created_at,
      json_build_object(
        'id', u.id,
        'username', u.username,
        'image_url', u.image_url,
        'bio', u.bio,
        'interests', u.interests
      ) AS user,
      COALESCE(
        json_agg(
          json_build_object(
            'id', c.id,
            'thread_id', c.thread_id,
            'user_id', c.user_id,
            'content', c.content,
            'created_at', c.created_at,
            'user', json_build_object(
              'id', cu.id,
              'username', cu.username,
              'image_url', cu.image_url,
              'bio', cu.bio,
              'interests', cu.interests
            )
          )
        ) FILTER (WHERE c.id IS NOT NULL),
        '[]'
      ) AS comments
    FROM threads t
    LEFT JOIN users u ON t.user_id = u.id
    LEFT JOIN comments c ON t.id = c.thread_id
    LEFT JOIN users cu ON c.user_id = cu.id
    WHERE t.group_id = ${groupId}
    GROUP BY t.id, t.group_id, t.user_id, t.content, t.created_at, u.id, u.username, u.image_url, u.bio, u.interests
    ORDER BY t.likes_count DESC NULLS LAST, t.created_at DESC
    LIMIT 20
  `;
  return result;
}