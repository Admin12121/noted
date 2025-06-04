"use client"
import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import IconPicker from '@/components/global/icon-picker'
import { Smile } from 'lucide-react'

interface HeaderProps {
    title: string;
    icon: string;
    setValue: (val: { title?: string; icon?: string }) => void;
}

const Header = ({ title, icon, setValue }: HeaderProps) => {
    ``

    return (
        <div className='absolute -top-10 left-14 w-full h-8 flex px-2 items-center justify-between'>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        className='text-xl px-2'
                    >
                        {icon && icon.startsWith("data:image") ? (
                            <img src={icon} alt="icon" className="w-10 h-10 object-contain rounded" />
                        ) : (
                            <p className=" font-emoji">{icon}</p>
                        )}
                        {title ? title : "New Page"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 flex gap-2 p-2" side='bottom' align='start'>
                    <IconPicker onChange={(emoji) => setValue({ icon: emoji })} asChild>
                        <Button variant={"outline"} size={"icon"} className='text-muted-foreground text-xl font-emoji overflow-hidden' >
                            {icon && icon.startsWith("data:image") ? (
                                <img src={icon} alt="icon" className="w-10 h-10 object-contain rounded" />
                            ) : (
                                <p className="font-emoji">{icon}</p>
                            )}
                            {!icon && <Smile className='!h-5 !w-5' />}
                        </Button>
                    </IconPicker>
                    <Input value={title} onChange={(e) => setValue({ title: e.target.value })} />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default Header