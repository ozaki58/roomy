import { ArrowLeftIcon } from "lucide-react"

export default function ReplyBanner({comnentCount}: {comnentCount: number}) {
    
    return (
      <div className="flex items-center justify-between w-full max-w-3xl mx-auto p-2 bg-gray-200 rounded-lg shadow">  
        <span className="text-lg font-medium text-gray-700">{comnentCount}件の返信</span>
        <button className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          戻る
        </button>
      </div>
    )
  }