

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { signIn } from "next-auth/react";
import { Default_Login_Redirect } from "@/routes";
import Image from "next/image"

export default function LoginModal() {
  const onClick = async (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: Default_Login_Redirect,
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="!outline-none !ring-0 !shadow-none cursor-pointer relative group px-5 rounded-none h-[56px] w-[56px] border-none text-muted-foreground text-md">login</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2 mb-5">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <svg
              className="stroke-zinc-800 dark:stroke-zinc-100"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
            </svg>
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">Welcome back</DialogTitle>
            <DialogDescription className="sm:text-center">
              Enter your credentials to login to your account.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex flex-col items-center justify-center w-full gap-3">
          <Button
            size="lg"
            className="w-full bg-neutral-700  hover:bg-neutral-900 dark:bg-neutral-900 text-white rounded-xl justify-start gap-5 px-1 h-16"
            onClick={() => onClick("google")}
          >
            <span className="bg-neutral-950 p-3 rounded-xl">
              <Image
                src="google.svg"
                alt="Avatar"
                width={32}
                height={32}
                className="shrink-0 rounded-full"
              />
            </span>
            Continue with Google
          </Button>
          <Button
            size="lg"
            className="w-full bg-neutral-700  hover:bg-neutral-900 dark:bg-neutral-900 text-white rounded-xl justify-start gap-5 px-1 h-16"
            onClick={() => onClick("github")}
          >
            <span className="bg-neutral-950 p-3 rounded-xl">
              <Image
                src="github.svg"
                alt="Avatar"
                width={32}
                height={32}
                className="shrink-0 rounded-full invert"
              />
            </span>
            Continue with Github
          </Button>
        </div>
        <div className="mt-5 px-10 text-center">
          <p>By Continue, you agree to our Term and Privacy Policy</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
