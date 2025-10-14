import Link from "next/link";
import { usePathname } from "next/navigation";
import {Button} from "./ui/button";
import { MapPin,Trash,Coins,Medal,Settings,Home } from "lucide-react";

const sidebarItems=[
    {href:'/',label:'Home',Icon:Home},
    {href:'/reports',label:'Report Waste',Icon:MapPin},
    {href:'/collect',label:'Collect Waste',Icon:Trash},
    {href:'/rewards',label:'Rewards',Icon:Coins},
    {href:'/leaderboard',label:'Leaderboard',Icon:Medal},
]
interface SidebarProps{
    open:boolean;
}
export default function  Sidebar({open}:SidebarProps){
    const pathname=usePathname();

    return(
        <aside className={`bg-white border-r border-gray-200 text-gray-800 
        w-64 fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out
        ${open?'translate-x-0 ':`-translate-x-full`} lg:translate-x-0`}>
            <nav className="h-full flex flex-col justify-between pt-20">
                <div className="px-3 py-6 space-y-1">
                    {
                        sidebarItems.map((item)=>(
                            <Link href={item.href} key={item.href} passHref>
                                <Button 
                                    variant={pathname===item.href?'secondary':'ghost'}
                                    className={`w-full justify-start py-3 px-4 transition-all duration-200 ${
                                        pathname===item.href
                                        ?'bg-green-50 text-green-700 hover:bg-green-100 font-medium'
                                        :'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                     <item.Icon className="mr-3 h-5 w-5"/>
                                     <span>{item.label}</span>
                                </Button>
                            </Link>
                        ))
                    }

                </div>

                <div className="p-3 border-t border-gray-200">
                    <Link href='/settings' passHref>
                    <Button 
                        variant={pathname==='/settings'?'secondary':'ghost'}
                        className={`w-full justify-start py-3 px-4 transition-all duration-200 ${
                            pathname==='/settings'
                            ?'bg-green-50 text-green-700 hover:bg-green-100 font-medium'
                            :'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <Settings className="mr-3 h-5 w-5"/>
                        <span>Settings</span>
                    </Button>
                    </Link>

                </div>

            </nav>
        </aside>
    )
}