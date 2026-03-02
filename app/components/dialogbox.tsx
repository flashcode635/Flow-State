"use client"

import { useState } from "react";

import { Plus } from "lucide-react";
import AddTaskDialog from "./Dialog";

export const Dialogbox=()=>{
      const [addOpen, setAddOpen] = useState(false);
      return(
        <>
        
        <AddTaskDialog open={addOpen} onOpenChange={setAddOpen} />
            <button
                onClick={() => setAddOpen(true)}
                className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                <Plus className="w-4 h-4" />
            </button>
        </>
      )
}