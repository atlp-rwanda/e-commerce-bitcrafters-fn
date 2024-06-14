import type {Meta, StoryObj} from "@storybook/react"
import Button from "../components/Button"

const meta: Meta<typeof Button>  ={
    component: Button,
    title:"Button",
    tags:["autodocs"]
}

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
    args: {
 variant:"red",
 label:"talk"
    }
}

export const Yellow: Story = {
    args: {
 variant:"yellow"
    }
}
export const New: Story = {
    args: {
 variant:"yellow"
    },
    render:(args) => <Button{...args}/>
}