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
 color:"red",
 value:"Button"
    }
}

export const Yellow: Story = {
    args: {
 color:"yellow",
  value:"Button"
    }
}
export const New: Story = {
    args: {
 color:"yellow",
  value:"Button"
    },
    render:(args) => <Button{...args}/>
}