import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const containerHeight = window.innerHeight - 50;

const Container = styled.div`
  float: left;
  display: block;
  background-color: red;
  width: 100%;
  height: ${containerHeight*0.6}px;
  @media (orientation: landscape){
    display: inline-block;
    background-color: pink;
    width:50%;
    height: ${containerHeight}px;
    }
          
          
`;

const PreviewImg = styled.img`
  height: ${containerHeight - 40}px;
  display: none;
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
