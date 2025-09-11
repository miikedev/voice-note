"use client"
import { ArrowUpDown } from 'lucide-react'
import React, { useState } from 'react'
import { Toggle } from './ui/toggle'
import { Arrow } from '@radix-ui/react-select'
import { useAtom } from 'jotai'
import { toggleAtom } from '@/app/store'

const ToggleUpDownButton = () => {
    const [toggle, setToggle] = useAtom(toggleAtom)

    console.log('toggle', toggle)
  return (
    <Toggle pressed={toggle} onClick={() => setToggle(prev => !prev)} aria-label="Toggle italic">
      <ArrowUpDown className="h-4 w-4" />
    </Toggle>
  )
}

export default ToggleUpDownButton