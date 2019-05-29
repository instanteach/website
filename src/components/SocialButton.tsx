import * as React from 'react'
import styled from 'styled-components'
import FacebookIcon from '../assets/images/icons/facebook.svg'
import GoogleIcon from '../assets/images/icons/google.svg'

interface IProps {
	as?: string
	type?: string
	children: JSX.Element | string
	className?: string
	style?: any
	onClick?: any
}

const SocialButtonUI = styled('button')`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: .75rem;
	border: 0;
	border-radius: 4px;
	background: white;
	text-align: center;
	width: 100%;
	box-shadow: 2px 2px 0 rgba(0,0,0,.2);
	outline: none;
	cursor: pointer;
	img {
		max-width: 20px;
		margin-right: .5rem;
	}
	&:hover {
		background-color: #eee;
	}
`

const SocialButton = ({as="google", type="button", children, className, style, onClick}: IProps) => (
	<SocialButtonUI
		type={type}
		onClick={onClick}
		style={style}
		className={`${className} as-${as}`}>
		<>
		<img src={as === "google" ? GoogleIcon : FacebookIcon} />
		{children}
		</>
	</SocialButtonUI>
)

export default SocialButton