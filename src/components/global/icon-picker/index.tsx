'use client'

import React from 'react'
import EmojiPicker, { Theme, EmojiStyle } from "emoji-picker-react"
import { useTheme } from "next-themes"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface IconPickerProps {
    onChange: (emoji: string) => void;
    children: React.ReactNode;
    asChild?: boolean;
}


const IconPicker = ({ onChange, children, asChild }: IconPickerProps) => {
    const { resolvedTheme } = useTheme()
    const currentTheme = (resolvedTheme || 'light') as keyof typeof ThemeMap;
    const ThemeMap = {
        light: Theme.LIGHT,
        dark: Theme.DARK,
    }
    const theme = ThemeMap[currentTheme];



    return (
        <Popover>
            <PopoverTrigger asChild={asChild}>
                {children}
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full bordedr-none shadow-none">
                <EmojiPicker theme={theme} height={450} onEmojiClick={(data) => onChange(data.emoji)} skinTonesDisabled emojiStyle={EmojiStyle.FACEBOOK}/>
            </PopoverContent>
        </Popover>
    )
}

export default IconPicker