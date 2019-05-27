import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import * as React from 'react'
import styled from 'styled-components'

interface IProps {
	children: any
	hidden: boolean
	skippable?: boolean
	onClick?: any
	prev?:any
}

const CustomGrid = styled(Grid)`
	&.hidden {
		display: none;
	}
`

const CustomButton = styled(Button)`
	margin-top: 1rem !important;
`

const MaterialGeneratorStep = ({children, hidden=false, skippable=false, prev=null, onClick={}}: IProps) => (
	<>
	<CustomGrid item={true} xs={12} className={`${hidden ? 'hidden' : ''} animated slideInUp`}>
		{children}
		<CustomGrid container={true} justify="space-between">
			{
			prev !== null
			? <CustomButton variant="text" onClick={prev}>Back</CustomButton>
			: null
			}
			{
			skippable === true
			? <CustomButton variant="text" onClick={onClick}>Next</CustomButton>
			: null
			}
		</CustomGrid>
	</CustomGrid>
	</>
)

export default MaterialGeneratorStep