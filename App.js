class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      counterBreak: 0,
      counterSession: 0,
      timeLeft: "",
      isPlaying: false,
      isSession: "Session",
    }
  }

  reset = () => {
    clearInterval(this.timer);
    document.getElementById("beep").pause();
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      counterBreak: this.state.breakLength * 60,
      counterSession: this.state.sessionLength * 60,
      timeLeft: this.setTimeLeft(this.state.sessionLength * 60),
      isPlaying: false,
      isSession: "Session"
    });
  }

  setTimeLeft = (time) => {
    let minutes = Math.trunc(time / 60);
    let seconds = time % 60;
    seconds < 10 ? seconds = "0" + seconds : seconds;
    return minutes + " : " + seconds;
  }

  breakDecrement = () => {
    if ((this.state.breakLength > 0) && (!this.state.isPlaying)) {
      this.setState({
        breakLength: this.state.breakLength - 1,
        counterBreak: this.state.breakLength * 60 - 60
      });
    }
  }

  breakIncrement = () => {
    if ((this.state.breakLength < 60) && (!this.state.isPlaying)) {
      this.setState({
        breakLength: this.state.breakLength + 1,
        counterBreak: this.state.breakLength * 60 + 60
      });
    }
  }

  sessionDecrement = () => {
    if ((this.state.sessionLength > 0) && (!this.state.isPlaying)) {
      this.setState({
        sessionLength: this.state.sessionLength - 1,
        counterSession: this.state.sessionLength * 60 - 60,
        timeLeft: this.setTimeLeft(this.state.sessionLength * 60 - 60)
      });
    }
  }

  sessionIncrement = () => {
    if ((this.state.sessionLength < 60) && (!this.state.isPlaying)) {
      this.setState({
        sessionLength: this.state.sessionLength + 1,
        counterSession: this.state.sessionLength * 60 + 60,
        timeLeft: this.setTimeLeft(this.state.sessionLength * 60 + 60)
      });
    }
  }

  play = () => {
    if (this.state.isPlaying) {
      clearInterval(this.timer);
      this.setState({
        isPlaying: false
      })
    } else {
      this.timer = setInterval(() => this.tick(), 100);
      this.setState({
        isPlaying: true
      })
    }
  }

  tick = () => {
    if (this.state.counterSession == 0 || this.state.counterBreak == 0) {
      document.getElementById("beep").play();
    }

    if (this.state.counterSession > 0) {
      this.setState({
        timeLeft: this.setTimeLeft(this.state.counterSession - 1),
        counterSession: this.state.counterSession - 1,
        counterBreak: this.state.breakLength * 60,
        isSession: "Session"
      })
    } else {
      this.setState({
        timeLeft: this.setTimeLeft(this.state.counterBreak - 1),
        counterSession: this.state.counterBreak - 1,
        counterBreak: this.state.sessionLength * 60,
        isSession: "Break"
      })
    }
  }

  componentDidMount = () => {
    this.reset();
  }

  render() {
    return (
      <div className="App container-fluid bg-secondary text-white">
        <PomodoroClock
          breaklength={this.state.breakLength}
          sessionlength={this.state.sessionLength}
          timeLeft={this.state.timeLeft}
          isPlaying={this.state.isPlaying}
          isSession={this.state.isSession}
          beep={this.state.beep}
          breakDecrement={this.breakDecrement.bind(this)}
          breakIncrement={this.breakIncrement.bind(this)}
          sessionDecrement={this.sessionDecrement.bind(this)}
          sessionIncrement={this.sessionIncrement.bind(this)}
          play={this.play.bind(this)}
          reset={this.reset.bind(this)} />
      </div>
    );
  }
}

class PomodoroClock extends React.Component {
  breakDecrement = () => this.props.breakDecrement();
  breakIncrement = () => this.props.breakIncrement();
  sessionDecrement = () => this.props.sessionDecrement();
  sessionIncrement = () => this.props.sessionIncrement();
  play = () => this.props.play();
  reset = () => this.props.reset();

  render() {

    // Play/pause button style
    let playStyle = "";
    if (this.props.isPlaying) {
      playStyle = "fas fa-pause m-1"
    } else {
      playStyle = "fas fa-play m-1";
    }

    return (
      <div className="d-flex flex-column justify-content-center align-items-center p-3 border border-white rounded-lg">
        <h1>Pomodoro Clock<hr /></h1>

        <div className="container">
          <div className="row">
            <div className="col-md-6 text-center">
              <p id="break-length">Break Length</p>
              <div className="d-flex justify-content-center align-items-center">
                <i id="break-decrement" className="fas fa-chevron-down m-1" onClick={this.breakDecrement.bind(this)}></i>
                <p id="break-length" className="m-1">{this.props.breaklength}</p>
                <i id="break-increment" className="fas fa-chevron-up m-1" onClick={this.breakIncrement.bind(this)}></i>
              </div>
            </div>
            <div className="col-md-6 text-center">
              <p id="session-length">Session Length</p>
              <div className="d-flex justify-content-center align-items-center">
                <i id="session-decrement" className="fas fa-chevron-down m-1" onClick={this.sessionDecrement.bind(this)}></i>
                <p id="session-length" className="m-1">{this.props.sessionlength}</p>
                <i id="session-increment" className="fas fa-chevron-up m-1" onClick={this.sessionIncrement.bind(this)}></i>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p id="timer-label">{this.props.isSession}</p>
          <h2 id="time-left">{this.props.timeLeft}</h2>
          <audio id="beep" src="alarm.wav"></audio>
          <div className="d-flex justify-content-center align-items-center">
            <i id="star_stop" className={playStyle} onClick={this.play.bind(this)}></i>
            <i id="reset" className="fas fa-sync-alt m-1" onClick={this.reset.bind(this)}></i>
          </div>
        </div>

      </div>
    );
  }
}

// Render Application in html page
ReactDOM.render(<App />, document.querySelector("#root"));
