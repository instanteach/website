import * as React from 'react'

import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'

interface IProps {
	name: string
	value: string
	label: string
	required?: boolean
	onChange: any
}

const formControlStyles = {
	minWidth: '100%'
}
const radioGroupStyles = {
	justifyContent: 'space-between',
	minWidth: '100%'
}

const MaterialLevelSelector = ({name, value, onChange, label, required=false}: IProps) => (
	<FormControl style={formControlStyles} required={required}>
		<FormLabel component="legend">{label}</FormLabel>
		<RadioGroup
			name={name}
			value={value}
			onChange={onChange(name)}
			style={radioGroupStyles}
			row={true}>
			<FormControlLabel
				value="1"
				label="1"
				labelPlacement="start"
				control={<Radio color="primary" />}
				/>
			<FormControlLabel
				value="2"
				label="2"
				labelPlacement="start"
				control={<Radio color="primary" />}
				/>
			<FormControlLabel
				value="3"
				label="3"
				labelPlacement="start"
				control={<Radio color="primary" />}
				/>
			<FormControlLabel
				value="4"
				label="4"
				labelPlacement="start"
				control={<Radio color="primary" />}
				/>
			<FormControlLabel
				value="5"
				label="5"
				labelPlacement="start"
				control={<Radio color="primary" />}
				/>
			</RadioGroup>
	</FormControl>
)

export default MaterialLevelSelector