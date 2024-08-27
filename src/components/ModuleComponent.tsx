
import { FC } from 'react'

interface ModuleComponentProps {
    heading : string
    content : string
}

const ModuleComponent: FC<ModuleComponentProps> = ({ heading, content }) => {
    return <div className='m-12 flex flex-col'>
        <div className='text-3xl w-fit font-semibold ml-4'>
            {heading}
        </div>
        <div className='w-full text-3xl m-4 font-light'>
            {content}
        </div>
    </div>
}

export default ModuleComponent