"use client"

import React, { useCallback, useEffect, useState } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import IconPicker from '@/components/global/icon-picker'
import { Ellipsis, Smile } from 'lucide-react'
import Spinner from '@/components/ui/spinner'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import Image from 'next/image'

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Safari } from '@/components/ui/safari'

const navigationLinks = [
    { href: "#", label: "Copy  Link" },
    { href: "#", label: "Move to Trash" },
    { href: "#", label: "Full Width" },
    { href: "#", label: "Lock Page" },
    {
        label: "Features",
        submenu: true,
        type: "description",
        items: [
            {
                href: "#",
                label: "Components",
                description: "Browse all components in the library.",
            },
            {
                href: "#",
                label: "Documentation",
                description: "Learn how to use the library.",
            },
            {
                href: "#",
                label: "Templates",
                description: "Pre-built layouts for common use cases.",
            },
        ],
    },
    {
        label: "Pricing",
        submenu: true,
        type: "simple",
        items: [
            { href: "#", label: "Product A" },
            { href: "#", label: "Product B" },
            { href: "#", label: "Product C" },
            { href: "#", label: "Product D" },
        ],
    },
    {
        label: "About",
        submenu: true,
        type: "icon",
        items: [
            { href: "#", label: "Getting Started", icon: "BookOpenIcon" },
            { href: "#", label: "Tutorials", icon: "LifeBuoyIcon" },
            { href: "#", label: "About Us", icon: "InfoIcon" },
        ],
    },
]

interface HeaderProps {
    title: string;
    icon: string;
    setValue: (val: { title?: string; icon?: string }) => void;
    handleSaveMeta: (val: { title?: string; icon?: string }) => void;
    saving: boolean;
}

const Header = ({ title, icon, setValue, handleSaveMeta, saving }: HeaderProps) => {
    const [open, setOpen] = useState(false);
    const [showSaved, setShowSaved] = useState(false);

    useEffect(() => {
        if (saving) {
            setShowSaved(false);
            return;
        }
        setShowSaved(true);
        const timeout = setTimeout(() => setShowSaved(false), 1200);
        return () => clearTimeout(timeout);
    }, [saving]);

    const handleOpenChange = useCallback((isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) handleSaveMeta({ title, icon });
    }, [handleSaveMeta, title, icon]);

    const renderIcon = () => {
        if (icon) {
            return icon.startsWith("data:image") ? (
                <Image height="40" width="40" src={icon} alt="icon" className="w-10 h-10 object-cover rounded" />
            ) : (
                <span className="font-emoji">{icon}</span>
            );
        }
        return <Smile className='!h-5 !w-5' />;
    };

    return (
        <div className='absolute -top-10 left-14 w-full h-8 flex px-2 items-center justify-between pr-16'>
            <Popover open={open} onOpenChange={handleOpenChange}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" className='text-xl px-2'>
                        {renderIcon()}
                        {title || "New Page"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 flex gap-2 p-2" side='bottom' align='start'>
                    <IconPicker onChange={emoji => setValue({ icon: emoji })} asChild>
                        <Button variant="outline" size="icon" className='text-muted-foreground text-xl font-emoji overflow-hidden'>
                            {renderIcon()}
                        </Button>
                    </IconPicker>
                    <Input value={title} onChange={e => setValue({ title: e.target.value })} />
                </PopoverContent>
            </Popover>
            <span className='flex gap-2'>
                {(saving || showSaved) && (
                    <span className='flex min-w-[80px] gap-2'>
                        {!showSaved && <Spinner size="sm" color='secondary' />}
                        {showSaved ? "saved" : "saving"}
                    </span>
                )}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button size={"sm"} variant={"secondary"}>Share</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 p-2 rounded-xl">
                        <Tabs defaultValue="tab-1" className="items-start">
                            <TabsList>
                                <TabsTrigger value="tab-1">Share</TabsTrigger>
                                <TabsTrigger value="tab-2">Publish</TabsTrigger>
                            </TabsList>
                            <TabsContent value="tab-1">
                                <p className="text-muted-foreground p-4 text-center text-xs">
                                    Content for Tab 1
                                </p>
                            </TabsContent>
                            <TabsContent value="tab-2" className='items-center w-full flex justify-center  flex-col gap-2'>
                                <p className="text-muted-foreground p-4 text-center text-ls">
                                    Publish to Web
                                </p>
                                <div className="relative">
                                    <Safari
                                        url="magicui.design"
                                        className="size-full"
                                        imageSrc="https://via.placeholder.com/1200x750"
                                    />
                                    <div
                                        style={{
                                            background:
                                                "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #171717 100%)"
                                        }}
                                        className="pointer-events-none absolute inset-0"
                                    />
                                </div>
                                <Button className='w-full'>Publish</Button>
                            </TabsContent>
                        </Tabs>
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            className="group size-8"
                            variant="ghost"
                            size="icon"
                        >
                            <Ellipsis />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-64 p-1">
                        <NavigationMenu className="max-w-none *:w-full">
                            <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                                {navigationLinks.map((link, index) => (
                                    <NavigationMenuItem key={index} className="w-full">
                                        {link.submenu ? (
                                            <>
                                                <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
                                                    {link.label}
                                                </div>
                                                <ul>
                                                    {link.items.map((item, itemIndex) => (
                                                        <li key={itemIndex}>
                                                            <NavigationMenuLink
                                                                href={item.href}
                                                                className="py-1.5"
                                                            >
                                                                {item.label}
                                                            </NavigationMenuLink>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        ) : (
                                            <NavigationMenuLink href={link.href} className="py-1.5">
                                                {link.label}
                                            </NavigationMenuLink>
                                        )}
                                        {/* Add separator between different types of items */}
                                        {index < navigationLinks.length - 1 &&
                                            // Show separator if:
                                            // 1. One is submenu and one is simple link OR
                                            // 2. Both are submenus but with different types
                                            ((!link.submenu &&
                                                navigationLinks[index + 1].submenu) ||
                                                (link.submenu &&
                                                    !navigationLinks[index + 1].submenu) ||
                                                (link.submenu &&
                                                    navigationLinks[index + 1].submenu &&
                                                    link.type !== navigationLinks[index + 1].type)) && (
                                                <div
                                                    role="separator"
                                                    aria-orientation="horizontal"
                                                    className="bg-border -mx-1 my-1 h-px w-full"
                                                />
                                            )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </PopoverContent>
                </Popover>
            </span>
        </div>
    )
}

export default Header