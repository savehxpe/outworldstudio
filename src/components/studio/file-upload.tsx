"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { motion } from "framer-motion"
import { Upload, FileAudio, X, Loader2 } from "lucide-react"
import { cn, formatBytes } from "@/lib/utils"

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>
  accept?: Record<string, string[]>
  maxSize?: number
  className?: string
}

export function FileUpload({
  onUpload,
  accept = { "audio/*": [".mp3", ".wav", ".flac"] },
  maxSize = 100 * 1024 * 1024,
  className,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) setFile(accepted[0])
    },
    []
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
    disabled: uploading,
  })

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    try {
      await onUpload(file)
      setFile(null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {!file ? (
        <div {...getRootProps()}>
          <motion.div
            whileHover={{ scale: 1.01 }}
            className={cn(
              "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all",
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-outline-variant/40 hover:border-primary/50 hover:bg-white/[0.02]"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-lg font-display text-on-surface">
                  {isDragActive ? "Drop your file here" : "Drop audio file here"}
                </p>
                <p className="text-sm text-on-surface-variant mt-1 font-mono">
                  or click to browse · MP3, WAV, FLAC up to 100MB
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileAudio className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-on-surface truncate max-w-[200px]">
                  {file.name}
                </p>
                <p className="text-xs font-mono text-outline">{formatBytes(file.size)}</p>
              </div>
            </div>
            <button
              onClick={() => setFile(null)}
              className="p-1.5 rounded-full hover:bg-surface-container transition-colors"
            >
              <X className="w-4 h-4 text-on-surface-variant" />
            </button>
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 w-full bg-primary text-background font-mono text-xs tracking-wider uppercase py-3 rounded-lg hover:shadow-[0_0_20px_rgba(0,219,233,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Upload & Process"
            )}
          </button>
        </motion.div>
      )}
    </div>
  )
}
