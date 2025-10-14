'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

import { Button } from './ui/button';
import { Coins, Leaf, Bell, User, ChevronDown, LogIn } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from './ui/dropdown-menu';
import { Badge } from './ui/badge';

import { CHAIN_NAMESPACES } from '@web3auth/base';
import type { WEB3AUTH_NETWORK_TYPE } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { Web3Auth } from '@web3auth/modal';
import { createUser, getUnreadNotifications, getUserBalance, getUserByEmail, markNotificationAsRead } from '@/utils/db/action';
// import { useMediaQuery } from '@/hooks/useMediaQuery';

// Only use NEXT_PUBLIC_WEB3AUTH_CLIENT_ID for client-side code
const finalClientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '';
// Allow selecting the network from an env var so it matches your Web3Auth project
const selectedNetwork = process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK || 'testnet';
console.log('Web3Auth Client ID (client-side):', finalClientId);
console.log('Web3Auth selected network (client-side):', selectedNetwork);

// Note: chainConfig is created inside the client-side init to ensure rpcTarget is an absolute URL
// (the provider and Web3Auth SDK perform URL parsing and will fail for relative paths).
interface HeaderProps {
    onMenuClick?: () => void;
    totalEarnings?: number;
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

export default function Header({ totalEarnings = 0 }: HeaderProps) {
    // provider state is intentionally omitted; the SDK's provider is available from web3Auth when needed
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [balance, setBalance] = useState(0);
    const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);
    // media hook removed (not used) — keep function available if needed later

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

    // env warning flags removed (warnings rendered earlier were removed)

    if (loading) return <div className='py-6 text-center'>Loading web3 auth ....</div>

    return (
        <header className='bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm'>
            <div className='max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8'>
                <div className='h-16 flex items-center justify-between'>
                    {/* Left: logo */}
                    <div className='flex items-center gap-8 flex-shrink-0'>
                        <Link href='/' className='flex items-center gap-2'>
                            <div className='w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center'>
                                <Leaf className='h-6 w-6 text-white' />
                            </div>
                            <span className='font-bold text-xl text-gray-900'>WasteNexus</span>
                        </Link>

                        {/* Navigation Links - Desktop */}
                        <nav className='hidden lg:flex items-center gap-1'>
                            <Link href='/'>
                                <Button variant='ghost' className='text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium'>
                                    Home
                                </Button>
                            </Link>
                            <Link href='/reports'>
                                <Button variant='ghost' className='text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium'>
                                    Report Waste
                                </Button>
                            </Link>
                        </nav>
                    </div>

                    {/* Right: actions */}
                    <div className='flex items-center gap-3 flex-shrink-0'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='ghost' size='icon' className='relative p-2'>
                                    <Bell className='h-5 w-5 text-gray-700' />
                                    {notifications.length > 0 && (
                                        <Badge className='absolute -top-1 -right-1 rounded-full h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-white'>
                                            {notifications.length}
                                        </Badge>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='w-80'>
                                <div className='px-4 py-3 border-b border-gray-200'>
                                    <h3 className='font-semibold text-gray-900'>Notifications</h3>
                                </div>
                                <div className='max-h-96 overflow-y-auto'>
                                    {notifications.length > 0 ? (
                                        notifications.map((notification: NotificationItem) => (
                                            <DropdownMenuItem 
                                                key={notification.id} 
                                                onClick={() => handleNotificationClick(notification.id)} 
                                                className='px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100'
                                            >
                                                <div className='flex flex-col gap-1'>
                                                    <span className='font-medium text-gray-900 text-sm'>{notification.type}</span>
                                                    <span className='text-sm text-gray-600'>{notification.message}</span>
                                                </div>
                                            </DropdownMenuItem>
                                        ))
                                    ) : (
                                        <div className='px-4 py-8 text-center text-gray-500 text-sm'>
                                            No new notifications
                                        </div>
                                    )}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className='hidden md:flex items-center gap-2'>
                            <div className='flex items-center bg-green-50 border border-green-100 rounded-lg px-3 py-2'>
                                <Coins className='h-4 w-4 text-green-600 mr-2' />
                                <span className='font-semibold text-sm text-gray-900'>{balance.toFixed(2)}</span>
                                <span className='text-xs text-gray-500 ml-1'>points</span>
                            </div>
                        </div>

                        {!loggedIn ? (
                            <Button onClick={login} className='bg-green-600 hover:bg-green-700 text-white font-medium flex items-center gap-2'>
                                <span>Login</span>
                                <LogIn className='h-4 w-4' />
                            </Button>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='ghost' className='flex items-center gap-2 hover:bg-gray-50'>
                                        <div className='w-8 h-8 rounded-full bg-green-100 flex items-center justify-center'>
                                            <User className='h-4 w-4 text-green-600' />
                                        </div>
                                        <ChevronDown className='h-4 w-4 text-gray-700' />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end' className='w-56'>
                                    <div className='px-3 py-2 border-b border-gray-200'>
                                        <p className='font-medium text-gray-900'>{userInfo?.name || 'User'}</p>
                                        <p className='text-sm text-gray-500'>{userInfo?.email}</p>
                                    </div>
                                    <DropdownMenuItem className='cursor-pointer'>
                                        <Link href='/settings' className='w-full'>Settings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={logout} className='cursor-pointer text-red-600'>
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
