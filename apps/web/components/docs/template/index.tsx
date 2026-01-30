import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

export interface TemplateProps extends React.HTMLAttributes<HTMLDivElement> {
    // Add props here
}

export function Template({ className, ...props }: TemplateProps) {
    return (
        <div className={cn("flex items-center justify-center p-4", className)} {...props}>
            Template Component
        </div>
    )
}
