class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
      if(!config){throw new Error("gimme config!");}
      //DBG field
      this._config = config;
      //----

      this._initialState = config.initial;
      this._currentState = this._initialState;
      this._prevState = null;
      this._canUndo = false;
      this._canRedo = false;
      this.uFlg = false;
      this.rFlg = false;

    }

    _allStates() {
      let arr = [];
      for (var key in this._config.states){
        arr.push(key)
      }
      return arr;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
      return this._currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
      if(this._config.states.hasOwnProperty(state)){
        this._prevState = this._currentState;
        //call from undo
        if(this.uFlg){
            this._canUndo = false;
            this._canRedo = true;
        }
        //call from redo
        else if(this.rFlg){
          this._canUndo = true;
          this._canRedo = false;
        }
        else{
          this._canUndo = true;
          this._canRedo = false;
        }

        this._currentState = state;
        this.uFlg = false;
        this.rFlg = false;
      }
      else {throw new Error("no such state");}
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
      if(this._config.states[this._currentState].transitions.hasOwnProperty(event)){
        this.changeState(this._config.states[this._currentState].transitions[event])
      }else{
          throw new Error("no such event");
      }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
      this.changeState(this._initialState);
      this._prevState = null;
      this._canUndo = false;
      this._canRedo = false;
      this.uFlg = false;
      this.rFlg = false;

    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
      if(event /*TODO check event validity*/){
        let eStates = [];
        for (let state in this._config.states){
          if(this._config.states[state].transitions.hasOwnProperty(event)){
            eStates.push(state);
          }
        }
        return eStates;
      }else {
        return this._allStates();
      }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
      if(this._canUndo){
        this._canUndo = false;
        this._canRedo = true;
        this.uFlg = true;
        this.changeState(this._prevState);
        return true;
      }else {
        return false;
      }

    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
      if(this._canRedo){
        // if(this._currentState == this._prevState){
        //   this._prevState = null;
        // }
        this._canUndo = true;
        this._canRedo = false;
        this.rFlg = true;
        this.changeState(this._prevState);

        return true;
      }else {
        return false;
      }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
      this._prevState = null;
      this._canUndo = false;
      this._canRedo = false;
      this.uFlg = false;
      this.rFlg = false;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
