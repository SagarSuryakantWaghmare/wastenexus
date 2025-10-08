'use client';
import {useState,useEffect} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';    
import {Button} from './ui/button';
import {Menu,Coins,Leaf,Search,Bell,User,ChevronDown,Settings,LogOut} from 'lucide-react';
import { DropdownMenu,DropdownMenuContent,DropdownMenuTrigger,DropdownMenuItem } from './ui/dropdown-menu';
import { Badge } from './ui/badge';
//@ts-expect-error: web3auth/modal does not have TypeScript types
import {web3Auth} from '@web3auth/modal';

import {CHAIN_NAMESPACES,IProvider,WEB3AUTH_NETWORK} from '@web3auth/base';
import {EthereumPrivateKeyProvider} from '@web3auth/ethereum-provider';
import { createUser, getUnreadNotifications, getUserByEmail } from '@/utils/db/action';
// import {useMediaQuery} from 'react-responsive';

const clientId=process.env.WEB3AUTH_CLIENT_ID||''; //get from web3auth dashboard


const chainConfig={
    chainNamespace:CHAIN_NAMESPACES.EIP155,
    chainId:'0xaa36a7',
    rpcTarget:'https://rpc.ankr.com/eth_sepolia',
    displayName:'Sepolia Testnet',
    blockExplorerUrl:'https://sepolia.etherscan.io/',
    ticker:'ETH',
    ticketName:'Ethereum',
    logo:'https://assets.web3Auth.io/web3auth-logo-ethereum.png',
}
const privateKeyProvider=new EthereumPrivateKeyProvider({
    // @ts-expect-error: EthereumPrivateKeyProvider expects a config object, but types may not match exactly
    config:chainConfig
});
// @ts-expect-error: Web3Auth constructor type mismatch with expected config object
const web3Auth=new Web3Auth({
    clientId,
    web3AuthNetwork:WEB3AUTH_NETWORK.TESTNET,
    privateKeyProvider
})

interface HeaderProps{
    onMenuClick:()=>void;
    totalEarnings:number;
}

export default function Header({onMenuClick,totalEarnings}:HeaderProps){
    const [provider,setProvider]=useState<IProvider|null>(null);
    const [loggedIn,setLoggedIn]=useState(false);
    const [loading,setLoading]=useState(true);
    const [userInfo,setUserInfo]=useState<any>(null);
    const pathname=usePathname();
    const [notifications,setNotifications]=useState<Notification[]>([]);
    const [balance,setBalance]=useState(0);
    useEffect(()=>{
        const init=async()=>{
            try {
               await web3Auth.initModal();
               setProvider(web3Auth.provider);

               if(web3Auth.connected){
                setLoggedIn(true);
                const user=await web3Auth.getUserInfo();
                setUserInfo(user);
                if(user.email){
                    localStorage.setItem('userEmail',user.email);
                    try {    
                        await createUser(user.email,user.name||'Anonymous User');
                    } catch (error) {
                        console.error('Error creating user',error);
                    }
                }
               }
            } catch (error) {
                console.error("Error initializing Web3Auth",error);
            }finally{
                setLoading(false);
            }
        }
        init();
    },[]);
    useEffect(()=>{
        const fetchNotifications=async()=>{
            if(userInfo&&userInfo.email){
                const user=await getUserByEmail(userInfo.email);
                if(user){
                    const unreadNotifications=await getUnreadNotifications(user.id);
                    setNotifications(unreadNotifications);
                }
            }
        }
        fetchNotifications();
        const notificationsInterval=setInterval(fetchNotifications,30000);
        return ()=>clearInterval(notificationsInterval);
    },[userInfo]);

    useEffect(()=>{
        const fetchUserBalance=async()=>{
            if(userInfo&&userInfo.email){
               const user=await getUserByEmail(userInfo.email);
               if(user){
                const userBalance=await getUserBalance(user.id);
               }
            }
        }
    })
}
