
'use client';
import { useState,useEffect } from "react";
import {Inter} from 'next/font/google';
import './gloabal.css';

import {Toaster} from 'react-hot-toast';

const inter=Inter({subsets:['latin']});

export default function RootLayout({
  childern,
}:{
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [totalEarnings,setT]
}