import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

const FileUploadComponent = () => {
  return (
    <div>
        <form action="" className='flex flex-col gap-4'>
            <Input type="file" className='' size={10} />
            <Button type="submit">Upload</Button>
        </form>
    </div>
  )
}

export default FileUploadComponent