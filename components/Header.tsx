'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

import { Button } from './ui/button';
import { Menu, Coins, Leaf, Search, Bell, User, ChevronDown, LogIn } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from './ui/dropdown-menu';
import { Badge } from './ui/badge';

import { CHAIN_NAMESPACES } from '@web3auth/base';
import type { WEB3AUTH_NETWORK_TYPE } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { Web3Auth } from '@web3auth/modal';
import { createUser, getUnreadNotifications, getUserBalance, getUserByEmail, markNotificationAsRead } from '@/utils/db/action';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Only use NEXT_PUBLIC_WEB3AUTH_CLIENT_ID for client-side code
const finalClientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '';
// Allow selecting the network from an env var so it matches your Web3Auth project
const selectedNetwork = process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK || 'testnet';
console.log('Web3Auth Client ID (client-side):', finalClientId);
console.log('Web3Auth selected network (client-side):', selectedNetwork);

// Note: chainConfig is created inside the client-side init to ensure rpcTarget is an absolute URL
// (the provider and Web3Auth SDK perform URL parsing and will fail for relative paths).
interface HeaderProps {
    onMenuClick: () => void;
    totalEarnings: number;
}

interface UserInfo {
    email?: string;
    name?: string;
}

interface NotificationItem {
    id: number;
    type: string;
    message: string;
}

