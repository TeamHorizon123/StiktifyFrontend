import { Input } from "antd"
import { ReactNode } from "react"

interface IProps {
    value: any,
    setValue: any,
    icon: ReactNode
}
const InputCustomize = (props: IProps) => {
    const { icon, setValue, value } = props
    return (
        <Input value={value} onChange={(e) => setValue(e.target.value)} addonAfter={icon} />
    )
}

export default InputCustomize