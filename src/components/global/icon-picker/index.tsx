'use client'

import React, { useState } from 'react'
import { useTheme } from "next-themes"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ImageIcon, SmileIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import Image from 'next/image'
interface IconPickerProps {
    onChange: (emoji: string) => void;
    children: React.ReactNode;
    asChild?: boolean;
}



const IconPicker = ({ onChange, children, asChild }: IconPickerProps) => {
    const { resolvedTheme } = useTheme()
    const currentTheme = (resolvedTheme || 'light');
    const [preview, setPreview] = useState<string | null>(null)


    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !file.type.startsWith("image/")) return alert("Upload image only.")
        const reader = new FileReader()
        reader.onload = (event) => {
            const url = event.target?.result as string
            setPreview(url)
            onChange(url)
        }
        reader.readAsDataURL(file)
    }

    return (
        <Popover>
            <PopoverTrigger asChild={asChild}>
                {children}
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full bordedr-none shadow-none">
                <Tabs defaultValue="emoji" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="emoji"><SmileIcon className="mr-1 w-4 h-4" /> Emoji</TabsTrigger>
                        <TabsTrigger value="upload"><ImageIcon className="mr-1 w-4 h-4" /> Upload</TabsTrigger>
                    </TabsList>
                    <TabsContent value="emoji" className="p-0">
                        <Picker data={data} onEmojiSelect={(emoji: any) => onChange(emoji.native)}
                            theme={currentTheme}
                            previewPosition="none"
                            emojiButtonSize={32}
                            emojiSize={24}
                            skinTonesDisabled
                            set="native" />

                    </TabsContent>
                    <TabsContent value="upload" className="p-4 text-center space-y-2">
                        <label htmlFor="image-upload" className="block border rounded-md p-4 cursor-pointer text-muted-foreground bg-muted/20 hover:bg-muted">
                            Upload an image
                            <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                        </label>
                        <p className="text-xs text-muted-foreground">or Ctrl+V to paste an image link</p>
                        {preview && <Image width={128} height={128} src={preview} alt="preview" className="mx-auto rounded-md max-h-32" />}
                    </TabsContent>
                </Tabs>
            </PopoverContent>
        </Popover>
    )
}

export default IconPicker
