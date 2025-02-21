"use client"

import { X } from 'lucide-react'
import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

interface GitHubModalProps {
  isOpen?: boolean
  onClose?: () => void
  onSend?: () => void
}

export default function RaiseGitHubModal({ isOpen, onClose, onSend }: GitHubModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ title, description })
    onSend?.() 
    onClose?.() 
  }

  const handleClose = () => {
    setTitle('') 
    setDescription('')
    onClose?.() 
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-[600px] max-h-[500px] border border-blue-200">
            <div className="flex justify-between items-center p-4 border-gray-100">
              <h2 className="text-lg font-semibold text-[#742574]">Raise an issue in GitHub</h2>
              <Dialog.Close asChild>
                <button className="text-gray-500 hover:text-gray-700">
                  <X onClick={handleClose} className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="p-4">
              <p className="text-gray-400 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                ut labore
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm text-gray-600">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title for your issue"
                    className="w-full px-3 placeholder-gray-200 text-black py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-600">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write your issue"
                    rows={4}
                    className="w-full resize-none px-3 py-2 border border-gray-100 rounded-md focus:outline-none 
                    focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black placeholder-gray-200"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4 border-gray-100">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="flex-1 px-4 py-2 text-[#8C268C] bg-[#F8E9F8] border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      onClick={handleClose} // Handle close action on Cancel
                    >
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-white bg-[#A732A7] rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
