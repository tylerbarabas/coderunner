import React from 'react'
//import { IndexLink, Link } from 'react-router'
import PropTypes from 'prop-types'

export const PageLayout = ({ children }) => (
  <div className='container text-center'>
    <p>Make your acme codes here</p>
    <div className='page-layout__viewport'>
      {children}
    </div>
  </div>
)
PageLayout.propTypes = {
  children: PropTypes.node,
}

export default PageLayout
