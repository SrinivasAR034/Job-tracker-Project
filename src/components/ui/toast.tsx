
import * as React from "react"
import { X } from "lucide-react"

export interface ToastProps {
    message: string
    isVisible: boolean
    onClose: () => void
}

export function Toast({ message, isVisible, onClose }: ToastProps) {
    if (!isVisible) return null

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
                <span className="text-sm font-medium">{message}</span>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
