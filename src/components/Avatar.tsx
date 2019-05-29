import * as React from 'react'
import styled from 'styled-components'

const AvatarUI = styled('img')`
	border-radius: 400px;
`

const Avatar = ({src, alt, size=60, clickable=false}:any) => (
	<AvatarUI
		src={src}
		alt={alt}
		style={{
			cursor: clickable ? 'pointer' : 'auto',
			height:`${size}px`,
			width:`${size}px`
		}} />
)

export default Avatar