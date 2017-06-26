import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import FontAwesome from 'react-fontawesome'

const StepOne = styled.div`
  padding-top: 5px;
  position: relative;
`;

const TextInput = styled.input`
  border-radius: 5px;
  background-color: #000;
  padding-left: 5px;
  color: #FFFF66;
  margin-bottom: 10px;
`;

const InfoMsg = styled.div`
  color: #FFFF66;
`;

const LeftArrow = styled.div`
  height: 100%;
  width: 50px;
  position: absolute;
  top: 4px;
  left: 0;
  padding-top: 20px;
  font-size: 30px;
  cursor: pointer;
`;

const RightArrow = styled.div`
  height: 100%;
  width: 50px;
  position: absolute;
  top: 4px;
  right: 0;
  padding-top: 20px;
  font-size: 30px;
  cursor: pointer;
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

  arrowClicked(direction, e) {
    console.log('arrowClicked', direction);
    this.props.setStep(direction)
  }

  render() {
    console.log('render',this.props.coderunner.volatile);
    let { encodeString, resolution, tileShape, bgpColor, pixelColor, anim } = this.props.coderunner.orderParams;
    let { step } = this.props.coderunner.volatile;
    return (
      <StepOne>
        <div>Enter your text</div>
        <TextInput type="text" placeholder="www.acme.codes" data-ckey="encodeString" value={encodeString} onChange={this.changed.bind(this)} />
        <InfoMsg>This is where the scan goes to</InfoMsg>
        <LeftArrow style={(step < 2) ? {display: 'none'} : {}}>
          <FontAwesome name='arrow-circle-left' onClick={this.arrowClicked.bind(this, -1)} />
        </LeftArrow>
        <RightArrow>
          <FontAwesome name='arrow-circle-right' onClick={this.arrowClicked.bind(this, 1)} />
        </RightArrow>
      </StepOne>
    )
  }

}

export default PropsPanel
