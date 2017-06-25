import React from 'react'
import PropTypes from 'prop-types'

export const Counter = ({ counter }) => (
  <div>
    This is a test
  </div>
)
Counter.propTypes = {
  counter: PropTypes.object.isRequired,
}

export default Counter
