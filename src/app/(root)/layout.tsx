import dynamic from "next/dynamic";
import { cookies } from 'next/headers'

const SidebarLayout = dynamic(() => import("./_components"));

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies()
    const layout = cookieStore.get('react-resizable-panels:layout:mail')
    const collapsed = cookieStore.get('react-resizable-panels:collapsed')

    return (
        <main className="flex h-screen w-full bg-white dark:bg-[#191919]">
            <SidebarLayout layout={layout?.value} collapsed={collapsed?.value}>{children}</SidebarLayout>
        </main>
    )
}