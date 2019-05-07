import * as React from 'react'
import styled from 'styled-components'

const AvatarUI = styled('img')`
	border-radius: 400px;
`

const Avatar = ({src, alt, size=60}:any) => (
	<AvatarUI src={src} alt={alt} style={{width:`${size}px`, height:`${size}px`}} />
)

export default Avatar