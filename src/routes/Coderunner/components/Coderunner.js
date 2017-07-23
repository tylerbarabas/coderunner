import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import TopBar from './TopBar'
import PreviewWindow from './PreviewWindow'
import PropsPanel from './PropsPanel'
import styled from 'styled-components'

const Container = styled.div `
	display: block;
	@media (orientation: landscape){
		display: block;
	}
`

export const Coderunner = (props) => (
      <Container>

        <TopBar />
        <PreviewWindow encodeString={props.coderunner.orderParams.encodeString} />
        <PropsPanel setStep={props.setStep} coderunner={props.coderunner} setProperty={props.setProperty} />
      </Container>
)

export default Coderunner
