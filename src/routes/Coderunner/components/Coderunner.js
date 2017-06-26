import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import styledClassName from 'styled-classnames'
import FontAwesome from 'react-fontawesome'
import TopBar from './TopBar'
import PreviewWindow from './PreviewWindow'

class Coderunner extends React.Component {
  static propTypes = {
    coderunner: PropTypes.object.isRequired,
    setProperty: PropTypes.func.isRequired
  }


  constructor(props) {
    super(props)
    console.log('contructor',props);
    this.state = props.coderunner;
  }

  changed(e){
    console.log('changed',e.target.value);
    this.props.setProperty('encodeString', e.target.value)
  }

  render() {
    console.log('rendering...', this.state, this.props);
    let { encodeString, resolution, tileShape, bgpColor, pixelColor, anim } = this.props.coderunner;
    return (
      <div>
        <TopBar />
        <PreviewWindow encodeString={encodeString} />
        <input type="text" value={encodeString} onChange={this.changed.bind(this)} />
      </div>
    )
  }

}

export default Coderunner
