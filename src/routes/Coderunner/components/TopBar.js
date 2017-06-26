import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import styledClassName from 'styled-classnames'

import FontAwesome from 'react-fontawesome'

const Container = styled.div`
    height: 50px;
    background-color: #000;
    color: #5979d4;
    line-height: 50px;
`;

const HamburgerIcon = styledClassName`
  color: #FFF;
  background-color: #00c5d3;
  border-radius: 30px;
  height: 30px;
  width: 30px;
  padding-top: 7px;
`;

export const TopBar = () => (
       <Container>
        <FontAwesome name='bars' className={HamburgerIcon} /> Make your acme codes here
      </Container> 
)

export default TopBar
