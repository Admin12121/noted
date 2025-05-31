import {
  BoltIcon,
  CircleUserRoundIcon,
  EllipsisIcon,
  Layers2Icon,
  LogOutIcon,
  Plus,
  Settings,
  UserRound,
  UserRoundPlus,
} from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

interface UserModalProps {
  user: any;
  signOut?: () => void;
  detailed?: boolean;
  className?: string;
  variant?: "default" | "ghost" | "outline" | "secondary" | "destructive" | "link" | null | undefined;
}

export default function UserModal({
  user,
  signOut,
  detailed,
  className,
  variant = "ghost",
}: UserModalProps) {
  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} className={cn("!outline-none !ring-0 !shadow-none cursor-pointer relative group px-5 rounded-none border-none text-muted-foreground", !detailed && " w-[56px] h-[56px]", className)} aria-label="Open account menu">
          <Avatar className="rounded-md">
            <AvatarImage src={user?.image} alt={user.name} />
            <AvatarFallback><CircleUserRoundIcon size={24} className="!w-5 !h-5" aria-hidden="true" /></AvatarFallback>
          </Avatar>
          {detailed && (
            <span className="text-foreground truncate text-[1rem] font-medium">
              {user?.name || 'Anonymous User'}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn("max-w-64", detailed && "max-w-96 w-96")}>
        <DropdownMenuLabel className="flex items-start gap-3">
          <img
            src="avatar.svg"
            alt="Avatar"
            width={32}
            height={32}
            className="shrink-0 rounded-full"
          />
          <div className="flex min-w-0 flex-col">
            <span className="text-foreground truncate text-sm font-medium">
              {user?.name || 'Anonymous User'}
            </span>
            <span className="text-muted-foreground truncate text-xs font-normal">
              {user?.email || 'No email provided'}
            </span>
          </div>
        </DropdownMenuLabel>
        {detailed && <div className="flex flex-row gap-2 p-2">
          <Button variant={"outline"} className="cursor-pointer"><Settings /> setting</Button>
          <Button variant={"outline"} className="cursor-pointer"><UserRoundPlus /> invite members</Button>
        </div>}
        <DropdownMenuSeparator />
        {!detailed ? <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleNavigation('/profile')}>
            <BoltIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>manage account</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigation('/documents')}>
            <Layers2Icon size={16} className="opacity-60" aria-hidden="true" />
            <span>dashboard</span>
          </DropdownMenuItem>
        </DropdownMenuGroup> :
          <DropdownMenuGroup>
            <div className="p-2 flex flex-row items-center justify-between ">
              <p>{user.email}</p>
              <Button size={"icon"} variant={"ghost"} className="size-7"><EllipsisIcon /></Button>
            </div>
            <DropdownMenuItem >

              <span className={cn(buttonVariants({ variant: "default" }), "size-8")}>
                <UserRound />
              </span>
              <p className="text-[1rem]">{user.name} </p>
            </DropdownMenuItem>
            <DropdownMenuItem >
              <span className={cn(buttonVariants({ variant: "default", }), "size-8")}>
                <Plus />
              </span>
              <p className="text-[1rem]">New Workspace</p>
            </DropdownMenuItem>
          </DropdownMenuGroup>}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut?.()}>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
