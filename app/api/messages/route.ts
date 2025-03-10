import { NextRequest, NextResponse } from 'next/server';
import { createDirectMessageGroup, findDirectMessageGroup } from '@/lib/data';

export async function POST(request: NextRequest) {
  try {
    const { userId, userName,targetUserId,targetUserName } = await request.json();
    
    if (!userId || !targetUserId) {
      return NextResponse.json({ error: "ユーザーIDが不足しています" }, { status: 400 });
    }
    
    if (userId === targetUserId) {
      return NextResponse.json({ error: "自分自身にメッセージを送ることはできません" }, { status: 400 });
    }
    
    // 既存のDMグループを検索
    const existingGroups = await findDirectMessageGroup(userId,targetUserId);
    
    // 既存のグループが見つかった場合はそれを返す
    if (existingGroups && existingGroups.length > 0) {
      return NextResponse.json({ group: existingGroups[0] });
    }
    
    // 新しいDMグループを作成
    const newGroup = await createDirectMessageGroup(userId, userName,targetUserId,targetUserName);
    
    return NextResponse.json({ group: newGroup[0] });
    
  } catch (error) {
    console.error("メッセージグループ作成エラー:", error);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}