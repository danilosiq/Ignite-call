import { ReactNode } from "react"

interface LayoutProps{
    children: ReactNode
    className?:string
}

export function Row({children, className}:LayoutProps){
    return <div className={`flex flex-row ${className}`}>{children}</div>
}

export function Column({children, className}:LayoutProps){
    return <div className={`flex flex-col ${className}`}>{children}</div>
}