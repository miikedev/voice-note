import Image from 'next/image'
import React from 'react'

const YoutubeIcon = () => {
  return (
    <div>
        <Image width={30} height={30} src={'/youtube-icon.svg'} alt="youtube icon"/>
    </div>
  )
}

export default YoutubeIcon