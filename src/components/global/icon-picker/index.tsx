'use client'

import React from 'react'
import { useTheme } from "next-themes"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
interface IconPickerProps {
    onChange: (emoji: string) => void;
    children: React.ReactNode;
    asChild?: boolean;
}


const IconPicker = ({ onChange, children, asChild }: IconPickerProps) => {
    const { resolvedTheme } = useTheme()
    const currentTheme = (resolvedTheme || 'light');

    return (
        <Popover>
            <PopoverTrigger asChild={asChild}>
                {children}
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full bordedr-none shadow-none">
                <Picker data={data} onEmojiSelect={(emoji: any) => onChange(emoji.native)}
                    theme={currentTheme}     
                    previewPosition="none"
                    emojiButtonSize={32}
                    emojiSize={24}
                    skinTonesDisabled
                    set="native" />
            </PopoverContent>
        </Popover>
    )
}

export default IconPicker
{/* <Picker theme={theme} height={450} onEmojiClick={(data) => onChange(data.emoji)} skinTonesDisabled/> */ }
{/* poverContent className="p-0 w-full border-none shadow-none"> */ }