export default function Header({ onMenuClick }: HeaderProps) {
    // provider state is intentionally omitted; the SDK's provider is available from web3Auth when needed
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [balance, setBalance] = useState(0);
    const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);
    const isMobile = useMediaQuery('(max-width:768px)');

    // Initialize Web3Auth inside the component to ensure client-side execution
    useEffect(() => {
        const initWeb3Auth = async () => {
            if (!finalClientId) {
                console.error('NEXT_PUBLIC_WEB3AUTH_CLIENT_ID is not set. Set it in .env.local and restart the dev server.');
                return;
            }

            // Optional: fetch the configuration endpoint directly to capture the full error body when 400
            try {
                const cfgUrl = `https://api.web3auth.io/signer-service/api/configuration?project_id=${encodeURIComponent(finalClientId)}&network=${encodeURIComponent(selectedNetwork)}&whitelist=true`;
                const cfgResp = await fetch(cfgUrl);
                if (!cfgResp.ok) {
                    let bodyText = '(<no body>)';
                    try { bodyText = await cfgResp.text(); } catch { }
                    console.error('Failed to fetch Web3Auth project configuration', cfgResp.status, cfgResp.statusText, bodyText);
                    // Don't proceed to initModal if config fetch failed — it will also fail.
                }
            } catch (e) {
                console.error('Error fetching Web3Auth project configuration', e);
            }

            // If user hasn't provided a NEXT_PUBLIC_RPC_URL, warn them; we will default to a same-origin proxy.
            if (!process.env.NEXT_PUBLIC_RPC_URL) {
                console.warn('No NEXT_PUBLIC_RPC_URL provided — using proxy at /api/rpc. If you use Ankr, set NEXT_PUBLIC_RPC_URL to your Ankr RPC URL (including API key) to avoid Unauthorized errors.');
            }

            // Build an absolute rpcTarget for the provider. SDKs may call new URL() and need an absolute URL.
            const rpcFromEnv = process.env.NEXT_PUBLIC_RPC_URL;
            const proxyPath = process.env.NEXT_PUBLIC_RPC_PROXY || '/api/rpc';
            let rpcTarget: string;
            if (rpcFromEnv) {
                rpcTarget = rpcFromEnv;
            } else if (typeof window !== 'undefined') {
                try {
                    rpcTarget = new URL(proxyPath, window.location.origin).toString();
                } catch {
                    // ensure we have an absolute URL
                    rpcTarget = `${window.location.origin}${proxyPath}`;
                }
            } else {
                rpcTarget = proxyPath; // server-side fallback
            }
            // sanitize rpcTarget
            if (typeof rpcTarget === 'string') rpcTarget = rpcTarget.trim();

            // Validate block explorer URL and sanitize
            let blockExplorer = 'https://testnet.explorer.sapphire.oasis.dev/';
            try {
                // if invalid this will throw
                new URL(blockExplorer);
            } catch {
                blockExplorer = '';
            }

            console.debug('Web3Auth init: rpcTarget=', rpcTarget, 'proxyPath=', proxyPath, 'rpcFromEnv=', rpcFromEnv);

            const chainConfig = {
                chainNamespace: CHAIN_NAMESPACES.EIP155,
                chainId: '0x5aff', // Sapphire Testnet chain ID
                rpcTarget,
                displayName: 'Sapphire Testnet',
                blockExplorerUrl: 'https://testnet.explorer.sapphire.oasis.dev/',
                ticker: 'TEST',
                ticketName: 'Sapphire Test',
                logo: 'https://assets.web3Auth.io/web3auth-logo-ethereum.png',
            };
            let privateKeyProvider;
            try {
                privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });
            } catch (err) {
                console.error('Failed to create EthereumPrivateKeyProvider', String(err), { chainConfig });
                return;
            }

            let web3AuthInstance;
            try {
                // selectedNetwork is provided from env and may be one of the dashboard network strings.
                // Web3Auth SDK typings are strict; allow the runtime string here.
                web3AuthInstance = new Web3Auth({
                    clientId: finalClientId,
                    web3AuthNetwork: selectedNetwork as unknown as WEB3AUTH_NETWORK_TYPE,
                    privateKeyProvider,
                });
            } catch (err) {
                console.error('Failed to construct Web3Auth instance', String(err));
                return;
            }

            setWeb3Auth(web3AuthInstance);
        };

        initWeb3Auth();
    }, []);
    useEffect(() => {
        const init = async () => {
            if (!web3Auth) return;
            
            try {
                console.log('Initializing Web3Auth with clientId:', finalClientId);
                if (!finalClientId) {
                    console.error('Web3Auth Client ID is missing!');
                    return;
                }
                await web3Auth.initModal();

                if (web3Auth && web3Auth.connected) {
                    setLoggedIn(true);
                    const user = await web3Auth.getUserInfo();
                    setUserInfo(user);
                    if (user.email) {
                        localStorage.setItem('userEmail', user.email);
                        try {
                            await createUser(user.email, user.name || 'Anonymous User');
                        } catch (error) {
                            console.error('Error creating user', error);
                        }
                    }
                }
            } catch (error) {
                console.error("Error initializing Web3Auth", error);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, [web3Auth]);
    useEffect(() => {
        const fetchNotifications = async () => {
            if (userInfo && userInfo.email) {
                const user = await getUserByEmail(userInfo.email);
                if (user) {
                    const unreadNotifications = await getUnreadNotifications(user.id);
                    setNotifications(unreadNotifications || []);
                }
            }
        }
        fetchNotifications();
        const notificationsInterval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(notificationsInterval);
    }, [userInfo]);

    useEffect(() => {
        const fetchUserBalance = async () => {
            if (userInfo && userInfo.email) {
                const user = await getUserByEmail(userInfo.email);
                if (user) {
                    const userBalance = await getUserBalance(user.id);
                    setBalance(userBalance);
                }
            }
        }

        fetchUserBalance()

        const handleBalanceUpdate = (event: CustomEvent) => {
            setBalance(event.detail);
        }
        // event name must be consistent (balanceUpdate)
        window.addEventListener('balanceUpdate', handleBalanceUpdate as EventListener)
        return () => {
            window.removeEventListener('balanceUpdate', handleBalanceUpdate as EventListener)

        }
    }, [userInfo])

    const login = async () => {
        if (!web3Auth) {
            console.error('Web3Auth is not initialized');
            return;
        }
        try {
            await web3Auth.connect();
            setLoggedIn(true);
            const user = await web3Auth.getUserInfo();
            setUserInfo(user)
            if (user.email) {
                localStorage.setItem('userEmail', user.email);
                try {
                    await createUser(user.email, user.name || 'Anonymous User')
                } catch (error) {
                    console.error('Error creating user:', error);
                }
            }
        } catch (error) {
            console.error("Error while login:", error);
        }
    }
    const logout = async () => {
        if (!web3Auth) {
            console.log("Web3Auth is not initialized");
            return;
        }
        try {
            await web3Auth.logout();
            setLoggedIn(false);
            setUserInfo(null);
            localStorage.removeItem('userEmail');
        } catch (error) {
            console.error('Error Logging out', error)
        }
    }

    const getUserInfo = async () => {
        if (web3Auth && web3Auth.connected) {
            const user = await web3Auth.getUserInfo()
            setUserInfo(user);
            if (user.email) {
                localStorage.setItem('userEmail', user.email)
                try {
                    await createUser(user.email, user.name || 'Anonymous User');
                } catch (error) {
                    console.log('Error creating user', error);
                }
            }
        }
    };

    const handleNotificationClick = async (notificationId: number) => {
        await markNotificationAsRead(notificationId);
    }

    const missingClient = !finalClientId;
    const missingRpc = !process.env.NEXT_PUBLIC_RPC_URL;

    if (loading) {
        return <div>Loading web3 auth ....</div>
    }
    return (
        <>

            <header className='bg-white border-b border-gray-200 sticky top-0 z-50'>
            <div className='flex items-center justify-between px-4 py-2'>
                <div className='flex items-center '>
                    <Button variant='ghost' size='icon' className='mr-2 md:mr-4' onClick={onMenuClick}>
                        <Menu className='h-6 w-6 text-gray-800' />

                    </Button>
                    <Link href='/' className='flex items-center' >
                        <Leaf className='h-8 w-8 text-green-500 mr-2' />
                        <span className='font-bold text-base md:text-lg text-gray-800'>WasteNexus</span>

                    </Link>
                </div>
                {!isMobile && (
                    <div className='flex-1 max-w-xl mx-4'>
                        <div className='relative'>
                            <input type="text"
                                placeholder='search....'
                                className='w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500'
                            />
                            <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 ' />

                        </div>
                    </div>
                )}
                <div className='flex items-center'>
                    {isMobile && (
                        <Button variant='ghost' size='icon' className='mr-2'>
                            <Search className='h-5 w-5' />
                        </Button>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild >
                            <Button variant='ghost' size='icon' className='mr-2 relative'>
                                <Bell className='h-5 w-5 text-gray-800' />
                                <Badge className='absolute -top-1 -right-1 rounded-full h-4 w-4 p-0 flex items-center justify-center text-xs'>
                                    {notifications.length}
                                </Badge>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-64'>
                            {notifications.length > 0 ? (
                                notifications.map((notification: NotificationItem) => (
                                    <DropdownMenuItem key={notification.id}
                                        onClick={() => handleNotificationClick(notification.id)} className='hover:bg-gray-100'>
                                        <div className='flex flex-col'>
                                            <span className='font-medium'>{notification.type}</span>
                                            <span className='text-sm text-gray-500'>
                                                {notification.message}
                                            </span>
                                        </div>
                                    </DropdownMenuItem>
                                ))
                            ) : (
                                <DropdownMenuItem>
                                    No new notifications
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className='mr-2 md:mr-4 flex items-center bg-gray-100 rounded-full px-2 md:px-3 py-1 '>
                        <Coins className='h-4 w-4 md:h-5 md:w-5 mr-1 text-green-500' />
                        <span className='font-semibold text-sm md:text-base text-gray-800'>
                            {balance.toFixed(2)}
                        </span>
                    </div>
                    {!loggedIn ? (
                        <Button onClick={login}
                            className='bg-green-600 hover:bg-green-700 text-white text-sm md:text-base'>
                            Login
                            <LogIn className='ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5' />
                        </Button>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='ghost' size='icon' className='items-center flex'>
                                    <User className='h-5 w-5 mr-1' />
                                    <ChevronDown className='h-4 w-4' />

                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuItem onClick={getUserInfo}>
                                    {userInfo ? userInfo.name : 'Profile'}
                                </DropdownMenuItem>
                                <DropdownMenuItem >
                                    <Link href='/settings'>Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem  onClick={logout}>
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    )
                    }

                </div>

            </div>
        </header>
        </>
    )
}
