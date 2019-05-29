import * as React from 'react'
import styled from 'styled-components'

interface IProps {
	onChange:any
	placeholder?:string
	value:string
}

const SearchField = styled('input')`
	padding: .7rem;
	border-radius: 4px;
	border: 2px solid var(--primary-color);
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