import IconPicker from '@/components/global/icon-picker'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Image, Smile, X } from 'lucide-react'
import React, { ElementRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

interface ToolKitProps {
    metaData: {
        title: string;
        icon?: string;
    }
    data: {
        title: string;
        icon?: string;
        coverImage?: string;
    };
    preview?: boolean;
    setValue: (val: { title?: string; icon?: string }) => void;
}

const ToolKit = ({ metaData, data, preview, setValue }: ToolKitProps) => {
    const inputRef = React.useRef<ElementRef<"textarea">>(null);
    const [isEditing, setIsEditing] = React.useState(false);

    const enableInput = () => {
        if (preview) return;
        setIsEditing(true);
        setTimeout(() => {
            // setValue(data.title);
            inputRef.current?.focus();
        }, 100)
    };

    const disableInput = () => { setIsEditing(false); };

    const onInput = (value: string) => {
        // setValue(value);
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
            {!!metaData.icon && !preview && (
                <div className='flex items-center gap-x-2 group/icon pt-6'>
                    <IconPicker onChange={(emoji) => setValue({ icon: emoji })}>
                        {metaData.icon && metaData.icon.startsWith("data:image") ? (
                            <img src={metaData.icon} alt="icon" className="w-14 h-14 object-contain" />
                        ) : (
                            <p className="text-6xl hover:opacity-75 transition font-emoji">{metaData.icon}</p>
                        )}
                    </IconPicker>
                    <Button onClick={() => setValue({ icon: "" })} className='rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs' variant={"outline"} size={"icon"}>
                        <X className='h-4 w-4' />
                    </Button>
                </div>
            )}
            {!!metaData.icon && preview && (
                metaData.icon && metaData.icon.startsWith("data:image") ? (
                    <img src={metaData.icon} alt="icon" className="w-14 h-14 object-contain" />
                ) : (
                    <p className="text-6xl pt-6 font-emoji">{metaData.icon}</p>
                )
            )
            }
            <div className='opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4'>
                {!metaData.icon && !preview && (
                    <IconPicker onChange={(emoji) => setValue({ icon: emoji })} asChild>
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
            {
                isEditing && !preview ?
                    <TextareaAutosize
                        ref={inputRef}
                        onBlur={disableInput}
                        onKeyDown={onKeyDown}
                        value={metaData.title}
                        onChange={(e) => setValue({ title: e.target.value })}
                        className='text-5xl bg-transparent font-bold break-words outline-none text=[#3F3F3F] dark:text-[#CFCFCF] resize-none'
                    />
                    :
                    <div className={cn('pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] cursor-pointer', !metaData.title && "text-[#3F3F3F]/10 dark:text-[#CFCFCF]/10")} onClick={enableInput}>
                        {metaData.title ? metaData.title : "New Page"}
                    </div>
            }
        </div >
    )
}

export default ToolKit