import dynamic from "next/dynamic";

const SidebarLayout = dynamic(() => import("./_components"));
import { cookies } from 'next/headers'

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies()
    const layout = cookieStore.get('react-resizable-panels:layout:mail')
    const collapsed = cookieStore.get('react-resizable-panels:collapsed')

    return (
        <main className="flex h-screen w-full bg-[#191919]">
            <SidebarLayout layout={layout?.value} collapsed={collapsed?.value}>{children}</SidebarLayout>
        </main>
    )
}