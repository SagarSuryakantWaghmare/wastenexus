'use client';
import {useState,useEffect} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';    
import {Button} from './ui/button';
import {Menu,Coins,Leaf,Search,Bell,User,ChevronDown,Settings,LogOut} from 'lucide-react';
import { DropdownMenu,DropdownMenuContent,DropdownMenuTrigger,DropdownMenuItem } from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import {web3Auth} from '@web3auth/modal';

import {CHAIN_NAMESPACES,IProvider,WEB3AUTH_NETWORK} from '@web3auth/base';
import {EthereumPrivateKeyProvider} from '@web3auth/ehtereum-provider';
// import {useMediaQuery} from 'react-responsive';

const clientId=process.env.WEB3AUTH_CLIENT_ID||''; //get from web3auth dashboard


