import Image from 'next/image'
import React from 'react'

const GoogleIcon = () => {
  return (
    <div>
        <Image width={30} height={30} src={'/google-icon.svg'} alt="google icon"/>
    </div>
  )
}

export default GoogleIcon