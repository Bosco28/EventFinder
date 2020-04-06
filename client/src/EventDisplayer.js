import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import MultiSelectTypeGroup from './MultiSelectTypeGroup';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import './EventDisplayer.css';


class EventDisplayer extends Component {
    state = {
        events: [],
        location: null,
        title: null,
        organizerName: null,
        types: null,
        startDate: null,
        endDate: null,
        loading: false
    }

    handleResponse = res => {
        if (res.status !== 200) 
            throw Error(res.json().message);
        return res;
    }
    
    handleError = err => {
        console.log(err);
        alert("Operation failed. Please try again");
        this.setState({ events: [], loading: false })
    }

    updateEvents = async () => {
        this.setState({ loading: true });
        
        fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                location: this.state.location,
                title: this.state.title,
                organizerName: this.state.organizerName,
                types: this.state.types,
                startDate: this.state.startDate,
                endDate: this.state.endDate,
            })})
            .then(res => this.handleResponse(res).json())
            .then(body => this.setState(
                { 
                    events: body, 
                    location: null,
                    title: null,
                    organizerName: null,
                    types: null,
                    startDate: null,
                    endDate: null,
                    loading: false
                }))
            .catch(err => this.handleError(err));
    }

    deleteEvent = async eventID => {
        this.setState({ loading: true});
        fetch(`/api/event/${eventID}`, {
            method: 'DELETE'
        })
        .then(res => this.handleResponse(res))
        .then(_ => this.setState(
            { 
                events: [], 
                location: null,
                title: null,
                organizerName: null,
                types: [],
                startDate: null,
                endDate: null,
                loading: false
            }))
        .then(_ => alert("Event deleted successfully."))
        .catch(err => this.handleError(err));
    }

    joinEvent = async eventID => {
        this.setState({ loading: true});
        fetch(`/api/event/${eventID}/user/${this.props.userID}`, {
            method: 'PUT'
        })
        .then(res => this.handleResponse(res))
        .then(_ => this.setState(
            { 
                events: [], 
                location: null,
                title: null,
                organizerName: null,
                types: [],
                startDate: null,
                endDate: null,
                loading: false
            }))
        .then(_ => alert("Event joined successfully."))
        .catch(err => this.handleError(err));
    }

    handleTitle = e => this.setState({title: e.target.value })

    handleLocation = e => this.setState({location: e.target.value })

    handleOrganizerName = e => this.setState({organizerName: e.target.value })

    handleTypes = e => this.setState({types: e.target.value })
    
    handleStartDate = e => this.setState({startDate: e.target.value })
    
    handleEndDate = e => this.setState({endDate: e.target.value })
    
    loadingIcon = () => <CircularProgress />

    handleDelete = _ => console.log("Delete")
    
    handleJoin = _ => console.log("Join")

    render() {
        return(
            <div className="EventDisplayer">
                <Container>
                    <h1> Filters </h1>
                    <br />
                    <TextField 
                        className="EventDisplayer-Input"
                        label="Title" 
                        variant="outlined" 
                        onChange={this.handleTitle}
                    /> 
                    <TextField 
                        className="EventDisplayer-Input"
                        label="Location" 
                        variant="outlined" 
                        onChange={this.handleLocation} 
                    /> 
                    <TextField 
                        className="EventDisplayer-Input"
                        label="Organizer Name" 
                        variant="outlined" 
                        onChange={this.handleOrganizerName} 
                    /> 
                    <MultiSelectTypeGroup 
                        onChange={this.handleTypes} />
                    <TextField
                        required
                        label="Start Date and Time"
                        type="datetime-local"
                        onChange={this.handleStartDate}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        required
                        label="End Date and Time"
                        type="datetime-local"
                        onChange={this.handleEndDate}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <br />
                    <Button 
                        className="EventDisplayer-Input"
                        color="primary" 
                        variant="contained"
                        onClick={this.updateEvents}
                    >
                        Search
                    </Button>
                </Container>
                <br />
                <Container>
                    <h1> Results </h1>
                    <br />
                    {this.state.loading ? 
                        this.loadingIcon() :
                        this.state.events.map(event => 
                            <Card key={event.EventID}>
                                <CardHeader
                                    title={event.Title}
                                    action={
                                        <ButtonGroup color="primary" aria-label="outlined primary button group">
                                            <Button 
                                                onClick={_ => this.joinEvent(event.EventID)} 
                                            >
                                                <AddCircleIcon />
                                            </Button>
                                            <Button 
                                                onClick={_ => this.deleteEvent(event.EventID)}
                                                disabled={event.OrganizerUserID !== this.props.userID}
                                            >
                                                <DeleteForeverIcon />
                                            </Button>
                                        </ButtonGroup>
                                    }
                                />
                                <CardContent>
                                    <Typography variant="body2" component="p" style={{ marginLeft: "10px" }}>
                                        Start Time:  {event.StartDate} <br />
                                        End Time:    {event.EndDate} <br />
                                        Description: {event.Description} <br />
                                        Location:    {event.LocationAddress} <br />
                                        Organizer:   {event.OrganizerName} <br />
                                        Attendees:   {event.Attendees} <br />
                                        Types:       {event.Types}
                                    </Typography>
                                </CardContent>
                            </Card>
                    )}
                </Container>
            </div>
        );
    }
}

export default EventDisplayer;