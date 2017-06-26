import React from 'react'
import PropTypes from 'prop-types'

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
        <input type="text" value={encodeString} onChange={this.changed.bind(this)} />
      </div>
    )
  }

}

export default Coderunner
