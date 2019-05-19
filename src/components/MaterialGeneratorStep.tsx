import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import * as React from 'react'
import styled from 'styled-components'

interface IProps {
	children: any
	hidden: boolean
	skippable?: boolean
	onClick?: any
}

const CustomGrid = styled(Grid)`
	&.hidden {
		display: none;
	}
`

const CustomButton = styled(Button)`
	margin-top: 1rem !important;
`

const MaterialGeneratorStep = ({children, hidden=false, skippable=false, onClick={}}: IProps) => (
	<>
	<CustomGrid item={true} xs={12} className={`${hidden ? 'hidden' : ''} animated slideInUp`}>
		{children}
		{
		skippable === true
		? (
			<CustomGrid container={true} justify="flex-end">
				<CustomButton variant="text" onClick={onClick}>Skip</CustomButton>
			</CustomGrid>
		) : null 
		}
	</CustomGrid>
	</>
)

export default MaterialGeneratorStep