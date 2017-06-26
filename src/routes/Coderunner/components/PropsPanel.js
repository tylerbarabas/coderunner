import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StepOne = styled.div`
  padding-top: 5px;
`;

const TextInput = styled.input`
  border-radius: 5px;
  background-color: #000;
  padding-left: 5px;
  color: #FFFF66;
`;

class PropsPanel extends React.Component {
  static propTypes = {
    coderunner: PropTypes.object.isRequired,
    setProperty: PropTypes.func.isRequired
  }

  changed(e){
    let ckey = e.target.getAttribute('data-ckey');
    console.log('changed',ckey);
    this.props.setProperty(ckey, e.target.value);
  }

  render() {
    console.log('render',this.props.coderunner);
    let { encodeString, resolution, tileShape, bgpColor, pixelColor, anim } = this.props.coderunner.orderParams;
    return (
      <StepOne>
        <div>Enter your text</div>
        <TextInput type="text" data-ckey="encodeString" value={encodeString} onChange={this.changed.bind(this)} />
      </StepOne>
    )
  }

}

export default PropsPanel
