import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


class EventNameChanger extends Component {
    state = {
        title: null
    }

    handleResponse = res => {
        if (res.status !== 200) 
            throw Error(res.json().message);
        alert("Event title changed successfully!");
        return res;
    }
    
    handleError = err => {
        console.log(err);
        alert("Operation failed. Please try again");
    }

    updateEventTitle = async _ => {
        fetch(`/api/event/${this.props.eventID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: this.state.title
            })})
            .then(res => this.handleResponse(res))
            .then(_ => this.props.onChangeEventTitle())
            .catch(err => this.handleError(err));
    }

    render() {
        if (this.props.disabled)
            return <div />
        return(
            <div>
                <TextField
                    label="Change Title"
                    onChange={e => this.setState({ title: e.target.value })}
                />
                <Button 
                    variant="contained" 
                    color="primary" 
                    disabled={this.state.title == null}
                    onClick={this.updateEventTitle}>
                    Submit
                </Button>
            </div>
        );
    }
}

export default EventNameChanger;