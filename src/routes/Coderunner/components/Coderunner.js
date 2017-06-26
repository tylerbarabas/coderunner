import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import TopBar from './TopBar'
import PreviewWindow from './PreviewWindow'
import PropsPanel from './PropsPanel'

export const Coderunner = (props) => (
      <div>
        <TopBar />
        <PreviewWindow encodeString={props.coderunner.orderParams.encodeString} />
        <PropsPanel coderunner={props.coderunner} setProperty={props.setProperty} />
      </div>
)

export default Coderunner
