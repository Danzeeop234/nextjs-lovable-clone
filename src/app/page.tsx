"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";

const Page = () => {
  const router = useRouter();
  const [value, setValue] = useState("")

  const trpc = useTRPC();
  const createProject = useMutation(trpc.projects.create.mutationOptions({
    onSuccess: (data) => {
      router.push(`/projects/${data.id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  }));

  return ( 
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-y-4">
        <Input 
          value={value}
          onChange={(e) => setValue(e.target.value)} 
        />
        <Button 
          disabled={createProject.isPending} 
          onClick={() => createProject.mutate({ value: value })}
        >
          Submit
        </Button>
      </div>
    </div>
   );
}
 
export default Page;