import IconPicker from '@/components/global/icon-picker'
import { Button } from '@/components/ui/button'
import { Image, Smile, X } from 'lucide-react'
import React, { ElementRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

const ToolKit = ({ data, preview }: { data: any, preview?: boolean }) => {
    const inputRef = React.useRef<ElementRef<"textarea">>(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const [value, setValue] = React.useState(data.title);
    const enableInput = () => {
        if (preview) return;
        setIsEditing(true);
        setTimeout(() => {
            setValue(data.title);
            inputRef.current?.focus();
        }, 100)
    };

    const disableInput = () => { setIsEditing(false); };

    const onInput = (value: string) => {
        setValue(value);
        // api to update file name
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            disableInput();
        }
    };

    return (
        <div className='pl-[54px] group relative'>
            {!!data.icon && !preview && (
                <div className='flex items-center gap-x-2 group/icon pt-6'>
                    <IconPicker onChange={() => { }}>
                        <p className='text-6xl hover:opacity-75 transition'>{data.icon}</p>
                    </IconPicker>
                    <Button onClick={() => { }} className='rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs' variant={"outline"} size={"icon"}>
                        <X className='h-4 w-4' />
                    </Button>
                </div>
            )}
            {!!data.icon && preview && (
                <p className='text-6xl pt-6'>{data.icon}</p>
            )}
            <div className='opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4'>
                {!data.icon && !preview && (
                    <IconPicker onChange={() => { }} asChild>
                        <Button variant={"outline"} size={"sm"} className='text-muted-foreground text-xs'>
                            <Smile className='h-4 w-4 mr-2' />
                            Add Icon
                        </Button>
                    </IconPicker>
                )}
                {!data.coverImage && !preview && (
                    <Button variant={"outline"} size={"sm"} className='text-muted-foreground text-xs'>
                        <Image />
                        Add cover
                    </Button>
                )}
            </div>
            {isEditing && !preview ?
                <TextareaAutosize
                    ref={inputRef}
                    onBlur={disableInput}
                    onKeyDown={onKeyDown}
                    value={value}
                    onChange={(e) => onInput(e.target.value)}
                    className='text-5xl bg-transparent font-bold break-words outline-none text=[#3F3F3F] dark:text-[#CFCFCF] resize-none'
                />
                :
                <div className='pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] cursor-pointer' onClick={enableInput}>{data.title}</div>}
        </div>
    )
}

export default ToolKit