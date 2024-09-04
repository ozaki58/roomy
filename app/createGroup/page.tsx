"use client";
import React, { useState } from 'react'
import { PlusCircleIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

export default function CreateGroupPage() {
  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [groupType, setGroupType] = useState('public')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the group data to your backend
    console.log({ groupName, groupDescription, groupType })
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">新しいグループを作成</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="groupName">グループ名</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="グループ名を入力"
              required
            />
          </div>
          <div>
            <Label htmlFor="groupDescription">グループの説明</Label>
            <Textarea
              id="groupDescription"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="グループの説明を入力"
              rows={4}
            />
          </div>
          <div>
            <Label>グループタイプ</Label>
            <RadioGroup value={groupType} onValueChange={setGroupType} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public">公開</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private">非公開</Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit" className="w-full">
            <PlusCircleIcon className="mr-2 h-4 w-4" /> グループを作成
          </Button>
        </form>
      </div>
    </div>
  )
}