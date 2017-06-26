import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const containerHeight = window.innerHeight - 150;

const Container = styled.div`
  position: relative;
  height: ${containerHeight}px;
  background-color: #F05F40;
  color: #000;
  padding-top: 20px;
  padding-bottom: 20px;
`;

const PreviewImg = styled.img`
  height: ${containerHeight - 40}px;
`;

const EncodeString = styled.div`
  height: 20px;
  position: absolute;
  bottom: 5px;
  width: 100%;
  text-align: center;
`;

export const PreviewWindow = ({ encodeString }) => (
      <Container>
        <PreviewImg src="/default.gif" />
        <EncodeString style={{color: (encodeString === '') ? '#FFF' : '#000'}}>
          { (encodeString === '') ? 'www.acme.codes' : encodeString }
        </EncodeString>
      </Container> 
)

export default PreviewWindow
