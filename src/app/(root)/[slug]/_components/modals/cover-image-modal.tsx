import React from "react";
import { Button } from "@/components/ui/button";
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

const CoverImageModal = ({ className, ...props }: { className?: string }) => {
  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger>
          <Button
            variant={"outline"}
            size={"sm"}
            className={cn("text-muted-foreground text-xs")}
            {...props}
          >
            <Image />
            Change Cover
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0 relative -left-[40px]">
          <Tabs defaultValue="tab-1" className="items-center">
            <TabsList className="text-foreground gap-2 rounded-none bg-transparent pl-1 pr-2 pt-1 flex justify-between w-full">
              <span>
                <TabsTrigger
                  value="tab-1"
                  className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:-bottom-[4px] after:-mb-1 after:h-0.5 data-[state=active]:!bg-transparent data-[state=active]:border-none data-[state=active]:shadow-none"
                >
                  Gallary
                </TabsTrigger>
                <TabsTrigger
                  value="tab-2"
                  className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:-bottom-[4px] after:-mb-1 after:h-0.5 data-[state=active]:!bg-transparent data-[state=active]:border-none data-[state=active]:shadow-none"
                >
                  Upload
                </TabsTrigger>
                <TabsTrigger
                  value="tab-3"
                  className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:-bottom-[4px] after:absolute after:inset-x-0 after:-mb-1 after:h-0.5 data-[state=active]:!bg-transparent data-[state=active]:border-none data-[state=active]:shadow-none"
                >
                  Link
                </TabsTrigger>
              </span>
              <span className="text-muted-foreground text-xs cursor-pointer bg-accent px-2 py-1 rounded-md">Remove</span>
            </TabsList>
            <Separator className="-top-1 relative"/>
            <TabsContent value="tab-1">
              <p className="text-muted-foreground p-4 text-center text-xs">
                Content for Tab 1
              </p>
            </TabsContent>
            <TabsContent value="tab-2">
              <p className="text-muted-foreground p-4 text-center text-xs">
                Content for Tab 2
              </p>
            </TabsContent>
            <TabsContent value="tab-3">
              <p className="text-muted-foreground p-4 text-center text-xs">
                Content for Tab 3
              </p>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CoverImageModal;
