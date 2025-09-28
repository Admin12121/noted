import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Image } from "lucide-react";
import { SingleImageDropzoneUsage } from "./uploader";
import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

const CoverImageModal = ({ className, handleSaveMeta, ...props }: { className?: string, handleSaveMeta: (data: { coverImage?: string }) => void }) => {
  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger>
          <span
            className={cn(
              "text-muted-foreground text-xs cursor-pointer",
              buttonVariants({ variant: "outline", size: "sm" }),
              className
            )}
            {...props}
          >
            <Image />
            Change Cover
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0 relative -left-[15px] top-5">
          <Tabs defaultValue="gallary" className="items-center">
            <TabsList className="text-foreground gap-2 rounded-none bg-transparent pl-1 pr-2 pt-1 flex justify-between w-full">
              <span className="relative w-full">
                <TabsTrigger
                  value="gallary"
                  className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:-bottom-[4px] after:-mb-1 after:h-0.5 data-[state=active]:!bg-transparent data-[state=active]:border-none data-[state=active]:shadow-none"
                >
                  Gallary
                </TabsTrigger>
                <TabsTrigger
                  value="upload"
                  className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:-bottom-[4px] after:-mb-1 after:h-0.5 data-[state=active]:!bg-transparent data-[state=active]:border-none data-[state=active]:shadow-none"
                >
                  Upload
                </TabsTrigger>
                <TabsTrigger
                  value="links"
                  className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:-bottom-[4px] after:absolute after:inset-x-0 after:-mb-1 after:h-0.5 data-[state=active]:!bg-transparent data-[state=active]:border-none data-[state=active]:shadow-none"
                >
                  Link
                </TabsTrigger>
                <span className="text-muted-foreground text-xs cursor-pointer bg-accent px-2 py-1 rounded-md absolute right-0" onClick={() => handleSaveMeta({ coverImage: ""})}>
                  Remove
                </span>
              </span>
            </TabsList>
            <Separator className="-top-1 relative" />
            <TabsContent value="gallary">
              <p className="text-muted-foreground p-4 text-center text-xs">
                Content for Tab 1
              </p>
            </TabsContent>
            <TabsContent value="upload" className="w-full flex flex-col items-center justify-center px-2">
              <SingleImageDropzoneUsage/>
            </TabsContent>
            <TabsContent value="links" className="flex w-full flex-col px-2 items-center justify-center">
              <Input placeholder="Paste image link here..." />
              <Button size="sm" className="mt-4">Submit</Button>
              <p className="text-muted-foreground p-2 text-center text-xs">
                Works with any image from the web.
              </p>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CoverImageModal;
