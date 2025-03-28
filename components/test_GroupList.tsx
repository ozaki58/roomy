// ----- components/GroupList.tsx -----
'use client';

interface Group {
  id: string;
  name: string;
  description?: string | null;
  tags?: string[] | null;
  similarity?: number;
}

interface GroupListProps {
  test_groups: Group[];
}

export default function GroupList({ test_groups }: GroupListProps) {
  if (!test_groups || test_groups.length === 0) {
    return <p className="text-gray-500">グループが見つかりません。</p>;
  }
  
  return (
    <div className="space-y-4">
      {test_groups.map((group) => (
        <div key={group.id} className="p-4 border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold">{group.name}</h3>
          {group.description && (
            <p className="mt-2 text-gray-600">{group.description}</p>
          )}
          {group.tags && group.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {group.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-gray-100 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {group.similarity !== undefined && (
            <div className="mt-2 text-sm text-gray-500">
              類似度: {(group.similarity * 100).toFixed(1)}%
            </div>
          )}
        </div>
      ))}
    </div>
  );
}