"use client";

import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useRouter } from 'next/navigation';
import { useChat } from '@/hooks/useChatContext';

function Layout() {

  return (
    <MainLayout />
  )
}

export default Layout