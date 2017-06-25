import React from 'react'
//import { IndexLink, Link } from 'react-router'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  text-align: center;
`;

export const PageLayout = ({ children }) => (
  <Container>
    <div> {/*viewport*/}
      {children}
    </div>
  </Container>
)
PageLayout.propTypes = {
  children: PropTypes.node,
}

export default PageLayout
