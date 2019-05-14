import * as React from 'react'
import styled from 'styled-components'

interface IProps {
	onChange:any
	placeholder?:string
	value:string
}

const SearchField = styled('input')`
	padding: .5rem;
	border-radius: 4px;
	border: 1px solid #ddd;
	width: 100%;
	outline: none;
`

const Search = ({onChange, value, placeholder}: IProps): JSX.Element => (
	<SearchField
		value={value}
		placeholder={placeholder}
		onChange={onChange} />
)

export default Search